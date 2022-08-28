import React from "react";
import { en } from "../../../utils/language";

import "./Input.scss";

interface InputState {
  message: string;
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Input: React.FC<InputState> = ({ message, handleInput, sendMessage }) => {
  return (
    <form className="chat-input-form" onSubmit={sendMessage}>
      <input
        className="chat-input"
        type="text"
        placeholder="Type a message ..."
        value={message}
        onChange={handleInput}
      />
      <button className="sendButton">{en.SEND}</button>
    </form>
  );
};

export default Input;
