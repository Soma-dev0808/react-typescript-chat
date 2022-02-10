import React, { useCallback } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import ApiResponseBar from "./ApiResponseBar";
import Button from "../Button";
import useAuth from "../CustomHooks/useAuth";
import useErrorMessages from "../CustomHooks/useErrorMessages";
import { signOut } from "../../page_components/Auth/service/service";
import { startOrEndCallApi, setAPIError } from "../../features/apiStatSlice";
import { routePath } from "../../router/router";
import { en } from "../../utils/language";

import "./Header.scss";
import { ApiReturnErrorRes } from "../../utils/types";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { isLoading, isAuth } = useAuth();
  // Set error messages observer
  useErrorMessages();

  const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // sign out if isAuth is true.
    if (isAuth) {
      dispatch(startOrEndCallApi(true));
      const res = (await signOut()) as ApiReturnErrorRes;
      if (res?.errorMessage) {
        dispatch(setAPIError({ apiErrorMessages: res.errorMessage }));
      } else {
        dispatch(startOrEndCallApi(false));
      }
    } else if (!isAuth && location.pathname === routePath.signIn) {
      // go to sign up page
      history.push(routePath.signUp);
    } else {
      // go to sign in page
      history.push(routePath.signIn);
    }
  };

  const getButtonName = useCallback((): string => {
    let authStatusButtonName = en.SIGN_IN;
    if (isAuth) {
      authStatusButtonName = en.LOG_OUT;
    } else if (!isAuth && location.pathname === routePath.signIn) {
      authStatusButtonName = en.SIGN_UP;
    }
    return authStatusButtonName;
  }, [location.pathname, isAuth]);

  return (
    <div className="header-parent">
      <div className="header-bar">
        <Title />
        {!isLoading && (
          <div>
            <Button
              isDisabled={isLoading}
              buttonText={getButtonName()}
              onClickEvent={handleButtonClick}
              size={"sm"}
            />
          </div>
        )}
      </div>
      <ApiResponseBar />
    </div>
  );
};

const Title: React.FC = () => {
  return <h3 className="header-title">{en.APP_TITLE}</h3>;
};

export default Header;
