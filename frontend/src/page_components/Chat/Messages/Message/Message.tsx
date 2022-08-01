import React from "react";
import { MessaageType } from "../../../../utils/firebase";

import "./Message.scss";

interface MessageProps {
  message: MessaageType;
  name: string;
  dateLabel: string;
}

const Messsage: React.FC<MessageProps> = ({
  message: { user, text, timeStamp },
  name,
  dateLabel,
}) => {
  // Variable for message position
  let isSentByCurrentUser: boolean = false;
  const trimmedName: string = name.trim().toLowerCase();

  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }

  const dateLabelComp: JSX.Element | null =
    dateLabel !== "" ? (
      <div className="date-label-container">
        <span className="date-label">{dateLabel}</span>
      </div>
    ) : null;

  const timestamp: JSX.Element | null = timeStamp ? (
    <p className="sent-time">{timeStamp as string}</p>
  ) : null;

  return isSentByCurrentUser ? (
    <>
      {dateLabelComp}
      <div className="message-container justify-end">
        <div className="pr-10 sent-info sent-info-me">
          <p className="sent-text">{trimmedName}</p>
          {timestamp}
        </div>
        <div className="message-box background-blue">
          <p className="message-text color-white">{text}</p>
        </div>
      </div>
    </>
  ) : (
    <>
      {dateLabelComp}
      <div className="message-container justify-start">
        <div className="message-box background-light">
          <p className="message-text color-dark">{text}</p>
        </div>
        <div className="pl-10 sent-info sent-info-other">
          <p className="sent-text">{user}</p>
          {timestamp}
        </div>
      </div>
    </>
  );
};

export default Messsage;
