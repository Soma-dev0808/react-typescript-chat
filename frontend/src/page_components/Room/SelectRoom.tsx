import React from "react";
import { useHistory } from "react-router-dom";

import Room from "./Room";
import { SubmitActionProps } from "./Room";
import { joinRoomService } from "./service/service";
import { ApiReturnResponse } from "../../utils/types";

// Find an existing room
const SelectRoom: React.FC = () => {
  const history = useHistory();

  // Find a room with user iuput
  const handleJoinRoom: SubmitActionProps = async (
    username,
    roomName,
    handleResCB
  ) => {
    const res: ApiReturnResponse<unknown> = await joinRoomService({
      username,
      roomName,
    });
    handleResCB(res);
  };

  return <Room history={history} submitAction={handleJoinRoom} />;
};

export default SelectRoom;
