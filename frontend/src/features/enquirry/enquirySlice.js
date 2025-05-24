import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import enquiryService from "./enquiryService";

// Async thunk tạo enquiry
export const createEnquiry = createAsyncThunk(
  "enquiry/create",
  async ({ name, email, mobile, comment }, thunkAPI) => {
    try {
      return await enquiryService.createEnquiry({ name, email, mobile, comment });
    } catch (error) { 
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        "Error occurred";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  enquiry: null,       
  isCreateEnquiry: false,  
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const enquirySlice = createSlice({
  name: "enquiry",
  initialState,
  reducers: {
    resetStatusOrder: (state) => {
      state.isCreateEnquiry = false;
      state.isError = false;
      state.isLoading = false;
      state.isSuccess = false;
      state.message = "";
      state.enquiry = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEnquiry.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(createEnquiry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isCreateEnquiry = true;
        state.enquiry = action.payload;  
        state.message = "";
      })
      .addCase(createEnquiry.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isCreateEnquiry = false;
        state.message = action.payload || "Failed to create enquiry";
      });
  },
});

export const { resetStatusOrder } = enquirySlice.actions;
export default enquirySlice.reducer;
