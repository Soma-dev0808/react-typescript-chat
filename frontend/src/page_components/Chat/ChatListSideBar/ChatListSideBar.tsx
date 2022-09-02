import React from 'react';

import useFindRoom from '../../../common_components/CustomHooks/useFindRoom';
import ChatListItem from '../ChatListItem';
import NoWrapLoadingIndicator from '../../../common_components/NoWrapLoadingIndicator';
import useDetectMobile from '../../../common_components/CustomHooks/useDetectMobile';
import { classNames } from '../../../utils/utilities';

import './ChatListSideBar.scss';

interface ChatListSideBarProps {
  isShowSideBar: boolean;
  clickObserver: React.RefObject<HTMLDivElement>;
}

// todo: サイドバーをつくる(スクロールも含めて)
const ChatListSideBar: React.FC<ChatListSideBarProps> = ({
  isShowSideBar,
  clickObserver
}) => {

  const { isLoading, roomList } = useFindRoom(true);
  const isMobile = useDetectMobile();

  const cls = classNames(
    'chatlist-sidebar-container',
    { 'chatlist-sidebar-container-mobile': isMobile },
    { 'chatlist-sidebar-container-mobile-show': isMobile && isShowSideBar }
  );

  return (
    <MobileWrapper
      isMobile={isMobile}
      isShowSideBar={isShowSideBar}
    >
      <div ref={clickObserver} className={cls}>

        {isLoading && <NoWrapLoadingIndicator />}

        {roomList.rooms.map((room, idx) => (
          <ChatListItem
            key={idx + room.date_created.seconds}
            roomName={room.roomName}
            users={room.users}
          />
        ))}

      </div>
    </MobileWrapper>
  );
};

interface CustomWrapperProps {
  isMobile: boolean;
  isShowSideBar: boolean;
}

// When the screen is for mobile, add div element to create clickable background area.
const MobileWrapper: React.FC<CustomWrapperProps> = React.memo(({
  children,
  isMobile,
  isShowSideBar
}) => {

  const wrapperCls = classNames({ 'chatlist-sidebar-wrapper': isMobile && isShowSideBar });

  // If it's not mobile, just return children in fragemnt.
  const Wrapper = !isMobile
    ? <> {children} </>
    : <div className={wrapperCls}>
      {children}
    </div>;

  return Wrapper;
});


export default React.memo(ChatListSideBar);