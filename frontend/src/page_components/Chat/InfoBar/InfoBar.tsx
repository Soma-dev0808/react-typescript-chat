import React from "react";
import { Link } from "react-router-dom";
import onlineIcon from "../../../icons/onlineIcon.png";
import closeIcon from "../../../icons/closeIcon.png";

import "./InfoBar.scss";

interface InfoBarState {
  room: string;
}

const InfoBar: React.FC<InfoBarState> = ({ room }) => (
  <div className="info-bar">
    <div className="leftInner-container">
      <img className="online-icon" src={onlineIcon} alt="online" />
      <h3 className="room-name-header">{room}</h3>
    </div>
    <div className="right-inner-container">
      <Link to="/select-room">
        <img src={closeIcon} alt="close" />
      </Link>
    </div>
  </div>
);

export default InfoBar;
