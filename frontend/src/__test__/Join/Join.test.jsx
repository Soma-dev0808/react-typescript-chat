import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Join from "../../components/Room/Join";
import useAuth from "../../common_components/CustomHooks/useAuth";
import createWrapper from "../utils/createWrapper";
import { en } from "../../utils/language";
import { joinRoomService } from "../../components/Room/service/service";

jest.mock("../../common_components/CustomHooks/useAuth");
jest.mock("../../components/Room/service/service");

const { wrapper, history, mockValues } = createWrapper();

describe("Join component render test", () => {
  test("render test", () => {
    // render component with loading indicator(show loading)
    useAuth.mockReturnValue({
      isAuth: true,
      isLoading: false,
      username: "test-user",
    });

    const { getAllByText, container } = render(<Join history={history} />, {
      wrapper,
    });

    // check loading indicator is rendered
    expect(
      container.getElementsByClassName("loading-indicator-container").length
    ).toBe(0);

    let formTitle = getAllByText(en.JOIN_ROOM_BUTTON_TITLE);
    expect(formTitle.length).toBe(2);

    let linkName = getAllByText(en.JOIN_ROOM_LINK_TITLE);
    expect(linkName.length).toBe(1);
  });

  test("submit form test", (done) => {
    const mockUsername = "test-user";
    useAuth.mockReturnValue({
      isAuth: true,
      isLoading: false,
      username: mockUsername,
    });

    const { container } = render(<Join history={history} />, {
      wrapper,
    });

    // test the cace when joinRoomService returns isSuccess true
    joinRoomService.mockReturnValue({ isSuccess: true });
    const roomForm = container.getElementsByClassName("join-inner-form");
    const mockRoomname = "test-room";
    const roomInputValue = { target: { roomName: { value: mockRoomname } } };

    fireEvent.submit(roomForm[0], roomInputValue);

    expect(joinRoomService).toHaveBeenCalledWith({
      username: mockUsername,
      roomName: mockRoomname,
    });

    // test the cace when joinRoomService returns isSuccess false
    joinRoomService.mockReturnValue({ isSuccess: true });
    fireEvent.submit(roomForm[0], roomInputValue);

    expect(mockValues.setAPIError).toHaveBeenCalled();
    done();
  });
});
