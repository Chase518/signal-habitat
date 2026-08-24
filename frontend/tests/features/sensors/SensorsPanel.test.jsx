import { configureStore } from "@reduxjs/toolkit";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import sensorsReducer from "../../../src/features/sensors/sensorsSlice";
import { SensorsPanel } from "../../../src/features/sensors";

const sampleResponse = {
  sensors: [
    {
      sensor_id: "S5",
      base_temperature_c: 20.0,
      is_faulty: true,
      reading_count: 672,
      latest_battery: 16.1,
      latest_rssi: -97.0,
      latest_reading_at: "2026-06-07 23:45:00",
    },
  ],
  battery_trend: [{ sensor_id: "S5", day: "2026-06-01", avg_battery: 83.6 }],
};

function renderWithStore(ui) {
  const store = configureStore({ reducer: { sensors: sensorsReducer } });
  return render(<Provider store={store}>{ui}</Provider>);
}

describe("SensorsPanel", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => sampleResponse,
      })
    );
  });

  it("flags the faulty sensor once data loads", async () => {
    renderWithStore(<SensorsPanel />);
    await waitFor(() => expect(screen.getByText("faulty")).toBeInTheDocument());
    expect(screen.getByText("S5")).toBeInTheDocument();
  });

  it("shows an error message when the sensors request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    renderWithStore(<SensorsPanel />);
    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
  });
});
