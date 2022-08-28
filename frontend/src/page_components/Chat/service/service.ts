import firebase from "firebase/app";
import { db, UserInfoType } from "../../../utils/firebase";
import { en } from "../../../utils/language";
import {
  ApiReturnRes,
  ApiReturnErrorRes,
  MessageArrayType,
  ApiReturnResponse,
} from "../../../utils/types";
import { convertFBApiResponse, convertTsToTime } from "../../../utils/utilities";

export const fetchUsers = async (
  roomName: string,
): Promise<ApiReturnResponse<UserInfoType[]>> => {

  const {
    DB_ROOM_COLLECTION,
    ROOM_NOT_EXISTS_ERROR,
    FETCH_USER_ERROR,
  } = en;

  try {
    const checkRoom = await db
      .collection(DB_ROOM_COLLECTION)
      .doc(roomName)
      .get();

    if (!checkRoom.exists) {
      return convertFBApiResponse(
        false,
        ROOM_NOT_EXISTS_ERROR
      ) as ApiReturnErrorRes;
    }

    const users: UserInfoType[] = await checkRoom.data()!.users;

    // Save user name to reducer
    return convertFBApiResponse(true, users);

  } catch (error) {
    return convertFBApiResponse(false, FETCH_USER_ERROR) as ApiReturnErrorRes;
  }
};

export const fetchMessages = async (
  roomName: string
): Promise<ApiReturnResponse<MessageArrayType[]>> => {
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
        timeStamp: convertTsToTime(chat.data().date_created),
        dateInfo: new Date(
          chat.data().date_created.toDate()
        )?.toLocaleDateString()
      })
    );

    return convertFBApiResponse(true, messageArray);
  } catch (error) {
    return convertFBApiResponse(
      false,
      FETCH_MESSAGE_ERROR
    ) as ApiReturnErrorRes;
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
}: saveMessagesArgs): Promise<ApiReturnResponse<null>> => {
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
    .then(() => convertFBApiResponse() as ApiReturnRes<null>)
    .catch(
      () =>
        convertFBApiResponse(false, UPDATE_MESSAGE_ERROR) as ApiReturnErrorRes
    );
};
