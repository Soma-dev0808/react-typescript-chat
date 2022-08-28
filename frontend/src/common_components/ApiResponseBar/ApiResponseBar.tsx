import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearError, selectApiStatus } from "../../features/apiStatSlice";
import Button from "../Button/Button";
import useErrorMessages from "../CustomHooks/useErrorMessages";

import "./ApiResponseBar.scss";

const ApiResponseBar: React.FC = () => {
  const dispatch = useDispatch();
  const { apiErrorMessages } = useSelector(selectApiStatus);
  let errorMessages: Array<string> = [];

  // Set error messages observer
  useErrorMessages();

  // clear error button
  const handleClearError = () => dispatch(clearError());

  // set error messages as array
  if (apiErrorMessages !== null) {
    errorMessages = Array.isArray(apiErrorMessages)
      ? apiErrorMessages
      : [apiErrorMessages];
  }

  return errorMessages.length > 0 ? (
    <div className="header-status-bar header-error">
      <div className="header-status-message">
        <ul>
          {errorMessages?.map((message, idx) => (
            <li key={idx}>{message}</li>
          ))}
        </ul>
      </div>
      <div>
        <Button
          size="xs"
          onClickEvent={handleClearError}
          buttonText={"x"}
          textBold
          danger
          variant
        />
      </div>
    </div>
  ) : null;
};

export default ApiResponseBar;
