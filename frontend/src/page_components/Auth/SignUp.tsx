import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setAPIError,
  startOrEndCallApi,
  selectApiStatus,
} from "../../features/apiStatSlice";

import AuthForm from "../Auth/AuthForm";
import LoadingIndicator from "../../common_components/LoadingIndicator";
import { handleSubmit } from "./service";
import { UserInputProps } from "../../utils/types";
import { History } from "history";

interface Props {
  history: History;
}

const SignUp: React.FC<Props> = ({ history }) => {
  const dispatch = useDispatch();
  const { isApiLoading } = useSelector(selectApiStatus);

  // do sign up
  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userInput: UserInputProps = {
      username: e.currentTarget.username.value,
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
    };

    handleSubmit(dispatch, userInput, startOrEndCallApi, setAPIError, history);
  };

  return (
    <>
      <AuthForm
        isLogin={false}
        formAction={handleRegister}
        isLoading={isApiLoading}
      />
      <LoadingIndicator isLoading={isApiLoading} />
    </>
  );
};

export default SignUp;
