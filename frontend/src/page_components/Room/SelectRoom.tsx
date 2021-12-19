import React from "react";
import { useHistory } from "react-router-dom";

import Room from "./Room";
import { ApiReturnRes } from "../../utils/utilities";
import { SubmitActionProps } from "./Room";
import { joinRoomService } from "./service/service";

import "./Room.scss";

// Find an existing room
const SelectRoom: React.FC = () => {
  const history = useHistory();

  // Find a room with user iuput
  const handleJoinRoom: SubmitActionProps = async (
    username,
    roomName,
    handleResCB
  ) => {
    const res: ApiReturnRes = await joinRoomService({ username, roomName });
    handleResCB(res);
  };

  return <Room history={history} submitAction={handleJoinRoom} />;
};

export default SelectRoom;
