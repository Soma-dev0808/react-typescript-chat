import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Location } from "history";
import io, { Socket } from "socket.io-client";
import { setAPIError, selectApiStatus } from "../../features/apiStatSlice";

import InfoBar from "./InfoBar/InfoBar";
import Input from "./Input/Input";
import Messages from "./Messages";
import ChatListSideBar from "./ChatListSideBar";
import LoadingIndicator from "../../common_components/LoadingIndicator";

import useChatRoomInfo from "../../common_components/CustomHooks/useChatRoomInfo";
import useRoomName from "../../common_components/CustomHooks/useRoomName";
import useDetectMobile from "../../common_components/CustomHooks/useDetectMobile";
import useFloatItemObserver from "../../common_components/CustomHooks/useFloatItemObserver";
import { saveMessages } from "./service/service";
import { en } from "../../utils/language";
import {
  ApiReturnRes,
  UseChatRoomInfoType,
  UseRoomNameType,
  CurrUsers,
  MessageArrayType,
  ApiReturnErrorRes,
} from "../../utils/types";

import "./Chat.scss";

const ENDPOINT: string =
  process.env.REACT_APP_SERVER_ENDPOINT || "Unknown end point";
let socket: Socket;

interface ChatProps {
  location: Location;
}

const Chat: React.FC<ChatProps> = ({ location }) => {
  const dispatch = useDispatch();
  const { isApiLoading } = useSelector(selectApiStatus);

  // states
  const [activeUsers, setActiveUsers] = useState<CurrUsers[]>([]);
  const [message, setMessage] = useState<string>("");

  const { room }: UseRoomNameType = useRoomName(location);
  const {
    userInfo,
    users,
    messages,
    setMessages
  }: UseChatRoomInfoType = useChatRoomInfo(room);

  // For side bar
  const isMobile = useDetectMobile();
  const { isShow: isShowSideBar, setIsShow, ref } = useFloatItemObserver();

  const username = userInfo?.name;
  const userEmail = userInfo?.email;

  // Start session
  useEffect(() => {
    socket = io(ENDPOINT);
    if (username && userEmail && room) {
      socket.emit(
        en.SOCKET_JOIN,
        { username, userEmail, room }
        // Currently no error return from BE
        //   (err) => {
        //   if (err) {
        //     setAPIError(err.err);
        //   }
        // }
      );
    }
  }, [username, userEmail, room]);

  // Start listening message from server and room data
  useEffect(() => {
    if (username) {
      socket.on(en.SOCKET_MESSAGE, async (message: MessageArrayType) => {
        // Make a delay to display a user enter or leave message.
        setTimeout(() => {
          setMessages((prev) => prev.concat(message));
        }, 500);
      });

      socket.on(en.SOCKET_ROOM_DATA, ({ users }: { users: CurrUsers[] }) => {
        setActiveUsers(users);
      });
    }
  }, [username, room, setMessages, setActiveUsers]);

  // When unload page, socket.io connection will be reset.
  useEffect(() => {
    window.onbeforeunload = function (e: BeforeUnloadEvent) {
      e.preventDefault();
      socket.emit(en.SOCKET_DISSCONNECTED);
      socket.off();
    };

    // clean up
    return () => {
      socket.emit(en.SOCKET_DISSCONNECTED);
      socket.off();
      window.onbeforeunload = null;
    };
  }, [room]);

  // Reset message, messages and active users.
  useEffect(() => {
    return () => {
      setMessage('');
      setMessages([]);
      setActiveUsers([]);
    };
  }, [room, setMessages]);

  // When location or screen type is changed, check side bar for mobile is opened.
  // Then close it if it's opened.
  useEffect(() => {
    if (isMobile && isShowSideBar) {
      setIsShow(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, isMobile, setIsShow]);

  const setIsShowSideBar = useCallback(setIsShow, [setIsShow]);

  // send input message
  const sendMessage = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    if (message && room && username) {
      socket.emit(en.SOCKET_SEND_MESSAGE, message, (err: string) => {
        if (err) {
          dispatch(setAPIError({ apiErrorMessages: err }));
        } else {
          setMessage("");
        }
      });
      const res: ApiReturnRes<null> = await saveMessages({
        message,
        room,
        username,
      });
      if (!res?.isSuccess) {
        const errMessage = res as ApiReturnErrorRes;
        dispatch(setAPIError({ apiErrorMessages: errMessage.errorMessage }));
      }
    }
  };

  // Set input message here.
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const inputValue: string = e.target.value;
    setMessage(inputValue);
  };

  // If it's not mobile, then assign true anyway.
  const _isShowSideBar = isMobile ? isShowSideBar : true;

  return (
    <>
      <div className="chat-outer-container">

        {/* Side bar */}
        <ChatListSideBar
          isShowSideBar={_isShowSideBar}
          clickObserver={ref}
        />
        {/* <TextContainer activeUsers={activeUsers} /> */}
        <div className="chat-container">
          <InfoBar
            room={room}
            users={users}
            activeUsers={activeUsers}
            setIsShowSideBar={setIsShowSideBar}
          />
          <Messages
            roomName={room}
            messages={messages}
            username={username ?? ''}
          />
          <Input
            message={message}
            handleInput={handleInput}
            sendMessage={sendMessage}
          />
        </div>
      </div>
      <LoadingIndicator isLoading={isApiLoading} />
    </>
  );
};

export default Chat;
