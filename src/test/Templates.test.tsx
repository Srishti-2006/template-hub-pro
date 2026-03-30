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
    expect(screen.getAllByText("Videos").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Photos").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Resumes").length).toBeGreaterThan(0);
  });

  it("filters templates when clicking a category tab", () => {
    renderWithRouter(<Templates />);
    const resumeButtons = screen.getAllByText("Resumes");
    // Click the filter tab button (not the nav link)
    const tabButton = resumeButtons.find((el) => el.tagName === "BUTTON");
    if (tabButton) fireEvent.click(tabButton);
    expect(screen.getByText("Professional CV")).toBeInTheDocument();
  });
});
