import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "@/pages/Login";

const renderWithRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>);

describe("Login Page", () => {
  it("renders login form", () => {
    renderWithRouter(<Login />);
    expect(screen.getByText("Log in to your account")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("renders Google sign-in button", () => {
    renderWithRouter(<Login />);
    expect(screen.getByText("Continue with Google")).toBeInTheDocument();
  });

  it("has link to signup page", () => {
    renderWithRouter(<Login />);
    expect(screen.getByText("Sign up")).toBeInTheDocument();
  });

  it("toggles password visibility", () => {
    renderWithRouter(<Login />);
    const passwordInput = screen.getByPlaceholderText("Password");
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
