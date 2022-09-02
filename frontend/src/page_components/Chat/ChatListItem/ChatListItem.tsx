import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import useRoomName from '../../../common_components/CustomHooks/useRoomName';

import { routePath } from '../../../router/router';
import { RoomInfoType } from '../../../utils/firebase';
import { classNames, createUrlWithQueryString, getUserNames } from '../../../utils/utilities';
import './ChatListItem.scss';

type ChatListItemProps = Partial<RoomInfoType>

const ChatListItem: React.FC<ChatListItemProps> = ({ roomName, users }) => {
    const history = useHistory();
    const { room } = useRoomName(useLocation());

    const handleChatClick = () => {
        if (!roomName || roomName === room) return;
        const nextUrl = createUrlWithQueryString(routePath.chat, { roomName });
        history.replace(nextUrl);
    };

    // Disable hover animation when current room is on-hover.
    const isCurrentItem = roomName === room;
    const cls = classNames(
        'chat-list-item-container',
        { 'chat-list-item-hover-disabled': isCurrentItem }
    );

    return (
        <div className={cls} onClick={handleChatClick}>
            <span className='chat-list-item-room-name'>{roomName}</span>
            {users && <span> {getUserNames(users)} </span>}
        </div>
    );
};

export default ChatListItem;