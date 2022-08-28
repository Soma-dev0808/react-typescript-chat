import React from 'react';

import useFindRoom from '../../../common_components/CustomHooks/useFindRoom';
import ChatListItem from '../ChatListItem';
import NoWrapLoadingIndicator from '../../../common_components/NoWrapLoadingIndicator';

import './ChatListSideBar.scss';

// todo: サイドバーをつくる(スクロールも含めて)
const ChatListSideBar = () => {

  const { isLoading, roomList } = useFindRoom(true);

  return (
    <div className='chatlist-sidebar-container'>

      {isLoading && <NoWrapLoadingIndicator />}

      {roomList.rooms.map((room, idx) => (
        <ChatListItem
          key={idx + room.date_created.seconds}
          roomName={room.roomName}
          users={room.users}
        />
      ))}

    </div>
  );
};



export default React.memo(ChatListSideBar);