import React from "react";
import { render, act, cleanup, fireEvent } from "@testing-library/react";
import Chat from "../../components/Chat/Chat";
import createWrapper from "../utils/createWrapper";
import {
  fetchUser,
  fetchMessages,
  saveMessages,
} from "../../components/Chat/service/service";
import { getMessages } from "../utils/utilities";
import { routePath } from "../../router/router";
import en from "../../utils/constants";
import io from "socket.io-client";

const { wrapper, history, mockValues } = createWrapper();

jest.mock("../../components/Chat/service/service");
jest.mock("socket.io-client");

afterEach(cleanup);

// mock socket io
beforeEach(() => {
  jest.restoreAllMocks();
  io.mockImplementation(() => ({
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  }));
});

describe("Chat component render test", () => {
  beforeEach(() => {
    io.mockClear();
    io().on.mockClear();
    io().emit.mockClear();
  });

  test("render test", async () => {
    const mockUsername = "test-user";
    const numberOfMessages = 10;
    const promise = Promise.resolve({
      isSuccess: true,
      value: {
        name: mockUsername,
      },
    });
    const promise2 = Promise.resolve({
      isSuccess: true,
      value: getMessages(numberOfMessages, mockUsername),
    });
    fetchUser.mockImplementation(() => promise);
    fetchMessages.mockImplementation(() => promise2);
    const mockRoomName = "test-room";
    const props = {
      history,
      location: {
        search: `?roomName=${mockRoomName}`,
      },
    };

    const { getByText, container } = render(<Chat {...props} />, {
      wrapper,
    });

    // wait asynchronous function inside component
    await act(() => promise);
    await act(() => promise2);

    expect(
      container.getElementsByClassName("room-name-header")[0].innerHTML
    ).toBe(mockRoomName);

    for (let i = 0; i < numberOfMessages; i++) {
      expect(getByText("test-" + i)).toBeInTheDocument();
    }
  });

  test("fail fetchUser & fetchMessages", async () => {
    const errMsg1 = "error 1";
    const errMsg2 = "error 2";
    const promise = Promise.resolve({
      isSuccess: false,
      errorMessage: errMsg1,
    });
    const promise2 = Promise.resolve({
      isSuccess: false,
      errorMessage: errMsg2,
    });
    fetchUser.mockImplementation(() => promise);
    fetchMessages.mockImplementation(() => promise2);
    const mockRoomName = "test-room";
    const props = {
      history,
      location: {
        search: `?roomName=${mockRoomName}`,
      },
    };

    render(<Chat {...props} />, {
      wrapper,
    });

    // // wait asynchronous function inside component
    await act(() => promise);
    await act(() => promise2);

    expect(mockValues.setAPIError).toHaveBeenCalledWith(
      [errMsg1, errMsg2],
      routePath.selectRoom
    );
  });

  test("fail fetchUser & fetchMessages 2", async () => {
    // rerender with a different error
    const promise = Promise.resolve({
      isSuccess: true,
      value: {},
    });
    const promise2 = Promise.resolve({
      isSuccess: true,
    });
    fetchUser.mockImplementation(() => promise);
    fetchMessages.mockImplementation(() => promise2);
    const mockRoomName = "test-room";
    const props = {
      history,
      location: {
        search: `?roomName=${mockRoomName}`,
      },
    };

    render(<Chat {...props} />, {
      wrapper,
    });

    // // wait asynchronous function inside component
    await act(() => promise);
    await act(() => promise2);

    expect(mockValues.setAPIError).toHaveBeenCalledWith(
      en.userNotFoundInChatError,
      routePath.selectRoom
    );
  });

  test("socket.io test", async () => {
    const emit = jest.fn();
    const on = jest.fn();
    const off = jest.fn();
    io.mockImplementation(() => ({
      emit,
      on,
      off,
    }));
    const mockUsername = "test-user";
    const numberOfMessages = 10;
    const promise = Promise.resolve({
      isSuccess: true,
      value: {
        name: mockUsername,
      },
    });
    const promise2 = Promise.resolve({
      isSuccess: true,
      value: getMessages(numberOfMessages, mockUsername),
    });
    fetchUser.mockImplementation(() => promise);
    fetchMessages.mockImplementation(() => promise2);
    const mockRoomName = "test-room";
    const props = {
      history,
      location: {
        search: `?roomName=${mockRoomName}`,
      },
    };

    render(<Chat {...props} />, {
      wrapper,
    });

    // wait asynchronous function inside component
    await act(() => promise);
    await act(() => promise2);

    expect(emit).toHaveBeenCalledWith(
      en.socketJoin,
      { username: mockUsername, room: mockRoomName },
      expect.any(Function)
    );

    expect(on).toHaveBeenCalledWith(en.socketMessage, expect.any(Function));
  });

  test("send message test", async () => {
    const emit = jest.fn();
    emit.mockImplementation((_, __, mockCallBack) => {
      if (mockCallBack) {
        mockCallBack();
      }
    });
    const on = jest.fn();
    const off = jest.fn();
    io.mockImplementation(() => ({
      emit,
      on,
      off,
    }));

    const mockUsername = "test-user";
    const numberOfMessages = 10;
    const promise = Promise.resolve({
      isSuccess: true,
      value: {
        name: mockUsername,
      },
    });
    const promise2 = Promise.resolve({
      isSuccess: true,
      value: getMessages(numberOfMessages, mockUsername),
    });
    fetchUser.mockImplementation(() => promise);
    fetchMessages.mockImplementation(() => promise2);
    saveMessages.mockReturnValue({
      isSuccess: true,
    });
    const mockRoomName = "test-room";
    const props = {
      history,
      location: {
        search: `?roomName=${mockRoomName}`,
      },
    };

    const { container, rerender } = render(<Chat {...props} />, {
      wrapper,
    });
    // wait asynchronous function inside component
    await act(() => promise);
    await act(() => promise2);

    let chatInput = container.getElementsByClassName("chat-input")[0];
    fireEvent.change(chatInput, { target: { value: "test input" } });

    let chatForm = container.getElementsByClassName("chat-input-form")[0];
    fireEvent.submit(chatForm);

    // failed to send message
    const sendErrMsg = "test-error";
    const promise3 = Promise.resolve({
      isSuccess: false,
      errorMessage: sendErrMsg,
    });
    saveMessages.mockReturnValue(promise3);

    fireEvent.change(chatInput, { target: { value: "test input2" } });

    fireEvent.submit(chatForm);

    await act(() => promise3);
    expect(mockValues.setAPIError).toHaveBeenCalledWith(sendErrMsg);
    expect(mockValues.setAPIError).toHaveBeenCalledTimes(1);

    // socket.io error
    emit.mockImplementation((_, __, mockCallBack) => {
      if (mockCallBack) {
        mockCallBack("error");
      }
    });

    rerender(<Chat {...props} />, {
      wrapper,
    });
    // wait asynchronous function inside component
    await act(() => promise);
    await act(() => promise2);

    chatInput = container.getElementsByClassName("chat-input")[0];
    fireEvent.change(chatInput, { target: { value: "test input" } });

    chatForm = container.getElementsByClassName("chat-input-form")[0];
    fireEvent.submit(chatForm);

    saveMessages.mockReturnValue(promise3);

    fireEvent.change(chatInput, { target: { value: "test input2" } });

    fireEvent.submit(chatForm);

    await act(() => promise3);
    expect(mockValues.setAPIError).toHaveBeenCalledWith(sendErrMsg);
    expect(mockValues.setAPIError).toHaveBeenCalledTimes(5);
  });
});
