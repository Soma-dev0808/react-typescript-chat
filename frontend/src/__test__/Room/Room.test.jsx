import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Room from "../../components/Room/Room";
import useAuth from "../../common_components/CustomHooks/useAuth";
import createWrapper from "../utils/createWrapper";
import { en } from "../../utils/language";

jest.mock("../../common_components/CustomHooks/useAuth");

const { wrapper, history, mockValues } = createWrapper();

describe("App component render test", () => {
  test("render test", async () => {
    // render component with loading indicator(show loading)
    mockValues.apiErrorStatus.isApiLoading = true;
    useAuth.mockReturnValue({
      isAuth: false,
      isLoading: true,
      username: "test-user",
    });
    const mockSubmitAction = jest.fn();
    const { getAllByText, container, rerender } = render(
      <Room history={history} submitAction={mockSubmitAction} isJoin={true} />,
      {
        wrapper,
      }
    );

    // check loading indicator is rendered
    expect(
      container.getElementsByClassName("loading-indicator-container").length
    ).toBe(1);

    let formTitle = getAllByText(en.JOIN_ROOM_BUTTON_TITLE);
    expect(formTitle.length).toBe(2);

    let linkName = getAllByText(en.JOIN_ROOM_LINK_TITLE);
    expect(linkName.length).toBe(1);
  });

  test("form submit test", async () => {
    // render component with loading indicator(show loading)
    const mockUserName = "test-user";
    useAuth.mockReturnValue({
      isAuth: false,
      isLoading: true,
      username: mockUserName,
    });
    const mockSubmitAction = jest.fn();
    const { container } = render(
      <Room history={history} submitAction={mockSubmitAction} isJoin={true} />,
      {
        wrapper,
      }
    );

    const roomForm = container.getElementsByClassName("join-inner-form");
    const mockRoomName = "test-room";
    let roomInputValue = { target: { roomName: { value: "" } } };
    fireEvent.submit(roomForm[0], roomInputValue);
    expect(mockValues.startOrEndCallApi).toHaveBeenCalledTimes(1);
    expect(mockSubmitAction).not.toHaveBeenCalled();

    roomInputValue = { target: { roomName: { value: mockRoomName } } };
    fireEvent.submit(roomForm[0], roomInputValue);

    expect(mockValues.startOrEndCallApi).toHaveBeenCalledTimes(2);
    expect(mockSubmitAction).toHaveBeenCalledWith(
      mockUserName,
      mockRoomName,
      expect.any(Function)
    );
  });
});
