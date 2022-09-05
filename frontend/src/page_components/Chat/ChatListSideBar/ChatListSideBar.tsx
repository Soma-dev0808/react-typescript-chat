import React from 'react';

import useFindRoom from '../../../common_components/CustomHooks/useFindRoom';
import ChatListItem from '../ChatListItem';
import ScrollableRoomList from '../../../common_components/ScrollableRoomList';
import MobileWrapper from '../../../common_components/MobileWrapper';
import useDetectMobile from '../../../common_components/CustomHooks/useDetectMobile';
import { classNames } from '../../../utils/utilities';

import { RoomListState } from '../../../utils/types';
import './ChatListSideBar.scss';

interface ChatListSideBarProps {
  isShowSideBar: boolean;
  clickObserver: React.RefObject<HTMLDivElement>;
}

const listFetchLimit = 20;
const isPersonal = true;

// Sidebar which shows chat list
const ChatListSideBar: React.FC<ChatListSideBarProps> = ({
  isShowSideBar,
  clickObserver
}) => {
  // const [isBottom, setIsBottom] = useState<boolean>(false);
  const _useFindRoom = useFindRoom(isPersonal, listFetchLimit);
  const isMobile = useDetectMobile();

  const cls = classNames(
    'chatlist-sidebar-container',
    { 'chatlist-sidebar-container-mobile': isMobile },
    { 'chatlist-sidebar-container-mobile-show': isMobile && isShowSideBar }
  );

  // This will receive props from wrapper component.
  const RoomsReceiver: React.FC<Partial<RoomListState>> = ({ rooms }) => {
    if (!Array.isArray(rooms)) return null;

    const chatItems = rooms.map((room, idx) => (
      <ChatListItem
        key={idx + room.date_created.seconds}
        roomName={room.roomName}
        users={room.users}
      />
    ));

    return <>
      {chatItems}
    </>;
  };

  return (
    <MobileWrapper
      wrapperCls={classNames({ 'chatlist-sidebar-wrapper': isMobile && isShowSideBar })}
      isMobile={isMobile}
    >
      <ScrollableRoomList
        refProp={clickObserver}
        cls={cls}
        useFindRoom={_useFindRoom}
      >
        <RoomsReceiver />
      </ScrollableRoomList>
    </MobileWrapper>
  );
};

export default React.memo(ChatListSideBar);