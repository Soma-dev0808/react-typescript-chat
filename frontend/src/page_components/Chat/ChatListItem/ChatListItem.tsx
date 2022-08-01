import React from 'react';

import { RoomInfoType, UserInfoType } from '../../../utils/firebase';
import './ChatListItem.scss';

type ChatListItemProps = Partial<RoomInfoType>

const ChatListItem: React.FC<ChatListItemProps> = ({ roomName, users }) => {
    const getUserNames = (_users: UserInfoType[]) => {
        let userNames = '';
        let count = 0;
        for (let user of _users) {
            if (count === 2) {
                userNames += `, +${_users.length - 2}`;
                break;
            }

            if (count !== 0) userNames += ',';
            userNames += user.name;
            count += 1;
        };

        return (
            <span>{userNames}</span>
        );
    };
    console.log(users && getUserNames(users));
    return (
        <div className='chat-list-item-container'>
            <span className='chat-list-item-room-name'>{roomName}</span>
            {users && <span> {getUserNames(users)} </span>}
        </div>
    );
};

export default ChatListItem;