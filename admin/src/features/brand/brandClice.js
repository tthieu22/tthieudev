import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import brandService from "./brandServer";
export const getBrands = createAsyncThunk(
  "brand/get-brands",
  async (thunkAPI) => {
    try {
      return await brandService.getBrand();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createBrand = createAsyncThunk(
  "product/create-product",
  async (brandData, thunkAPI) => {
    try {
      return await brandService.createBrand(brandData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error);
    }
  }
);

export const getaBrand = createAsyncThunk(
  "brand/get-a-brand",
  async (id, thunkAPI) => {
    try {
      return await brandService.getaBrand(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateBrand = createAsyncThunk(
  "product/update-product",
  async (id, brandData, thunkAPI) => {
    try {
      return await brandService.updateBrand(id, brandData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error);
    }
  }
);

export const deleteaBrand = createAsyncThunk(
  "brand/delete-brand",
  async (id, thunkAPI) => {
    try {
      return await brandService.deleteaBrand(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetState = createAction("Reset_all");

const initialState = {
  brands: [],
  createBrands: null,
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};
export const brandSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBrands.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBrands.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.brands = action.payload;
      })
      .addCase(getBrands.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch users";
      })
      .addCase(createBrand.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createBrands = action.payload;
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch users";
      })
      .addCase(getaBrand.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getaBrand.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.brandName = action.payload.title;
      })
      .addCase(getaBrand.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch users";
      })
      .addCase(updateBrand.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updatebrand = action.payload;
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch users";
      })
      .addCase(deleteaBrand.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteaBrand.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.deletebrand = action.payload;
      })
      .addCase(deleteaBrand.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch users";
      })
      .addCase(resetState, () => initialState);
  },
});
export default brandSlice.reducer;
