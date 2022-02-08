import React from "react";
import { render } from "@testing-library/react";
import RoomForm from "../../components/Room/RoomForm/RoomForm";
import createWrapper from "../utils/createWrapper";
import { en } from "../../utils/language";

const { wrapper, history, mockValues } = createWrapper();

describe("RoomForm component render test", () => {
  test("render test", async () => {
    // render form to check join room page was rendered.
    const mockButtonAction = jest.fn();
    const { getAllByText, rerender } = render(
      <RoomForm isJoin={true} buttonAction={mockButtonAction} />,
      { wrapper }
    );

    let formTitle = getAllByText(en.JOIN_ROOM_BUTTON_TITLE);
    expect(formTitle.length).toBe(2);

    let linkName = getAllByText(en.JOIN_ROOM_LINK_TITLE);
    expect(linkName.length).toBe(1);

    // render form to check join room page was rendered.
    rerender(<RoomForm isJoin={false} buttonAction={mockButtonAction} />, {
      wrapper,
    });

    formTitle = getAllByText(en.LAUNCH_ROOM_BUTTON_TITLE);
    expect(formTitle.length).toBe(2);

    linkName = getAllByText(en.LAUNCH_ROOM_LINK_TITLE);
    expect(linkName.length).toBe(1);
  });
});
