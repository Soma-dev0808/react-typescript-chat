import React, { useCallback, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import ApiResponseBar from "../ApiResponseBar";
import Button from "../Button";
import ConfirmDialog from "../ConfirmDialog";
import useAuth from "../CustomHooks/useAuth";
import useSetMobileScreenHight from "../CustomHooks/useSetMobileScreenHight";

import { signOut } from "../../page_components/Auth/service/service";
import { startOrEndCallApi, setAPIError } from "../../features/apiStatSlice";
import { routePath } from "../../router/router";

import "./Header.scss";
import { ApiReturnErrorRes } from "../../utils/types";
import { classNames } from "../../utils/utilities";
import { en } from "../../utils/language";

const Header: React.FC = () => {
  const [isShowConfirm, setIsShowConfirm] = useState<boolean>(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { isLoading, isAuth, username } = useAuth();
  // チャットの場合はfixedにしない
  const isChat = location.pathname === routePath.chat;

  // adjust hight form mobile screen.
  useSetMobileScreenHight();

  // Sign-in/out button clicked
  const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // sign out if isAuth is true.
    if (isAuth) {
      setIsShowConfirm(true);
    } else if (!isAuth && location.pathname === routePath.signIn) {
      // go to sign up page
      history.push(routePath.signUp);
    } else {
      // go to sign in page
      history.push(routePath.signIn);
    }
  };

  // Clicked 'yes' during sign out confirmation. 
  const handleSignOutOk = async () => {
    dispatch(startOrEndCallApi(true));
    const res = (await signOut()) as ApiReturnErrorRes;
    if (res?.errorMessage) {
      dispatch(setAPIError({ apiErrorMessages: res.errorMessage }));
    } else {
      dispatch(startOrEndCallApi(false));
    }
    setIsShowConfirm(false);
  };

  // Clicked 'no' during sign out confirmation. 
  const handleSignOutCancel = () => setIsShowConfirm(false);

  const getButtonName = useCallback((): string => {
    let authStatusButtonName = en.SIGN_IN;
    if (isAuth) {
      authStatusButtonName = en.LOG_OUT;
    } else if (!isAuth && location.pathname === routePath.signIn) {
      authStatusButtonName = en.SIGN_UP;
    }
    return authStatusButtonName;
  }, [location.pathname, isAuth]);

  const _classnames = classNames(
    "header-parent",
    { "header-parent-fixed": !isChat },
  );

  return (
    <>
      <div className={_classnames}>
        <div className="header-bar">
          <Title />
          {!isLoading && (
            <div className="header-right-container">
              {isAuth && (
                <span className="header-right-username">
                  {username}
                </span>
              )}
              <Button
                isDisabled={isLoading}
                buttonText={getButtonName()}
                onClickEvent={handleButtonClick}
                size={"sm"}
                primary
                variant
                textBold
              />
            </div>
          )}
        </div>
        <ApiResponseBar />
      </div>
      <ConfirmDialog
        isShow={isShowConfirm}
        headerText={en.CONFIRM_SIGN_OUT_TITLE}
        bodyText={en.CONFIRM_SIGN_OUT_MESSAGE}
        yesAction={handleSignOutOk}
        noAction={handleSignOutCancel}
      />
    </>
  );
};

const Title: React.FC = () => {
  return <span className="header-title"> {en.APP_TITLE} </span>;
};

export default React.memo(Header);
