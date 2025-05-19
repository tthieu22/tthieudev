import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { contactService } from "./contactService";

export const createQuery = createAsyncThunk(
  "contact/post",
  async (contactData, thunkAPI) => {
    try {
      return await contactService.postQuery(contactData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const contactState = {
  contact: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const productSlice = createSlice({
  name: "contact",
  initialState: contactState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createQuery.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createQuery.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.contact = action.payload;
      })
      .addCase(createQuery.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || action.error.message;
      });
  },
});

export default productSlice.reducer;
