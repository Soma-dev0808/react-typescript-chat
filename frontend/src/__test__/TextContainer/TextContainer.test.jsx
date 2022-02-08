import React from "react";
import { render } from "@testing-library/react";
import TextContainer from "../../components/TextContainer/TextContainer";
import { getUsers } from "../utils/utilities";

describe("TextContainer component render test", () => {
  test("render test", () => {
    const { getByText, getAllByRole, rerender } = render(<TextContainer />);

    // render with users(1 user)
    let users = getUsers();
    rerender(<TextContainer users={users} />);

    let headings = getAllByRole("heading");
    expect(headings.length).toBe(2);

    // check if all users passed were rendered
    users.forEach(({ name }) => {
      expect(getByText(name)).toBeInTheDocument();
    });

    // render with users(10 users)
    users = getUsers(10);
    rerender(<TextContainer users={users} />);

    // check if all users passed were rendered
    users.forEach(({ name }) => {
      expect(getByText(name)).toBeInTheDocument();
    });
  });
});
