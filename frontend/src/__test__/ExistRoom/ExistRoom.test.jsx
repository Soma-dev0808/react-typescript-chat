import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import ExistRoom from "../../components/Room/FindRooms/ExistRoom/ExistRoom";
import createWrapper from "../utils/createWrapper";

afterEach(cleanup);

const { wrapper } = createWrapper();

describe("ExistRoom component render test", () => {
  test("render test", () => {
    const roomName = "testRoom";
    let room = {};
    const buttonAction = jest.fn();

    const { getByText, getByRole, rerender } = render(
      <ExistRoom room={room} buttonAction={buttonAction} />,
      {
        wrapper,
      }
    );
    let button = getByRole("button");
    fireEvent.click(button);
    expect(buttonAction).not.toHaveBeenCalled();

    room = { roomName, users: ["test-user1", "test-user2"] };
    rerender(<ExistRoom room={room} buttonAction={buttonAction} />, {
      wrapper,
    });

    expect(getByText("Room Name: " + roomName)).toBeInTheDocument();
    expect(getByText("People: " + room.users.length)).toBeInTheDocument();
    button = getByRole("button");
    fireEvent.click(button);
    expect(buttonAction).toHaveBeenCalled();
  });
});
