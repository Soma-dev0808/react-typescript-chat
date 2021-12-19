import firebase from "firebase/app";
import { db, auth, UserInfoType, MessaageType } from "../../../utils/firebase";
import { en } from "../../../utils/language";
import { convertFBApiResponse, ApiReturnRes } from "../../../utils/utilities";

export const fetchUser = async (roomName: string): Promise<ApiReturnRes> => {
  const { DB_ROOM_COLLECTION, ROOM_NOT_EXISTS_ERROR, FETCH_USER_ERROR } = en;

  try {
    const checkRoom = await db
      .collection(DB_ROOM_COLLECTION)
      .doc(roomName)
      .get();

    if (!checkRoom.exists) {
      return convertFBApiResponse(false, ROOM_NOT_EXISTS_ERROR);
    }

    const user = await checkRoom
      .data()!
      .users.find(
        (user: UserInfoType) => user.email === auth.currentUser?.email
      );

    // Save user name to reducer
    return convertFBApiResponse(true, user);
  } catch (error) {
    return convertFBApiResponse(false, FETCH_USER_ERROR);
  }
};

export interface MessageArrayType extends MessaageType {
  id?: string;
}

export const fetchMessages = async (
  roomName: string
): Promise<ApiReturnRes> => {
  const {
    DB_ROOM_COLLECTION,
    DB_CHAT_COLLECTION,
    DB_ORDER_BY_CREATED_DATE,
    FETCH_MESSAGE_ERROR,
  } = en;

  try {
    const chats = await db
      .collection(DB_ROOM_COLLECTION)
      .doc(roomName)
      .collection(DB_CHAT_COLLECTION)
      .orderBy(DB_ORDER_BY_CREATED_DATE, "asc")
      .get();

    let messageArray: MessageArrayType[] = [];

    if (chats.empty) {
      return convertFBApiResponse(true, messageArray);
    }

    chats.forEach((chat) =>
      messageArray.push({
        id: chat.id,
        user: chat.data().user,
        text: chat.data().message,
        timeStamp: chat.data().date_created,
      })
    );

    return convertFBApiResponse(true, messageArray);
  } catch (error) {
    return convertFBApiResponse(false, FETCH_MESSAGE_ERROR);
  }
};

interface saveMessagesArgs {
  message: string;
  room: string;
  username: string;
}
export const saveMessages = async ({
  message,
  room,
  username,
}: saveMessagesArgs): Promise<ApiReturnRes> => {
  const { DB_ROOM_COLLECTION, DB_CHAT_COLLECTION, UPDATE_MESSAGE_ERROR } = en;

  return db
    .collection(DB_ROOM_COLLECTION)
    .doc(room)
    .collection(DB_CHAT_COLLECTION)
    .add({
      message,
      user: username,
      date_created: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => convertFBApiResponse())
    .catch(() => convertFBApiResponse(false, UPDATE_MESSAGE_ERROR));
};
