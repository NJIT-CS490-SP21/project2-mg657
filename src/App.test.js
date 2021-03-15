import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("check empty user can't login", () => {
  render(<App />);
  const loginButtonElement = screen.getByRole("button", { name: "Login" });
  const boardElement = screen.queryByTestId("board-element");
  expect(loginButtonElement).toBeInTheDocument();
  fireEvent.click(loginButtonElement);
  expect(loginButtonElement).toBeInTheDocument();
  expect(boardElement).not.toBeInTheDocument();
});

test("check entered user can login", () => {
  render(<App />);
  const loginButtonElement = screen.getByRole("button", { name: "Login" });
  const inputElement = screen.getByPlaceholderText("Enter Username");

  expect(loginButtonElement).toBeInTheDocument();
  fireEvent.change(inputElement, { target: { value: "mahi" } });
  fireEvent.click(loginButtonElement);
  const headingElement = screen.getByRole("heading", {
    name: "Welcome to Tic Tac Toe mahi",
  });
  expect(loginButtonElement).not.toBeInTheDocument();
  expect(headingElement).toBeInTheDocument();
});

test("check if leaderboard shows", () => {
  render(<App />);
  const loginButtonElement = screen.getByRole("button", { name: "Login" });
  const inputElement = screen.getByPlaceholderText("Enter Username");
  fireEvent.change(inputElement, { target: { value: "mahi" } });
  fireEvent.click(loginButtonElement);
  const leaderboardButton = screen.getByRole("button", { name: "Leaderboard" });
  const leaderboardElement = screen.queryByTestId("leaderboard-div");
  expect(leaderboardButton).toBeInTheDocument();
  expect(leaderboardElement.className).toBe("displayLeaderboard2");
  fireEvent.click(leaderboardButton);
  expect(leaderboardElement.className).toBe("displayLeaderboard");
});
