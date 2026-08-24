import { configureStore } from "@reduxjs/toolkit";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import detectionsReducer from "../../../src/features/detections/detectionsSlice";
import { DetectionsPanel } from "../../../src/features/detections";

const sampleResponse = {
  total_count: 975,
  recent_events: [{ sensor_id: "S3", timestamp: "2026-06-07 18:15:00" }],
  daily_counts: [{ day: "2026-06-01", count: 142 }],
};

function renderWithStore(ui) {
  const store = configureStore({ reducer: { detections: detectionsReducer } });
  return render(<Provider store={store}>{ui}</Provider>);
}

describe("DetectionsPanel", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => sampleResponse,
      })
    );
  });

  it("shows the total detection count once data loads", async () => {
    renderWithStore(<DetectionsPanel />);
    await waitFor(() => expect(screen.getByText("975")).toBeInTheDocument());
    expect(screen.getByText("S3")).toBeInTheDocument();
  });

  it("shows an error message when the detections request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    renderWithStore(<DetectionsPanel />);
    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
  });
});
