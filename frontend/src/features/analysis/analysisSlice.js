import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAnalysis } from "./api/analysisApi";

export const loadAnalysis = createAsyncThunk("analysis/load", fetchAnalysis);

const analysisSlice = createSlice({
  name: "analysis",
  initialState: {
    data: null,
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAnalysis.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadAnalysis.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(loadAnalysis.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default analysisSlice.reducer;
