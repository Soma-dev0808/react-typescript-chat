import React from "react";
import { useHistory } from "react-router-dom";

import Room from "./Room";
import { launchRoomService } from "./service/service";
import { SubmitActionProps } from "./Room";
import { ApiReturnRes } from "../../utils/utilities";

import "./Room.scss";

// Create a new room
const CreateRoom: React.FC = () => {
  const history = useHistory();
  // create a new room with user iuput
  const handleLaunchRoom: SubmitActionProps = async (
    username,
    roomName,
    handleResCB
  ) => {
    const res: ApiReturnRes = await launchRoomService({ username, roomName });
    // callback which whill redirect user to next page, show an error message if there's an error.
    handleResCB(res);
  };

  return (
    <Room history={history} submitAction={handleLaunchRoom} isJoin={false} />
  );
};

export default CreateRoom;
