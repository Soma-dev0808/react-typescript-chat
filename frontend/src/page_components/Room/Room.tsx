import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setAPIError,
  startOrEndCallApi,
  selectApiStatus,
} from "../../features/apiStatSlice";

import LoadingIndicator from "../../common_components/LoadingIndicator/LoadingIndicator";
import RoomForm from "./RoomForm/RoomForm";
import useAuth from "../../common_components/CustomHooks/useAuth";
import { routePath } from "../../router/router";
import {
  createUrlWithQueryString,
  validateEmptyString,
} from "../../utils/utilities";
import {
  ApiReturnErrorRes,
  ApiReturnRes,
  ApiReturnResponse,
} from "../../utils/types";
import { en } from "../../utils/language";
import { History } from "history";

import "./Room.scss";

export interface SubmitActionProps {
  (
    username: string,
    roomName: string,
    callback: (res: ApiReturnResponse<unknown>) => void
  ): void;
}

interface Props {
  history: History;
  isJoin?: boolean;
  submitAction: SubmitActionProps;
}

const Room: React.FC<Props> = ({ history, submitAction, isJoin = true }) => {
  const dispatch = useDispatch();
  const { isApiLoading } = useSelector(selectApiStatus);
  const { username } = useAuth();

  // validate input and submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // show loading indicator
    dispatch(startOrEndCallApi(true));
    const roomName: string = e.currentTarget.roomName.value;
    // validation check
    if (
      username &&
      validateEmptyString({
        values: [roomName],
        errorMessages: [en.REQUIRE_ROOM_NAME_ERROR],
        setAPIError: setAPIError,
        dispatch,
      })
    ) {
      // If validation is passed, do submit(join or create a room)
      submitAction(username, roomName, (res: ApiReturnResponse<unknown>) => {
        if (res.isSuccess) {
          const nextUrl: string = createUrlWithQueryString(routePath.chat, {
            roomName,
          });
          history.push(nextUrl);
        } else {
          const errMsg = res as ApiReturnErrorRes;
          dispatch(setAPIError({ apiErrorMessages: errMsg.errorMessage }));
        }
      });
    }
  };

  return (
    <>
      <RoomForm isJoin={isJoin} buttonAction={handleSubmit} />
      <LoadingIndicator isLoading={isApiLoading} />
    </>
  );
};

export default Room;
