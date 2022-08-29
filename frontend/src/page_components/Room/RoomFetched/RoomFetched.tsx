import React from "react";
import { RoomInfoType } from "../../../utils/firebase";

import Button from "../../../common_components/Button";
import { en } from "../../../utils/language";

interface Props {
  room: RoomInfoType;
  buttonAction: (roomName: { roomName: string }) => void;
}

const RoomFetched: React.FC<Props> = ({ room, buttonAction }) => {
  const handleButtonClick = (): void => {
    if (room?.roomName) {
      buttonAction({ roomName: room.roomName });
    }
  };
  return (
    <>
      <div className="find-room-info">
        <div>Room Name: {room?.roomName}</div>
        <div>People: {room?.users?.length}</div>
      </div>
      <div className="find-room-join-button">
        <Button
          buttonText={en.JOIN_TITLE}
          size="sm"
          primary
          onClickEvent={handleButtonClick}
          textBold
        />
      </div>
    </>
  );
};

export default RoomFetched;
