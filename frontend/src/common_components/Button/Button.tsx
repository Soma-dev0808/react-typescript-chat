import React from "react";
import { classNames } from "../../utils/utilities";

import "./Button.scss";

interface ButtonProps {
  size?: string | null;
  primary?: boolean;
  danger?: boolean;
  classnames?: string; // pass class name as usual.
  buttonType?: "button" | "submit" | "reset" | undefined;
  isDisabled?: boolean;
  onClickEvent?: React.MouseEventHandler<HTMLButtonElement>;
  buttonText: string | React.ReactNode;
  isLoading?: boolean;
  buttonShadow?: boolean;
}

// common use button props
const Button: React.FC<ButtonProps> = ({
  size = null,
  primary = false,
  danger = false,
  classnames = "",
  buttonType = "button",
  isDisabled = false,
  onClickEvent = () => { },
  buttonText = "",
  isLoading = false,
  buttonShadow = false,
}) => {
  const _classnames = classNames(
    "custom-button",
    classnames,
    { "button-primary": primary },
    { "button-danger": danger },
    { "button-xs": size === "xs" },
    { "button-sm": size === "sm" },
    { "button-lg": size === "lg" },
    { "button-shadow": buttonShadow }
  );

  return (
    <button
      className={_classnames}
      type={buttonType}
      disabled={isDisabled}
      onClick={onClickEvent}
    >
      {isLoading ? (
        <div className="button-loading-indicator"></div>
      ) : (
        buttonText
      )}
    </button>
  );
};

export default Button;
