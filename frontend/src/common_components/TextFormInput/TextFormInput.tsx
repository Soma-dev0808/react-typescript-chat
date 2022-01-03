import React, { useState } from "react";

import { classNames, isNullOrUndefined } from "../../utils/utilities";
import "./TextFormInput.scss";

// currently only sm available
export enum Size {
  sm = "sm",
}

interface TextFormInputState {
  manualInputText?: string;
  size?: Size;
  buttonText?: string;
  buttonImage?: string;
  placeholderText?: string;
  classnames?: string;
  buttonClassnames?: string;
  onButtonSubmit?: (txt: string) => void;
  manualHandleInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  manualOnButtonSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

// Handle text input internally. If you need handle it through parent component, use 'manual' property
const TextFormInput: React.FC<TextFormInputState> = ({
  size = null,
  buttonText = "Submit",
  buttonImage = null,
  placeholderText = "Text",
  classnames = "",
  buttonClassnames = "",
  onButtonSubmit,
  manualInputText, // manual property
  manualHandleInput, // manual property
  manualOnButtonSubmit, // manual property
}) => {
  const [txt, setTxt] = useState("");
  // For handling text from parent component
  const isManual =
    !isNullOrUndefined(manualInputText) &&
    !isNullOrUndefined(manualHandleInput) &&
    !isNullOrUndefined(manualOnButtonSubmit);

  // class names for input style
  const _classnames = classNames(
    "common-search-form-inputbox",
    { "inputbox-sm": size === "sm" },
    classnames
  );

  // class names for button style
  const _buttonClassnames = classNames(
    "common-search-form-submit-button",
    { "button-sm": size === "sm" },
    buttonClassnames
  );

  const haandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputTxt = e.target.value;
    setTxt(inputTxt);
  };

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onButtonSubmit) onButtonSubmit(txt);
  };

  // For handling text from parent component
  const _text = isManual ? manualInputText : txt;
  const _onChnageEvent = isManual ? manualHandleInput : haandleChange;
  const _onSubmitEvent = isManual ? manualOnButtonSubmit : handleOnSubmit;

  return (
    <form className="common-search-form" onSubmit={_onSubmitEvent}>
      <input
        className={_classnames}
        type="text"
        placeholder={placeholderText}
        value={_text}
        onChange={_onChnageEvent}
      />
      <button className={_buttonClassnames}>
        {buttonText}
        {buttonImage && (
          <img
            src={buttonImage}
            alt="button"
            className="common-search-form-button-image"
          />
        )}
      </button>
    </form>
  );
};

export default TextFormInput;
