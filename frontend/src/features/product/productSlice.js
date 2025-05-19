import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "./productService";

export const getAllProduct = createAsyncThunk(
  "product/get-all-produst",
  async (thunkAPI) => {
    try {
      return await productService.getProducts();
    } catch (error) {
      const message =
        error.response && error.response.data
          ? error.response.data
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const addToWishList = createAsyncThunk(
  "product/add-wishlist",
  async (prodId, thunkAPI) => {
    try {
      return await productService.addToWishlist(prodId);
    } catch (error) {
      const message =
        error.response && error.response.data
          ? error.response.data
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const getAproduct = createAsyncThunk(
  "product/get-a-product",
  async (prodId, thunkAPI) => {
    try {
      return await productService.getAproduct(prodId);
    } catch (error) {
      const message =
        error.response && error.response.data
          ? error.response.data
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const getColors = createAsyncThunk(
  "color/get-colors",
  async (thunkAPI) => {
    try {
      return await productService.getColor();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getProductsWithMeta = createAsyncThunk(
  "product/get-products-with-meta",
  async (params, thunkAPI) => {
    try {
      return await productService.getProductsWithMeta(params);
    } catch (error) {
      const message =
        error.response && error.response.data
          ? error.response.data
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Initial state
const productState = {
  product: null,
  productInfinity: null,
  addwishlist: null,
  colors: null,
  Aproduct: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const productSlice = createSlice({
  name: "product",
  initialState: productState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.product = action.payload;
      })
      .addCase(getAllProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || action.error.message;
      })
      .addCase(addToWishList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToWishList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.addwishlist = action.payload;
      })
      .addCase(addToWishList.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(getAproduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAproduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.Aproduct = action.payload;
      })
      .addCase(getAproduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || action.error.message;
      })
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
        state.message = action.payload || action.error.message;
      })
      .addCase(getProductsWithMeta.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductsWithMeta.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.productInfinity = action.payload; 
      })
      .addCase(getProductsWithMeta.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export default productSlice.reducer;
