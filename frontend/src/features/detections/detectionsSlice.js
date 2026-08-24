import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchDetections } from "./api/detectionsApi";

export const loadDetections = createAsyncThunk("detections/load", fetchDetections);

const detectionsSlice = createSlice({
  name: "detections",
  initialState: {
    data: null,
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadDetections.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadDetections.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(loadDetections.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default detectionsSlice.reducer;
