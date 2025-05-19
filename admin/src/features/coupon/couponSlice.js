import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import couponService from "./couponService";
export const getAllCoupon = createAsyncThunk(
  "coupon/get-coupons",
  async (thunkAPI) => {
    try {
      return await couponService.getCoupon();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createCoupon = createAsyncThunk(
  "coupon/create-coupon",
  async (couponData, thunkAPI) => {
    try {
      return await couponService.createCoupon(couponData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error);
    }
  }
);
export const resetState = createAction("Reset_all");

const initialState = {
  coupons: [],
  createcoupon: null,
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};
export const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCoupon.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.coupons = action.payload;
      })
      .addCase(getAllCoupon.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch users";
      })
      .addCase(createCoupon.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createcoupon = action.payload;
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch users";
      })
      .addCase(resetState, () => initialState);
  },
});
export default couponSlice.reducer;
