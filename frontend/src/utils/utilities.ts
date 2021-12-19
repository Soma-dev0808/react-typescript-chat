import { Dispatch } from "react";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import * as H from "history";
import { ApiErrorState } from "../features/apiStatSlice";
import { en } from "./language";
import qs, { ParsedQs } from "qs";
import firebase from "firebase/app";

export interface ApiReturnRes {
  isSuccess: boolean;
  value?: any;
  errorMessage?: string;
}

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
 * Convert Firebase api response
 */
export const convertFBApiResponse = (
  isSuccess: boolean = true,
  content: any = null
): ApiReturnRes => {
  return isSuccess
    ? {
        isSuccess,
        value: content,
      }
    : {
        isSuccess,
        errorMessage: content,
      };
};

/**
 * Get message of Firbase api response
 */
export const retrieveFBErrorMessage = (err: {
  message: string | null | undefined;
}): string => {
  return err?.message ? err.message : en.UNDEFINED_ERROR;
};

/**
 *  Create className conditionally
 *  Example of arguments ↓
 *  eg 1: "styled-link", "disable-link"
 *  eg 2: "styled-link", { "disable-link": true }
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
 * Create url with query string passed as object
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
