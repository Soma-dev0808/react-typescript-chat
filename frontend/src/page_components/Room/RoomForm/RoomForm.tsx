import React, { useState } from "react";
import FindRooms from "../FindRooms";
import StyledLink from "../../../common_components/StyledLink";
import { routePath } from "../../../router/router";
import Button from "../../../common_components/Button/Button";
import { en } from "../../../utils/language";

import "../Room.scss";

interface Props {
  isJoin: boolean;
  buttonAction: (e: React.FormEvent<HTMLFormElement>) => void;
}

const RoomForm: React.FC<Props> = ({ isJoin, buttonAction }) => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const formTitle: string = isJoin ? en.JOIN_ROOM_TITLE : en.LAUNCH_ROOM_TITLE;
  const buttonTitle: string = isJoin
    ? en.JOIN_ROOM_BUTTON_TITLE
    : en.LAUNCH_ROOM_BUTTON_TITLE;
  const roomLink: string = isJoin ? routePath.createRoom : routePath.selectRoom;
  const roomLinkTitle: string = isJoin
    ? en.JOIN_ROOM_LINK_TITLE
    : en.LAUNCH_ROOM_LINK_TITLE;

  const handleOnToggle = (): void => setIsShow(!isShow);

  return (
    <>
      <div className="join-outer-container">
        <div className="join-inner-container">
          <h1 className="heading">{formTitle}</h1>
          <form className="join-inner-form" onSubmit={buttonAction}>
            <div>
              <input
                name="roomName"
                placeholder={en.ROOMNAME_PLACEHOLDER}
                className="join-input mt-20"
                type="text"
              />
            </div>

            <Button
              classnames="mt-20"
              primary
              buttonText={buttonTitle}
              buttonType="submit"
            />
          </form>
          {isJoin && (
            <>
              <Button
                classnames="mt-20"
                buttonText={en.FIND_ROOMS}
                onClickEvent={handleOnToggle}
              />
              {isShow && <FindRooms handleClose={handleOnToggle} />}
            </>
          )}

          <StyledLink to={roomLink} title={roomLinkTitle} />
        </div>
      </div>
    </>
  );
};

export default RoomForm;
