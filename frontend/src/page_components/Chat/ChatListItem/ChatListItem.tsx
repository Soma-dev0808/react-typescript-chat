import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import useRoomName from '../../../common_components/CustomHooks/useRoomName';

import { routePath } from '../../../router/router';
import { RoomInfoType } from '../../../utils/firebase';
import { createUrlWithQueryString, getUserNames } from '../../../utils/utilities';
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

    return (
        <div className='chat-list-item-container' onClick={handleChatClick}>
            <span className='chat-list-item-room-name'>{roomName}</span>
            {users && <span> {getUserNames(users)} </span>}
        </div>
    );
};

export default ChatListItem;