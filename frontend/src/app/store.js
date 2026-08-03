import { configureStore } from "@reduxjs/toolkit";
import analysisReducer from "../features/analysis/analysisSlice";

export const store = configureStore({
  reducer: {
    analysis: analysisReducer,
  },
});
