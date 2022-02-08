import { Dispatch } from "react";
import { db, auth } from "../../../utils/firebase";
import {
  convertFBApiResponse,
  retrieveFBErrorMessage,
} from "../../../utils/utilities";
import { routePath } from "../../../router/router";
import { en } from "../../../utils/language";
import { History } from "history";
import { ApiReturnRes } from "../../../utils/types";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { ApiErrorState } from "../../../features/apiStatSlice";
import { UserInputProps } from "../../../utils/types";

// call sign up or sign in function with user input
export const handleSubmit = async (
  dispatch: Dispatch<any>,
  userInput: UserInputProps,
  startOrEndCallApi: ActionCreatorWithPayload<boolean>,
  setAPIError: ActionCreatorWithPayload<Partial<ApiErrorState>>,
  history: History,
  isSignUp = true
) => {
  // show loading indicator
  dispatch(startOrEndCallApi(true));

  const submit = isSignUp ? signUp : signIn;

  const res = await submit(userInput);

  if (res?.isSuccess) {
    // hide loading indicator and go to create chat page
    dispatch(startOrEndCallApi(false));
    history.push(routePath.createRoom);
  } else {
    dispatch(setAPIError({ apiErrorMessages: res.errorMessage }));
  }
};

// sign up
const signUp = async ({ username, email, password }: UserInputProps) => {
  const hasduplicate = await checkUsernameDuplication(username);
  if (!hasduplicate) {
    return convertFBApiResponse(false, en.USERNAME_EXISTS_ERROR);
  }
  return auth
    .createUserWithEmailAndPassword(email, password)
    .then(async (res) => {
      const uid = res.user!.uid;

      // set username
      await db.collection(en.USERNAMES).doc(uid).set({
        username,
      });

      return convertFBApiResponse();
    })
    .catch((err) => {
      return convertFBApiResponse(false, retrieveFBErrorMessage(err));
    });
};

// sign in
const signIn = async ({ email, password }: Partial<UserInputProps>) => {
  if (!email || !password) {
    return Promise.resolve(
      convertFBApiResponse(false, en.NO_EMAIL_OR_PASSWORD_SYSERROR)
    );
  }

  return await auth
    .signInWithEmailAndPassword(email!, password!)
    .then(() => convertFBApiResponse())
    .catch((err) => convertFBApiResponse(false, retrieveFBErrorMessage(err)));
};

export const signOut = async (): Promise<ApiReturnRes> => {
  return auth
    .signOut()
    .then(() => convertFBApiResponse())
    .catch((err) => convertFBApiResponse(false, retrieveFBErrorMessage(err)));
};

// check username is already taken. If not, return true
const checkUsernameDuplication = async (
  username?: string
): Promise<boolean> => {
  const usernames = await db.collection(en.USERNAMES).get();

  const res = await usernames.query.where(en.USERNAME, "==", username).get();

  return res.size === 0;
};
