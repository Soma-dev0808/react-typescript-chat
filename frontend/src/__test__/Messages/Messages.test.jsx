import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import Messages from "../../components/Chat/Messages/Messages";
import { getMessages, mockScrollProp } from "../utils/utilities";
import { scrollToBottom } from "../../utils/utilities";

afterEach(cleanup);

describe("Messages component render test", () => {
  test("render test", () => {
    const numOfMessages = 20;
    const messages = getMessages(numOfMessages);
    const name = "test";
    const { getByText, getByRole, getAllByText } = render(
      <Messages messages={messages} name={name} />
    );

    // check if user was displayed collectly
    // test data is created by looping, and user name is assigned depends on the indexes are odd or even
    const odds = Math.ceil(numOfMessages / 2);
    const evens = Math.floor(numOfMessages / 2);
    expect(getAllByText("other").length).toBe(odds);
    expect(getAllByText("test").length).toBe(evens);

    // check if all messages are rendered
    for (let i = 0; i < numOfMessages; i++) {
      expect(getByText(`test-${i}`)).toBeInTheDocument();
    }

    // find scroll button
    const scrollButton = getByRole("button");
    expect(scrollButton).toBeInTheDocument();
  });

  test("scrolling test", async () => {
    const numOfMessages = 20;
    const messages = getMessages(numOfMessages);
    const name = "test";
    const { container, getByRole } = render(
      <Messages messages={messages} name={name} />
    );

    const chatBox = container.getElementsByClassName("messages");

    // find scroll button
    let scrollButton = getByRole("button");
    expect(scrollButton).toBeInTheDocument();
    expect(scrollButton.className).toBe(
      "scroll-to-bottom-button hide-bottom-button"
    );

    // mock scroll event
    Object.defineProperties(
      window.HTMLElement.prototype,
      mockScrollProp(false)
    );

    // scroll chatbox
    fireEvent.scroll(chatBox.item(0), {
      target: { screenY: 100 },
    });

    expect(scrollButton.className).toBe(
      "scroll-to-bottom-button show-bottom-button"
    );

    fireEvent.click(getByRole("button"));

    Object.defineProperties(window.HTMLElement.prototype, mockScrollProp(true));

    fireEvent.scroll(chatBox.item(0), {
      target: { screenY: 100 },
    });

    expect(scrollButton.className).toBe(
      "scroll-to-bottom-button hide-bottom-button"
    );
  });

  test("Scroll to bottom test", () => {
    const positionRef = {
      current: {
        scrollIntoView: jest.fn(),
      },
    };
    scrollToBottom(positionRef);
  });
});
