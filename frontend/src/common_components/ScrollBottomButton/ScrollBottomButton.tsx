import React from "react";

import { classNames } from "../../utils/utilities";

interface ScrollToBottomButtonProps {
  scrollToBottom: () => void;
  isBottom: boolean;
}

const ScrollToBottomButton: React.FC<ScrollToBottomButtonProps> = ({
  scrollToBottom,
  isBottom,
}) => {
  return (
    <button
      onClick={scrollToBottom}
      className={classNames(
        "scroll-to-bottom-button",
        { "show-bottom-button": !isBottom },
        { "hide-bottom-button": isBottom }
      )}
    />
  );
};

export default ScrollToBottomButton;
