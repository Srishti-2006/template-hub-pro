import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Index from "@/pages/Index";

const renderWithRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>);

describe("Index Page", () => {
  it("renders hero section with tagline", () => {
    renderWithRouter(<Index />);
    expect(screen.getByText(/Create Stunning/)).toBeInTheDocument();
    expect(screen.getByText(/Videos, Designs/)).toBeInTheDocument();
  });

  it("renders CTA buttons", () => {
    renderWithRouter(<Index />);
    expect(screen.getByText("Start Creating")).toBeInTheDocument();
    expect(screen.getByText("Browse Templates")).toBeInTheDocument();
  });

  it("renders category section", () => {
    renderWithRouter(<Index />);
    expect(screen.getAllByText("Video Templates").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Photo Templates").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Resume Templates").length).toBeGreaterThan(0);
  });

  it("renders trending section", () => {
    renderWithRouter(<Index />);
    expect(screen.getByText(/Trending Templates/)).toBeInTheDocument();
  });

  it("renders navbar with TemplateHub brand", () => {
    renderWithRouter(<Index />);
    expect(screen.getAllByText("TemplateHub").length).toBeGreaterThan(0);
  });
});
