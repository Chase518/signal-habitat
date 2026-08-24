import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchSensors } from "./api/sensorsApi";

export const loadSensors = createAsyncThunk("sensors/load", fetchSensors);

const sensorsSlice = createSlice({
  name: "sensors",
  initialState: {
    data: null,
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadSensors.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadSensors.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(loadSensors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default sensorsSlice.reducer;
