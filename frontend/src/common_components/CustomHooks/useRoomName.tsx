import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { routePath } from "../../router/router";
import { retrieveQsObjProp } from "../../utils/utilities";
import { UseRoomNameType } from "../../utils/types";
import { Location } from "history";

// get room name from location.
const useRoomName = (location: Location): UseRoomNameType => {
  const history = useHistory();
  const [room, setRoom] = useState<string>("");

  useEffect(() => {
    if (!location || !history) return;

    // get room name from url and use it
    const parsedObj = retrieveQsObjProp({ location });
    if (!parsedObj) {
      return history.push(routePath.selectRoom);
    }
    const { roomName } = parsedObj;
    if (typeof roomName === "string") {
      setRoom(roomName);
    }
  }, [location, history]);

  return { room };
};

export default useRoomName;
