import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearError, selectApiStatus } from "../../../features/apiStatSlice";
import Button from "../../Button/Button";

import "./ApiResponseBar.scss";

const ApiResponseBar: React.FC = () => {
  const dispatch = useDispatch();
  const { apiErrorMessages } = useSelector(selectApiStatus);
  let errorMessages: Array<string> = [];

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
        <Button size="xs" onClickEvent={handleClearError} buttonText={"x"} />
      </div>
    </div>
  ) : null;
};

export default ApiResponseBar;
