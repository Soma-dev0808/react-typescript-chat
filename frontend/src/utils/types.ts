import { RoomInfoType, MessaageType, NextRefType, UserInfoType } from "../utils/firebase";

// interfaces used to define a new object or method of an object.
interface MessageArrayType extends MessaageType {
  id?: string;
}

interface UseChatRoomInfoType {
  userInfo: UserInfoType | null;
  users: UserInfoType[],
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
  email: string;
  room: string;
}

interface SearchFilterState {
  roomName?: string;
  isPersonal?: boolean,
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
