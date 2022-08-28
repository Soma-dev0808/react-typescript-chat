import React from "react";
import { Link } from "react-router-dom";
import UserStatuses from "../UserStatuses";
import Button from "../../../common_components/Button";
import useDetectMobile from '../../../common_components/CustomHooks/useDetectMobile';
import useChatUserStatuses from "../../../common_components/CustomHooks/useChatUserStatuses";
import useDropdown from "../../../common_components/CustomHooks/useDropdown";

import onlineIcon from "../../../icons/onlineIcon.png";
import closeIcon from "../../../icons/closeIcon.png";
import peopleWhiteImage from "../../../icons/people_white.png";

import "./InfoBar.scss";
import { UserInfoType } from "../../../utils/firebase";
import { CurrUsers } from "../../../utils/types";

interface InfoBarState {
  room: string;
  users: UserInfoType[];
  activeUsers: CurrUsers[];
}

const InfoBar: React.FC<InfoBarState> = ({ room, users, activeUsers }) => {
  const isMobile = useDetectMobile();
  const { isShow, setIsShow, ref } = useDropdown();

  const userActiveStatus = useChatUserStatuses(users, activeUsers);

  const handleShowActiveUser = () => setIsShow(prevIsShow => !prevIsShow);

  return (
    <div className="info-bar">
      <div className="leftInner-container">
        <img className="online-icon" src={onlineIcon} alt="online" />
        <h3 className="room-name-header">{room}</h3>
      </div>
      <div className="right-inner-container">
        <div ref={ref} className="right-inner-users">
          <Button
            size="xs"
            onClickEvent={handleShowActiveUser}
            classnames="right-inner-users-button"
            buttonShadow
            buttonText={
              (
                <>
                  <img className="right-inner-users-icon" src={peopleWhiteImage} alt="peple" />
                  <span className="right-inner-users-count">{userActiveStatus.length}</span>
                </>
              )
            } />
          <UserStatuses users={userActiveStatus} isShow={isShow} />
        </div>

        {isMobile
          ? (<Link to="/select-room">
            <img className="right-inner-close-icon" src={closeIcon} alt="close" />
          </Link>)
          : null}
      </div>
    </div>
  );
};

export default InfoBar;
