import authService from "@/services/authService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const getCurrentUser = createAsyncThunk("auth/getCurrentUser", async () => {
  const res = await authService.me();
  console.log(res);
  if (res.success) {
    return res.data;
  } else {
    console.error(res?.message);
    return null;
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    currentUser: null,
    isLoading: false,
  },
  reducers: {
    logout(state) {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // builder là 1 function
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.currentUser = null;
        state.isLoading = false;
      });
  },
});

export { getCurrentUser };
export default authSlice.reducer;
export const { logout } = authSlice.actions;
