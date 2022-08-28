import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Prompt } from "react-router-dom";
import { History, Location } from "history";
import io, { Socket } from "socket.io-client";
import { setAPIError, selectApiStatus } from "../../features/apiStatSlice";

import InfoBar from "./InfoBar/InfoBar";
import Input from "./Input/Input";
import Messages from "./Messages";
import ChatListSideBar from "./ChatListSideBar";
import LoadingIndicator from "../../common_components/LoadingIndicator";

import useChatRoomInfo from "../../common_components/CustomHooks/useChatRoomInfo";
import useRoomName from "../../common_components/CustomHooks/useRoomName";
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
  history: History;
  location: Location;
}

const Chat: React.FC<ChatProps> = ({ location }) => {
  const dispatch = useDispatch();
  const { isApiLoading } = useSelector(selectApiStatus);

  // states
  const [activeUsers, setActiveUsers] = useState<CurrUsers[]>([]);
  const [message, setMessage] = useState<string>("");

  const { room }: UseRoomNameType = useRoomName(location);
  const { userInfo, users, messages, setMessages }: UseChatRoomInfoType = useChatRoomInfo(room);
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
        }, 300);
      });

      socket.on(en.SOCKET_ROOM_DATA, ({ users }: { users: CurrUsers[] }) => {
        setActiveUsers(users);
      });
    }
  }, [username, room, setMessages, setActiveUsers]);

  useEffect(() => {
    return () => {
      setMessages([]);
      setActiveUsers([]);
    };
  }, [room, setMessages]);

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

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const inputValue: string = e.target.value;
    setMessage(inputValue);
  };

  return (
    <>
      <div className="chat-outer-container">
        {/* Side bar */}
        <ChatListSideBar />
        {/* <TextContainer activeUsers={activeUsers} /> */}
        <div className="chat-container">
          <InfoBar room={room} users={users} activeUsers={activeUsers} />
          <Messages messages={messages} username={username ?? ''} />
          <Input
            message={message}
            handleInput={handleInput}
            sendMessage={sendMessage}
          />
        </div>
      </div>
      <LoadingIndicator isLoading={isApiLoading} />
      <Prompt message={en.CONFIRM_LEAVE_PAGE_MESSAGE} />
    </>
  );
};

export default Chat;
