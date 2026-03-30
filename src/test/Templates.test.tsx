import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Templates from "@/pages/Templates";

const renderWithRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>);

describe("Templates Page", () => {
  it("renders the page title", () => {
    renderWithRouter(<Templates />);
    expect(screen.getByText("Browse Templates")).toBeInTheDocument();
  });

  it("renders category filter tabs", () => {
    renderWithRouter(<Templates />);
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Videos")).toBeInTheDocument();
    expect(screen.getByText("Photos")).toBeInTheDocument();
    expect(screen.getByText("Resumes")).toBeInTheDocument();
  });

  it("filters templates when clicking a category tab", () => {
    renderWithRouter(<Templates />);
    fireEvent.click(screen.getByText("Resumes"));
    expect(screen.getByText("Professional CV")).toBeInTheDocument();
  });
});
