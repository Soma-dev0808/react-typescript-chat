import React from "react";
import { render, cleanup } from "@testing-library/react";
import InfoBar from "../../components/Chat/InfoBar/InfoBar";
import createWrapper from "../utils/createWrapper";

afterEach(cleanup);

const { wrapper } = createWrapper();

describe("InfoBar component render test", () => {
  test("render test", () => {
    const roomName = "testRoom";
    const { getByText } = render(<InfoBar room={roomName} />, { wrapper });
    expect(getByText(roomName)).toBeInTheDocument();
  });
});
