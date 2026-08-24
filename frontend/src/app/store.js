import { configureStore } from "@reduxjs/toolkit";
import analysisReducer from "../features/analysis/analysisSlice";
import detectionsReducer from "../features/detections/detectionsSlice";
import sensorsReducer from "../features/sensors/sensorsSlice";

export const store = configureStore({
  reducer: {
    analysis: analysisReducer,
    sensors: sensorsReducer,
    detections: detectionsReducer,
  },
});
