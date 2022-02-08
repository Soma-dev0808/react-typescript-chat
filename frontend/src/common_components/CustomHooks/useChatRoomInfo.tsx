import { useEffect, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { setAPIError, startOrEndCallApi } from "../../features/apiStatSlice";

import {
  fetchUser,
  fetchMessages,
} from "../../page_components/Chat/service/service";
import { UseChatRoomInfoType, MessageArrayType } from "../../utils/types";
import { routePath } from "../../router/router";
import { en } from "../../utils/language";
import { ApiReturnRes } from "../../utils/types";

// Get chat room information from firebase by room name.
const useChatRoomInfo = (room: string): UseChatRoomInfoType => {
  const dispatch = useDispatch();
  // states
  const [username, setName] = useState<string>("");
  const [messages, setMessages] = useState<MessageArrayType[]>([]);

  // fetch chat information saved in FB
  const fecthChatInfo = useCallback(async () => {
    dispatch(startOrEndCallApi(true));

    const res1: ApiReturnRes = await fetchUser(room);
    const res2: ApiReturnRes = await fetchMessages(room);

    // if there's an error, set the error
    if (!res1.isSuccess || !res2.isSuccess) {
      const errArray: string[] = [];
      res1.errorMessage && errArray.push(res1.errorMessage);
      res2.errorMessage && errArray.push(res2.errorMessage);

      // set error messages here
      dispatch(
        setAPIError({
          apiErrorMessages: errArray,
          redirectPath: routePath.selectRoom,
        })
      );
      return;
    }

    // if there's no user added in the chat room
    if (!res1.value?.name) {
      dispatch(
        setAPIError({
          apiErrorMessages: en.USER_NOT_FOUND_IN_CHAT,
          redirectPath: routePath.selectRoom,
        })
      );

      return;
    }

    const userName = res1.value.name as string;
    setName(userName.trim().toLowerCase());

    // set messages stored in FB
    const storedMessages = res2.value as MessageArrayType[];
    setMessages(storedMessages);

    dispatch(startOrEndCallApi(false));
  }, [room, dispatch]);

  useEffect(() => {
    if (room) {
      fecthChatInfo();
    }
  }, [room, fecthChatInfo]);

  return { username, messages, setMessages };
};

export default useChatRoomInfo;
