import { configureStore } from "@reduxjs/toolkit";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import analysisReducer from "../../../src/features/analysis/analysisSlice";
import { AnalysisPanel } from "../../../src/features/analysis";

const sampleResponse = {
  meta: {
    sensor_count: 5,
    raw_reading_count: 3360,
    confident_reading_count: 3287,
    detection_count: 975,
  },
  aggregated_points: [
    { temperature_bin_center: 10, n_readings: 100, n_detections: 20, activity_frequency: 0.2 },
    { temperature_bin_center: 18, n_readings: 100, n_detections: 40, activity_frequency: 0.4 },
  ],
  models: {
    linear: { degree: 1, coefficients: [0.2, 0.01], p_values: [0.01, 0.4], r_squared: 0.03 },
    quadratic: { degree: 2, coefficients: [-0.5, 0.1, -0.003], p_values: [0.01, 0.001, 0.001], r_squared: 0.89 },
  },
};

function renderWithStore(ui) {
  const store = configureStore({ reducer: { analysis: analysisReducer } });
  return render(<Provider store={store}>{ui}</Provider>);
}

describe("AnalysisPanel", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => sampleResponse,
      })
    );
  });

  it("shows the quadratic model's R-squared once data loads", async () => {
    renderWithStore(<AnalysisPanel />);
    await waitFor(() => expect(screen.getByText(/R² = 0.890/)).toBeInTheDocument());
  });

  it("shows an error message when the analysis request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    renderWithStore(<AnalysisPanel />);
    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
  });
});
