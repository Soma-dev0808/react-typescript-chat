import React, { useState } from "react";
import FindRooms from "../FindRooms";
import { routePath } from "../../../router/router";
import Button from "../../../common_components/Button/Button";
import FormLayout from "../../../common_components/FormLayout";

import { RoomFormProps } from "../../../utils/types";
import { en } from "../../../utils/language";

const RoomForm: React.FC<RoomFormProps> = ({
  isJoin,
  formAction,
  isLoading
}) => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const formTitle: string =
    isJoin
      ? en.JOIN_ROOM_TITLE
      : en.LAUNCH_ROOM_TITLE;
  const buttonTitle: string =
    isJoin
      ? en.JOIN_ROOM_BUTTON_TITLE
      : en.LAUNCH_ROOM_BUTTON_TITLE;
  const roomLink: string =
    isJoin
      ? routePath.createRoom
      : routePath.selectRoom;
  const roomLinkTitle: string =
    isJoin
      ? en.JOIN_ROOM_LINK_TITLE
      : en.LAUNCH_ROOM_LINK_TITLE;

  const handleOnToggle = (): void => setIsShow(!isShow);

  return (
    <>
      <FormLayout
        formTitle={formTitle}
        formAction={formAction}
        linkAddress={roomLink}
        linkTitle={roomLinkTitle}
        disabled={isLoading}
      >
        <div>
          <input
            name="roomName"
            placeholder={en.ROOMNAME_PLACEHOLDER}
            className="form-input mt-20"
            type="text"
            disabled={isLoading}
          />
        </div>

        <Button
          classnames="mt-20"
          primary
          buttonText={buttonTitle}
          buttonType="submit"
          textBold
          isDisabled={isLoading}
          size="lg"
        />
        {isJoin && (
          <Button
            classnames="mt-20"
            buttonText={en.FIND_ROOMS}
            onClickEvent={handleOnToggle}
            textBold
            isDisabled={isLoading}
            size="lg"
          />
        )}

      </FormLayout>
      {isShow && <FindRooms handleClose={handleOnToggle} />}
    </>

  );
};

export default RoomForm;
