import React, { useEffect, useState } from 'react';

import { RoomInfoType, FBTimeStamp, UserInfoType } from '../../../utils/firebase';
import ChatListItem from '../ChatListItem/ChatListItem';

import './ChatListSideBar.scss';

const chatList = () => {

  const getUserNames = (n: number): UserInfoType[] => {
    return [...new Array(n)].map((_, idx) => ({
      email: 'test',
      name: `user ${idx}`,
    }));
  };

  return [...new Array(20)].map((_, idx) => ({
    date_created: { seconds: new Date().getTime() + idx } as FBTimeStamp,
    roomName: `chat room ${idx}`,
    users: getUserNames(idx)
  }));
};

const useCustomRooms = () => {
  const [rooms, setRooms] = useState<Array<RoomInfoType>>();

  useEffect(() => { setRooms(chatList()); }, []);

  return rooms;
};

// todo: サイドバーをつくる
const ChatListSideBar = () => {
  const rooms = useCustomRooms();

  return (
    <div className='chatlist-sidebar-container'>
      {rooms?.map((chat, idx) => (
        <ChatListItem key={idx + chat.date_created.seconds} roomName={chat.roomName} users={chat.users} />
      ))}
    </div>
  );
};



export default ChatListSideBar;