import firebase from "firebase/app";

interface MessaageType {
  user: string;
  text: string;
  timeStamp?: firebase.firestore.Timestamp | string;
}

interface MessageArrayType extends MessaageType {
  id?: string;
}

interface UseChatRoomInfoType {
  username: string;
  messages: MessageArrayType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageArrayType[]>>;
}

interface ApiReturnRes {
  isSuccess: boolean;
  value?: any;
  errorMessage?: string;
}

interface UseRoomNameType {
  room: string;
}

type NextRefType =
  | number
  | null
  | firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>;

// currently only sm available
enum TextFormInputSize {
  sm = "sm",
}

interface UserInputProps {
  username?: string;
  email: string;
  password: string;
}

interface CurrUsers {
  id: number;
  name: string;
  room: string;
}

interface SearchFilterState {
  roomName: string;
}

export { TextFormInputSize };

export type {
  MessaageType,
  MessageArrayType,
  UseChatRoomInfoType,
  ApiReturnRes,
  UseRoomNameType,
  NextRefType,
  UserInputProps,
  CurrUsers,
  SearchFilterState,
};
