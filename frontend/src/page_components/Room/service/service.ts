import firebase from "firebase/app";
import { db, auth, UserInfoType } from "../../../utils/firebase";
import {
  convertFBApiResponse,
  retrieveFBErrorMessage,
  isNullOrUndefined,
} from "../../../utils/utilities";
import {
  NextRefType,
  ApiReturnRes,
  ApiReturnErrorRes,
  ApiReturnResponse,
  SearchFilterState,
  RoomListState,
} from "../../../utils/types";
import { en } from "../../../utils/language";

interface RoomInfo {
  username: string;
  roomName: string;
}

const _collection = (
  collectionName: string
): firebase.firestore.Query<firebase.firestore.DocumentData> => {
  return db.collection(collectionName);
};

// Fetch all existing room list
export const fetchRoomList = async (
  listFetchLimit: number,
  nextRef: any,
  filterObj: SearchFilterState
): Promise<ApiReturnResponse<RoomListState>> => {
  const roomList: firebase.firestore.DocumentData[] = [];
  let query = _collection(en.ROOMS);

  if (filterObj?.roomName) {
    query = query
      .where("roomName", ">=", filterObj?.roomName)
      .where("roomName", "<=", filterObj?.roomName + "z")
      .orderBy("roomName");
  }

  query = query.orderBy(en.DATE_CREATED);

  // nextRef is a pointer to fetch data collectly if there are more than 'listFetchLimit' data.
  if (nextRef) {
    query = query.startAfter(nextRef);
  }

  query = query.limit(listFetchLimit);

  try {
    const snapshot = await query.get();

    if (snapshot.empty) {
      return convertFBApiResponse(true, {
        rooms: roomList,
        nextRef: -1,
      }) as ApiReturnRes<RoomListState>;
    }

    snapshot.docs.forEach((item) => {
      if (item.exists) {
        roomList.push(item.data());
      }
    });

    // if data in firestore is less than 10, should stop fetch next time
    const lastFetchedItem: NextRefType =
      snapshot.docs.length === listFetchLimit
        ? snapshot.docs[snapshot.docs.length - 1]
        : -1;
    return convertFBApiResponse(true, {
      rooms: roomList,
      nextRef: lastFetchedItem,
    }) as ApiReturnRes<RoomListState>;
  } catch (err) {
    return convertFBApiResponse(
      false,
      retrieveFBErrorMessage(err)
    ) as ApiReturnErrorRes;
  }
};

// Create a new room
export const launchRoomService = async ({
  username,
  roomName,
}: RoomInfo): Promise<ApiReturnResponse<null>> => {
  const checkRoom = await db.collection(en.ROOMS).doc(roomName).get();

  // room is already exists
  if (checkRoom.exists) {
    return convertFBApiResponse(
      false,
      en.ROOM_ALREADY_EXISTS_ERROR
    ) as ApiReturnErrorRes;
  }

  if (!auth.currentUser) {
    return convertFBApiResponse(
      false,
      en.FETCH_USER_ERROR
    ) as ApiReturnErrorRes;
  }

  return db
    .collection(en.ROOMS)
    .doc(roomName)
    .set({
      users: [
        {
          name: username,
          email: auth.currentUser.email,
        },
      ],
      roomName,
      date_created: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => convertFBApiResponse() as ApiReturnRes<null>)
    .catch(
      (err) =>
        convertFBApiResponse(
          false,
          retrieveFBErrorMessage(err)
        ) as ApiReturnErrorRes
    );
};

// join to existing room
export const joinRoomService = async ({ username, roomName }: RoomInfo) => {
  try {
    const checkRoom = await db.collection(en.ROOMS).doc(roomName).get();

    // There's no room found
    if (!checkRoom.exists) {
      return convertFBApiResponse(false, en.ROOM_NOT_EXISTS_ERROR);
    }

    if (!auth.currentUser) {
      return convertFBApiResponse(false, en.FETCH_USER_ERROR);
    }

    const usersArray = await checkRoom.data()?.users;
    const dateCreated = await checkRoom.data()?.date_created;

    const user = await checkRoom.data()?.users.find((user: UserInfoType) => {
      return user.email === auth.currentUser!.email;
    });

    // If data field is null or undefined, there are broken data in the firestore, and need to remove them manually.
    if (isNullOrUndefined(usersArray) || isNullOrUndefined(dateCreated)) {
      return convertFBApiResponse(false, en.FETCH_DATA_ERROR);
    }

    // Check if user already joined the room before
    // If not, redirect to select user name page
    if (user) {
      return convertFBApiResponse();
    } else {
      return db
        .collection(en.ROOMS)
        .doc(roomName)
        .set({
          users: [
            ...usersArray,
            {
              name: username,
              email: auth.currentUser.email,
            },
          ],
          roomName,
          date_created: dateCreated,
        })
        .then(() => convertFBApiResponse())
        .catch((err) =>
          convertFBApiResponse(false, retrieveFBErrorMessage(err))
        );
    }
  } catch (error) {
    return convertFBApiResponse(false, retrieveFBErrorMessage(error));
  }
};
