import { RoomInfoType, MessaageType, NextRefType } from "../utils/firebase";

// interfaces used to define a new object or method of an object.
interface MessageArrayType extends MessaageType {
  id?: string;
}

interface UseChatRoomInfoType {
  username: string;
  messages: MessageArrayType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageArrayType[]>>;
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

// types to create functions or return values.
interface RoomListState {
  rooms: Array<RoomInfoType>;
  nextRef: NextRefType;
}

type ApiReturnResponse<T> = ApiReturnRes<T> | ApiReturnErrorRes;

type ApiReturnRes<T> = {
  isSuccess: boolean;
  value?: T;
};

type ApiReturnErrorRes = {
  isSuccess: boolean;
  errorMessage: string;
};

type UseRoomNameType = {
  room: string;
};

// currently only sm available
enum TextFormInputSize {
  sm = "sm",
}

export { TextFormInputSize };

export type {
  MessageArrayType,
  UseChatRoomInfoType,
  ApiReturnResponse,
  ApiReturnErrorRes,
  ApiReturnRes,
  UseRoomNameType,
  UserInputProps,
  CurrUsers,
  SearchFilterState,
  RoomListState,
};
