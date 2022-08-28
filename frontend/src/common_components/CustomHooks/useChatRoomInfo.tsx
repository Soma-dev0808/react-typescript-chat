import { useEffect, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { setAPIError, startOrEndCallApi } from "../../features/apiStatSlice";

import {
  fetchUsers,
  fetchMessages,
} from "../../page_components/Chat/service/service";
import {
  UseChatRoomInfoType,
  MessageArrayType,
  ApiReturnErrorRes,
} from "../../utils/types";
import { routePath } from "../../router/router";
import { en } from "../../utils/language";
import { ApiReturnRes } from "../../utils/types";
import { UserInfoType, auth } from "../../utils/firebase";

// Get chat room information from firebase using room name.
const useChatRoomInfo = (room: string): UseChatRoomInfoType => {
  const dispatch = useDispatch();
  // states
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);
  const [users, setUsers] = useState<UserInfoType[]>([]);
  const [messages, setMessages] = useState<MessageArrayType[]>([]);

  // fetch chat information saved in FB
  const fecthChatInfo = useCallback(async () => {
    dispatch(startOrEndCallApi(true));

    const res1 = (await fetchUsers(room)) as ApiReturnRes<UserInfoType[]>;
    const res2 = (await fetchMessages(room)) as ApiReturnRes<MessageArrayType[]>;

    // if there's an error, set the error
    if (!res1.isSuccess || !res1.value || !res2.isSuccess) {
      const res1Err = res1 as ApiReturnErrorRes;
      const res2Err = res2 as ApiReturnErrorRes;
      const errArray: string[] = [];
      res1Err.errorMessage && errArray.push(res1Err.errorMessage);
      res2Err.errorMessage && errArray.push(res2Err.errorMessage);

      // set error messages here
      dispatch(
        setAPIError({
          apiErrorMessages: errArray,
          redirectPath: routePath.selectRoom,
        })
      );
      return;
    }

    const _users = res1.value;

    const user: UserInfoType | undefined = _users.find(
      (user: UserInfoType) => user.email === auth.currentUser?.email
    );

    // if there's no user added in the chat room
    if (!user || !user.name || !user.email) {
      dispatch(
        setAPIError({
          apiErrorMessages: en.USER_NOT_FOUND_IN_CHAT,
          redirectPath: routePath.selectRoom,
        })
      );

      return;
    }

    // set user name stored in FB
    const userName = user.name as string;
    setUserInfo({ name: userName.trim().toLowerCase(), email: user.email });

    // set users stored in FB
    setUsers(_users);

    // set messages stored in FB
    const storedMessages = res2.value as MessageArrayType[];
    setMessages(storedMessages);

    dispatch(startOrEndCallApi(false));
  }, [room, dispatch]);

  useEffect(() => {
    if (room) {
      fecthChatInfo();
    }

    return () => {
      setMessages([]);
      setUsers([]);
    };
  }, [room, fecthChatInfo]);

  return { userInfo, users, messages, setMessages };
};

export default useChatRoomInfo;
