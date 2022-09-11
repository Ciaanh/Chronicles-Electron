import { createSlice } from "@reduxjs/toolkit";

export const signoutSlice = createSlice({
  name: "signout",
  initialState: {
    loading: false,
    errors: null,
  },
  reducers: {
    signout_start: (state) => {},
    signout_complete: (state) => {},
    signout_error: (state) => {},
  },
});

export const { signout_start, signout_complete, signout_error } = signoutSlice.actions;
export default signoutSlice.reducer;