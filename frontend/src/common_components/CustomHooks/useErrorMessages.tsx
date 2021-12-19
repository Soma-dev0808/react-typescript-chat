import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { selectApiStatus, clearError } from "../../features/apiStatSlice";

const API_HEADER_MESSAGE_DISPLAY_TIME = 4000;

const useErrorMessages = (): void => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { apiErrorMessages, redirectPath } = useSelector(selectApiStatus);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (redirectPath) {
      history.push(redirectPath);
    }

    if (apiErrorMessages) {
      timer = setTimeout(() => {
        dispatch(clearError());
      }, API_HEADER_MESSAGE_DISPLAY_TIME);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [apiErrorMessages, redirectPath, history, dispatch]);
};

export default useErrorMessages;
