import React from "react";
import { en } from "../../../utils/language";

import "./Input.scss";

interface InputState {
  message: string,
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void,
  sendMessage: (e: React.FormEvent<HTMLFormElement>) => void,
  disabled: boolean,
}

const Input: React.FC<InputState> = ({
  message,
  handleInput,
  sendMessage,
  disabled
}) => {
  return (
    <form className="chat-input-form" onSubmit={sendMessage}>
      <input
        className="chat-input"
        type="text"
        placeholder="Type a message ..."
        value={message}
        onChange={handleInput}
        disabled={disabled}
      />
      <button
        className="send-button"
        disabled={disabled}
      >
        {en.SEND}
      </button>
    </form>
  );
};

export default Input;
