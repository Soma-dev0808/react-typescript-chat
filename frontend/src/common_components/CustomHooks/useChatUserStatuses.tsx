import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { UserInfoType } from "../../utils/firebase";
import { CurrUsers } from "../../utils/types";
import useRoomName from "./useRoomName";

type UserType = UserInfoType | CurrUsers;

// Find mached user between user1 and user2.
const findMatch = (user1: UserType, user2: UserType) =>
    user1.name?.toLowerCase() === user2.name?.toLowerCase()
    && user1.email === user2.email;

// Reset isOnline.
const refresh = (user: UserInfoType) => {
    user.isOnline = false;
    return user;
};

const useChatUserStatuses = (users: UserInfoType[], activeUsers: CurrUsers[]): UserInfoType[] => {
    const [userStatuses, setUserStatuses] = useState<UserInfoType[]>([]);
    const { room } = useRoomName(useLocation());
    const [curr, setCurr] = useState<string>('');

    useEffect(() => {
        const setNewUserStatuses = (isInitialized: boolean) => {

            // Create a deep copy of users array to avoid a dependency infinity loop.
            const _users: UserInfoType[] = [...users.map(refresh)];

            // Loop activeUsers and if activeUser is not exist in _users yet, add the user in it with isOnline true.
            // else set isOnline to true.
            activeUsers.forEach(au => {
                const matchedUser = _users.find((user) => findMatch(user, au));
                if (!matchedUser) {
                    // FB store data is not refrected yet, so refrect it in here.
                    _users.push({
                        name: au.name,
                        email: au.email,
                        isOnline: true
                    });
                } else {
                    matchedUser.isOnline = true;
                }
            });

            // If user who is not refrected in FB store yet, leave the room. We keep the user in the list.
            // This will be skipped in an initial call(isInitialized).
            if (userStatuses.length > _users.length && isInitialized) {
                userStatuses.forEach(userStatus => {
                    const findLost = _users.findIndex((user) => findMatch(user, userStatus));
                    if (findLost === -1) {
                        userStatus.isOnline = false;
                        _users.push(userStatus);
                    }
                });
            }

            _users.sort((a, b) => {
                // sort to place isOnline == true to a top of a list.
                if (a.isOnline === b.isOnline) return 0;
                else if (a.isOnline && !b.isOnline) return -1;
                else return 1;
            });

            setUserStatuses(_users);
            // When room name is changed, isInitialized will be false. 
            if (!isInitialized) setCurr(room);

        };

        // When both users and activeUsers are fetched.
        if (users.length && activeUsers.length) {
            // When room name is changed, isInitializedFlag will be false. 
            const isInitializedFlag = curr === room;
            setNewUserStatuses(isInitializedFlag);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [users, activeUsers]);


    return userStatuses;
};

export default useChatUserStatuses;