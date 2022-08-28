import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { routePath } from "../../../router/router";

import ExistRooms from "../ExistRooms";
import Button from "../../../common_components/Button/Button";
import TextFormInput from "../../../common_components/TextFormInput";
import NoWrapLoadingIndicator from "../../../common_components/NoWrapLoadingIndicator";
import useAuth from "../../../common_components/CustomHooks/useAuth";
import useFindRoom from "../../../common_components/CustomHooks/useFindRoom";
import { setAPIError } from "../../../features/apiStatSlice";
import { joinRoomService } from "../service/service";
import {
  generateKey,
  handleScroll,
  createUrlWithQueryString,
} from "../../../utils/utilities";
import {
  ApiReturnErrorRes,
  ApiReturnRes,
  TextFormInputSize,
} from "../../../utils/types";
import { en } from "../../../utils/language";
import searchIcon from "../../../icons/searchIcon.png";

import "./FindRoom.scss";

interface Props {
  handleClose: () => void;
}

const FindRoom: React.FC<Props> = ({ handleClose }) => {
  const dispatch = useDispatch();
  const [isBottom, setIsBottom] = useState<boolean>(false);
  const [roomName, setRoomName] = useState<string>("");
  const { username } = useAuth();
  const history = useHistory();

  const { isLoading, roomList, fetchExistRooms } = useFindRoom();

  // Check if a list is scrolled to bottom
  const handleListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    handleScroll(e, (_isBottom) => {
      // when reached bottom, update state and load more items.
      if (isBottom !== _isBottom) {
        if (
          !isBottom &&
          !isLoading &&
          roomList.nextRef !== null &&
          roomList.nextRef !== -1
        ) {
          fetchExistRooms(roomList.nextRef, { roomName });
        }
        setIsBottom(_isBottom);
      }
    });
  };

  // Join to a room when list item is clicked
  const handleJoinButton = async ({
    roomName,
  }: {
    roomName: string;
  }): Promise<void> => {
    if (!username || !roomName) {
      dispatch(setAPIError({ apiErrorMessages: en.JOIN_ROOM_ERROR }));
      return;
    }

    try {
      const res = (await joinRoomService({
        username,
        roomName,
      })) as ApiReturnRes<null>;

      if (res.isSuccess) {
        const nextUrl: string = createUrlWithQueryString(routePath.chat, {
          roomName,
        });
        history.push(nextUrl);
      } else {
        const errMsg = res as ApiReturnErrorRes;
        dispatch(setAPIError({ apiErrorMessages: errMsg.errorMessage }));
      }
    } catch (error) {
      dispatch(setAPIError({ apiErrorMessages: en.JOIN_ROOM_ERROR }));
    }
  };

  const handleSearchSubmit = (text: string) => {
    setRoomName(text);
    if (!isLoading) {
      fetchExistRooms(null, { roomName: text }, true);
    }
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
        <div className="find-room-list" onScroll={handleListScroll}>
          {roomList.rooms.map((room, i) => (
            <div
              key={room?.date_created?.seconds || generateKey(i)}
              className="find-room-list-item"
            >
              <ExistRooms room={room} buttonAction={handleJoinButton} />
            </div>
          ))}

          {isLoading && <NoWrapLoadingIndicator />}

          {
            !isLoading &&
            !roomList.rooms.length &&
            (
              <div className="find-room-no-result">
                {en.NO_RESULT}
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default FindRoom;
