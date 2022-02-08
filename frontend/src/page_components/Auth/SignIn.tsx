import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setAPIError,
  startOrEndCallApi,
  selectApiStatus,
} from "../../features/apiStatSlice";
import { History } from "history";

import AuthForm from "../Auth/AuthForm";
import LoadingIndicator from "../../common_components/LoadingIndicator";
import { handleSubmit } from "./service";
import { UserInputProps } from "../../utils/types";

interface Props {
  history: History;
}

const SignIn: React.FC<Props> = ({ history }) => {
  const dispatch = useDispatch();
  const { isApiLoading } = useSelector(selectApiStatus);

  // do sign in
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userInput: UserInputProps = {
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
    };
    handleSubmit(
      dispatch,
      userInput,
      startOrEndCallApi,
      setAPIError,
      history,
      false
    );
  };

  return (
    <>
      <AuthForm
        isLogin={true}
        formAction={handleLogin}
        isLoading={isApiLoading}
      />
      <LoadingIndicator isLoading={isApiLoading} />
    </>
  );
};

export default SignIn;
