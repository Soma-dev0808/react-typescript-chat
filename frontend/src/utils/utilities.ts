import { Dispatch } from "react";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import * as H from "history";
import firebase from "firebase/app";
import qs, { ParsedQs } from "qs";

import { ApiReturnResponse } from "../utils/types";
import { FireBaseErrorType } from "../utils/firebase";
import { ApiErrorState } from "../features/apiStatSlice";
import { en } from "./language";

interface LocationProps {
  location: H.Location;
}

interface ValidateEmptyProps {
  values: Array<string>;
  errorMessages: Array<string>;
  setAPIError: ActionCreatorWithPayload<Partial<ApiErrorState>>;
  dispatch: Dispatch<any>;
}

/**
 * Returns firebase api reponse as an object.
 *
 * @param isSuccess if api is successfully processed.
 * @param content information or data of api response.
 * @return An restructured object.
 */
export const convertFBApiResponse = <_, T>(
  isSuccess: boolean = true,
  content?: T
): ApiReturnResponse<T> => {
  // Success response
  if (isSuccess) {
    return {
      isSuccess,
      value: content,
    };
  }

  // Error response
  let errMsg = "";
  if (typeof content == "string") errMsg = content;
  return {
    isSuccess,
    errorMessage: errMsg,
  };
};

/**
 * Returns an error message as string.
 *
 * @param err error message.
 * @return An error message.
 */
export const retrieveFBErrorMessage = <T extends FireBaseErrorType>(
  err: T
): string => {
  if (isNullOrUndefined(err)) {
    return en.UNDEFINED_ERROR;
  }

  return err.message ? err.message : en.UNDEFINED_ERROR;
};

/**
 *  Create className conditionally.
 *
 *  Example of arguments. ↓
 *
 *  eg 1: "styled-link", "disable-link"
 *
 *  eg 2: "styled-link", { "disable-link": true } ← enable "disable-link" when true.
 *
 * @param args classnames or objects which contains condition for enabling its classname.
 * @return A one line classname string which can be directly assign to the classname property.
 */
export const classNames = (...args: (string | object)[]): string => {
  let className = "";

  if (!Array.isArray(args)) {
    return className;
  }

  args.forEach((value: string | object, index: number) => {
    if (typeof value === "string") {
      index === 0 ? (className = value) : (className += ` ${value}`);
    }

    if (typeof value === "object") {
      const key = Object.keys(value)[0];

      const _value = getValueByKey(key)(value);

      if (key && _value) {
        index === 0 ? (className = key) : (className += ` ${key}`);
      }
    }
  });

  return className;
};

/**
 * Create url with query string passed as an object.
 *
 * @param location Url location which would be modified.
 * @param qsObj An object contains query string.
 * @return A new location.
 */
export const createUrlWithQueryString = (
  location: string,
  qsObj: object
): string => {
  if (typeof location === "string" && typeof qsObj === "object") {
    let isIndexZero = true;

    for (const key in qsObj) {
      let qsValue = getValueByKey(key)(qsObj);
      if (isIndexZero) {
        location += `?${key}=${qsValue}`;
        isIndexZero = false;
      } else {
        location += `&${key}=${qsValue}`;
      }
    }
  }

  return location;
};

/**
 * retrieve query string from location object
 */
export const retrieveQsObjProp = ({
  location,
}: LocationProps): ParsedQs | null => {
  if (location?.search) {
    return qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });
  }
  return null;
};

/**
 * Validate if there's empty form input.
 * The length of values & errorMessages arrays should be same.
 */
export const validateEmptyString = ({
  values,
  errorMessages,
  setAPIError,
  dispatch,
}: ValidateEmptyProps): boolean => {
  if (
    Array.isArray(values) &&
    Array.isArray(errorMessages) &&
    values.length === errorMessages.length
  ) {
    const errArr: Array<string> = [];
    values.forEach((v, i) => {
      if (v.trim() === "") {
        errArr.push(errorMessages[i]);
      }
    });

    if (errArr.length > 0) {
      dispatch(setAPIError({ apiErrorMessages: errArr }));
    }

    return errArr.length === 0;
  }
  return false;
};

/**
 * Get firebase timestamp
 */
export const getFBTimeStamp = (): firebase.firestore.FieldValue => {
  return firebase.firestore.FieldValue.serverTimestamp();
};

/**
 * Generate unique key
 */
export const generateKey = (data: number): number => {
  return data ? data + new Date().getTime() : new Date().getTime();
};

/**
 * convert timestamp to string time
 */
export const convertTsToTime = (
  fbTimeStamp: firebase.firestore.Timestamp
): string => {
  if (!fbTimeStamp) return "";

  const date = fbTimeStamp.toDate();
  const hr = new Date(date)?.getHours();
  const mins = new Date(date)?.getMinutes();

  return _adjustTimeString(hr) + ":" + _adjustTimeString(mins);
};

/**
 * add zero if length of parameter is 1. (ex, 1 -> 01)
 */
const _adjustTimeString = (timeNum: number): string => {
  if (timeNum >= 10) return String(timeNum);

  return "0" + String(timeNum);
};

/**
 * add zero if length of parameter is 1. (ex, 1 -> 01)
 */
export const handleScroll = (
  e: React.UIEvent<HTMLDivElement>,
  bottomActionCB = (bool: boolean) => {},
  topActionCB = (bool: boolean) => {}
): void => {
  const { scrollHeight, scrollTop, clientHeight } = e.target as HTMLDivElement;

  if (scrollHeight && scrollTop && clientHeight) {
    const _isBottom = scrollHeight - scrollTop <= clientHeight + 5;
    // when reached bottom, excute call back.
    bottomActionCB && bottomActionCB(_isBottom);
  }

  // triggered when scroll position is at top
  if (scrollTop === 0) {
    topActionCB && topActionCB(scrollTop === 0);
  }
};

/**
 * Scroll to target position
 */
export const scrollToBottom = (
  positionRef: React.MutableRefObject<HTMLDivElement> | null,
  scrollOption: ScrollOptions
): void => {
  if (positionRef?.current?.scrollIntoView) {
    positionRef.current.scrollIntoView(scrollOption);
  }
};

/**
 * Resolve type error of object key
 */
export const getValueByKey = (key: string) => (obj: Record<string, any>) =>
  obj[key];

/**
 * Return true if param is null or undefined
 */
export const isNullOrUndefined = (value: any): boolean => {
  if (value === null || value === undefined) {
    return true;
  }
  return false;
};
