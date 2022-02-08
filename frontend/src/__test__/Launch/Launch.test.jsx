import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Launch from "../../components/Room/Launch";
import useAuth from "../../common_components/CustomHooks/useAuth";
import createWrapper from "../utils/createWrapper";
import { en } from "../../utils/language";
import { launchRoomService } from "../../components/Room/service/service";

jest.mock("../../common_components/CustomHooks/useAuth");
jest.mock("../../components/Room/service/service");

const { wrapper, history, mockValues } = createWrapper();

describe("Launch component render test", () => {
  test("render test", () => {
    // render component with loading indicator(show loading)
    useAuth.mockReturnValue({
      isAuth: true,
      isLoading: false,
      username: "test-user",
    });

    const { getAllByText, container } = render(<Launch history={history} />, {
      wrapper,
    });

    // check loading indicator is rendered
    expect(
      container.getElementsByClassName("loading-indicator-container").length
    ).toBe(0);

    let formTitle = getAllByText(en.LAUNCH_ROOM_BUTTON_TITLE);
    expect(formTitle.length).toBe(2);

    let linkName = getAllByText(en.LAUNCH_ROOM_LINK_TITLE);
    expect(linkName.length).toBe(1);
  });

  test("submit form test", (done) => {
    const mockUsername = "test-user";
    useAuth.mockReturnValue({
      isAuth: true,
      isLoading: false,
      username: mockUsername,
    });

    const { container } = render(<Launch history={history} />, {
      wrapper,
    });

    // test the cace when launchRoomService returns isSuccess true
    launchRoomService.mockReturnValue({ isSuccess: true });
    const roomForm = container.getElementsByClassName("join-inner-form");
    const mockRoomname = "test-room";
    const roomInputValue = { target: { roomName: { value: mockRoomname } } };

    fireEvent.submit(roomForm[0], roomInputValue);

    expect(launchRoomService).toHaveBeenCalledWith({
      username: mockUsername,
      roomName: mockRoomname,
    });

    // test the cace when launchRoomService returns isSuccess false
    launchRoomService.mockReturnValue({ isSuccess: true });
    fireEvent.submit(roomForm[0], roomInputValue);

    expect(mockValues.setAPIError).toHaveBeenCalled();
    done();
  });
});
