import React from 'react';
import onlineIcon from "../../../icons/onlineIcon.png";

import { UserInfoType } from '../../../utils/firebase';
import { classNames } from '../../../utils/utilities';

import './UserStatuses.scss';

type UserStatusesProps = {
    users: UserInfoType[];
    isShow: boolean;
}
const UserStatuses: React.FC<UserStatusesProps> = ({ users, isShow }) => {
    const cls = classNames('chat-users-statuses', { 'chat-users-statuses-show': isShow });
    return (
        <div className={cls}>
            {users.map((user, idx) =>
                <li key={idx + user.email} className='chat-users-status'>
                    <div className='chat-users-user-name-container'>
                        <img className="chat-users-online-icon" src={onlineIcon} alt="online" />
                        <div className='chat-users-user-name'>{user.name}</div>
                    </div>
                    {
                        user.isOnline
                            ? <div className='chat-users-online'> Online </div>
                            : <div className='chat-users-offline'> Offline </div>
                    }
                </li>)}
        </div>
    );
};

export default UserStatuses;