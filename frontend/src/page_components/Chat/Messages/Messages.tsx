import React, { useRef, useEffect, useState } from "react";
import firebase from "firebase/app";
import Message from "./Message/Message";
import ScrollToBottomButton from "../../../common_components/ScrollBottomButton";
import { MessageArrayType } from "../../../utils/types";

import {
  generateKey,
  convertTsToTime,
  handleScroll,
  scrollToBottom,
} from "../../../utils/utilities";

import "./Messages.scss";

let prevDate: string = "";

interface MessagesProps {
  messages: MessageArrayType[];
  username: string;
}

const Messages: React.FC<MessagesProps> = ({ messages, username }) => {
  const [isBottom, setIsBottom] = useState<boolean>(true);
  const bottomRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    scrollToBottom(bottomRef, { behavior: "smooth" });
  }, [messages]);

  // Observe sroll event and check if user scrolled to bottom
  const handleOnScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>): void => {
    handleScroll(e, (_isBottom: boolean) => {
      // when reached bottom, update state.
      if (isBottom !== _isBottom) {
        setIsBottom(_isBottom);
      }
    });
  };

  // Scroll list to bottom
  const handleScrollButtonClick = (): void => {
    scrollToBottom(bottomRef, { behavior: "smooth" });
  };

  return (
    <>
      <div className="messages" onScroll={handleOnScroll}>
        {messages.map((message, i) => {
          let dateLabel: string = "";

          // show date when the date is different from the previous time date
          if (typeof message?.timeStamp === "object") {
            const ts: firebase.firestore.Timestamp = message.timeStamp;

            const convertedTime: string = convertTsToTime(ts);
            message.timeStamp = convertedTime;

            // Set date information.
            const _timeStamp: string = new Date(
              ts?.toDate()
            )?.toLocaleDateString();

            if (prevDate !== _timeStamp) {
              dateLabel = _timeStamp;
              prevDate = dateLabel;
            }
          }

          return (
            <div key={message.id || generateKey(i)}>
              <Message
                message={message}
                name={username}
                dateLabel={dateLabel}
              />
            </div>
          );
        })}
        <div ref={bottomRef} />
        <ScrollToBottomButton
          scrollToBottom={handleScrollButtonClick}
          isBottom={isBottom}
        />
      </div>
    </>
  );
};

export default Messages;
