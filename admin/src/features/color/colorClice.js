import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import colorService from "./colorServie";
export const getColors = createAsyncThunk(
  "color/get-colors",
  async (thunkAPI) => {
    try {
      return await colorService.getColor();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createColor = createAsyncThunk(
  "color/create-color",
  async (colorData, thunkAPI) => {
    try {
      return await colorService.createColor(colorData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error);
    }
  }
);

export const getaColor = createAsyncThunk(
  "color/get-a-color",
  async (id, thunkAPI) => {
    try {
      return await colorService.getaColor(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateColor = createAsyncThunk(
  "color/update-color",
  async (id, colorData, thunkAPI) => {
    try {
      return await colorService.updateColor(id, colorData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error);
    }
  }
);

export const deleteaColor = createAsyncThunk(
  "color/delete-color",
  async (id, thunkAPI) => {
    try {
      return await colorService.deleteaColor(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const resetState = createAction("Reset_all");

const initialState = {
  colors: [],
  createcolor: null,
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};
export const colorSlice = createSlice({
  name: "color",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getColors.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getColors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.colors = action.payload;
      })
      .addCase(getColors.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch users";
      })
      .addCase(createColor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createColor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createcolor = action.payload;
      })
      .addCase(createColor.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch users";
      })
      .addCase(getaColor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getaColor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.colorName = action.payload.title;
      })
      .addCase(getaColor.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch users";
      })
      .addCase(updateColor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateColor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updatecolor = action.payload;
      })
      .addCase(updateColor.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch users";
      })
      .addCase(deleteaColor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteaColor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.deletecolor = action.payload;
      })
      .addCase(deleteaColor.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch users";
      })
      .addCase(resetState, () => initialState);
  },
});
export default colorSlice.reducer;
