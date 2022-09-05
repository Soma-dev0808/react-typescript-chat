import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { routePath } from "../../../router/router";

import RoomFetched from "../RoomFetched";
import Button from "../../../common_components/Button/Button";
import TextFormInput from "../../../common_components/TextFormInput";
import useAuth from "../../../common_components/CustomHooks/useAuth";
import useFindRoom from "../../../common_components/CustomHooks/useFindRoom";
import { setAPIError } from "../../../features/apiStatSlice";
import { joinRoomService } from "../service/service";
import {
  generateKey,
  createUrlWithQueryString,
} from "../../../utils/utilities";
import {
  ApiReturnErrorRes,
  ApiReturnRes,
  RoomListState,
  TextFormInputSize,
} from "../../../utils/types";
import { en } from "../../../utils/language";
import searchIcon from "../../../icons/searchIcon.png";

import "./FindRoom.scss";
import ScrollableRoomList from "../../../common_components/ScrollableRoomList";

interface Props {
  handleClose: () => void;
}

const FindRoom: React.FC<Props> = ({ handleClose }) => {
  const dispatch = useDispatch();
  const [roomName, setRoomName] = useState<string>("");
  const { username } = useAuth();
  const history = useHistory();

  const { isLoading, roomList, fetchExistRooms } = useFindRoom();

  // Join to a room when one of a list item is clicked
  const handleJoinButton = async ({ selectedRoomName }: { selectedRoomName: string }): Promise<void> => {
    if (!username || !selectedRoomName) {
      dispatch(setAPIError({ apiErrorMessages: en.JOIN_ROOM_ERROR }));
      return;
    }

    const res = (await joinRoomService({
      username,
      roomName: selectedRoomName,
    })) as ApiReturnRes<null>;

    if (res.isSuccess) {
      const nextUrl: string = createUrlWithQueryString(routePath.chat, {
        roomName: selectedRoomName,
      });
      history.push(nextUrl);
    } else {
      const errMsg = res as ApiReturnErrorRes;
      dispatch(setAPIError({ apiErrorMessages: errMsg.errorMessage }));
    }
  };

  // Clicked search button
  const handleSearchSubmit = (text: string) => {
    setRoomName(text);
    if (!isLoading) {
      fetchExistRooms(null, { roomName: text }, true);
    }
  };

  // This will receive props from wrapper component.
  const RoomsReceiver: React.FC<Partial<RoomListState>> = ({ rooms }) => {
    if (!Array.isArray(rooms)) return null;

    const chatItems = rooms.map((room, idx) => (
      <RoomFetched
        key={room?.date_created?.seconds || generateKey(idx)}
        room={room}
        buttonAction={handleJoinButton}
      />
    ));

    return <>
      {chatItems}
    </>;
  };

  return (
    <div className="find-room-container">
      <div className="find-room-content">
        <div className="find-room-modal-header">
          <h3 className="find-room-modal-title">{en.FIND_ROOMS}</h3>
          <div className="find-room-search-area">
            <TextFormInput
              size={TextFormInputSize.sm}
              buttonText=""
              placeholderText="Room name"
              buttonImage={searchIcon}
              onButtonSubmit={handleSearchSubmit}
            />
          </div>
          <div className="find-room-close-button">
            <Button
              size="xs"
              onClickEvent={handleClose}
              buttonText={en.CLOSE}
              primary
              variant
              textBold
            />
          </div>
        </div>

        <ScrollableRoomList
          cls="find-room-list"
          useFindRoom={{ isLoading, roomList, fetchExistRooms }}
          filterObj={{ roomName }}
        >
          <RoomsReceiver />
        </ScrollableRoomList>
      </div>
    </div>
  );
};

export default FindRoom;
