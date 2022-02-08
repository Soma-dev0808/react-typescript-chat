import React from "react";
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import FindRooms from "../../components/Room/FindRooms/FindRooms";
import createWrapper from "../utils/createWrapper";
import { mockScrollProp, generateDummyRooms } from "../utils/utilities";
import useAuth from "../../common_components/CustomHooks/useAuth";
import {
  fetchRoomList,
  joinRoomService,
} from "../../components/Room/service/service";

const mockHistoryPush = jest.fn();

jest.mock("../../components/Room/service/service");
jest.mock("../../common_components/CustomHooks/useAuth");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

afterEach(cleanup);

const { wrapper, mockValues } = createWrapper();

describe("FindRooms component render test", () => {
  test("render test", async () => {
    const buttonAction = jest.fn();
    useAuth.mockReturnValue({
      isAuth: true,
      isLoading: false,
      username: "test-user",
    });
    const promise = Promise.resolve({
      isSuccess: true,
      value: {
        roomList: [],
        nextRef: -1,
      },
    });

    fetchRoomList.mockImplementation(() => promise);

    render(<FindRooms handleClose={buttonAction} />, {
      wrapper,
    });

    await act(() => promise);
  });

  test("initial loading error test", async () => {
    const buttonAction = jest.fn();
    useAuth.mockReturnValue({
      isAuth: true,
      isLoading: false,
      username: "test-user",
    });
    const errorMessage = "test-error";
    const promise = Promise.resolve({
      isSuccess: false,
      value: {},
      errorMessage: errorMessage,
    });
    fetchRoomList.mockImplementation(() => promise);
    mockValues.setAPIError = jest.fn();

    render(<FindRooms handleClose={buttonAction} />, {
      wrapper,
    });

    await act(() => promise);

    expect(mockValues.setAPIError).toHaveBeenCalledWith(errorMessage);
  });

  test("handle load more test", async () => {
    const buttonAction = jest.fn();
    useAuth.mockReturnValue({
      isAuth: true,
      isLoading: false,
      username: "test-user",
    });
    const promise = Promise.resolve({
      isSuccess: true,
      value: {
        roomList: [],
        nextRef: 1,
      },
    });

    fetchRoomList.mockImplementation(() => promise);

    const { container } = render(<FindRooms handleClose={buttonAction} />, {
      wrapper,
    });

    await act(() => promise);

    const roomList = container.getElementsByClassName("find-room-list");
    Object.defineProperties(window.HTMLElement.prototype, mockScrollProp(true));

    fireEvent.scroll(roomList.item(0), {
      target: { screenY: 100 },
    });

    await act(() => promise);
  });

  test("render rooms and click them test", async () => {
    const buttonAction = jest.fn();
    useAuth.mockReturnValue({
      isAuth: true,
      isLoading: false,
      username: "test-user",
    });
    mockValues.setAPIError = jest.fn();
    const rooms = generateDummyRooms(10);

    const promise = Promise.resolve({
      isSuccess: true,
      value: {
        roomList: [...rooms],
        nextRef: -1,
      },
    });

    let promise2 = Promise.resolve({
      isSuccess: true,
    });

    fetchRoomList.mockImplementation(() => promise);
    joinRoomService.mockImplementation(() => promise2);

    const { getByText, getAllByRole } = render(
      <FindRooms handleClose={buttonAction} />,
      {
        wrapper,
      }
    );

    await act(() => promise);

    expect(getByText(`Room Name: ${rooms[3].roomName}`)).toBeInTheDocument();

    const joinButton = getAllByRole("button")[4];
    fireEvent.click(joinButton);

    await act(() => promise2);

    expect(mockHistoryPush).toHaveBeenCalledWith("/chat?roomName=test-room-3");
    const errorMessage = "test-error";
    promise2 = Promise.resolve({
      isSuccess: false,
      errorMessage,
    });

    fireEvent.click(joinButton);

    await act(() => promise2);

    expect(mockValues.setAPIError).toHaveBeenCalledWith(errorMessage);
  });
});
