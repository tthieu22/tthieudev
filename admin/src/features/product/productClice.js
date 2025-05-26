import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import productService from "./productService";

// Get all products
export const getProducts = createAsyncThunk(
  "product/get-all-product",
  async ({ page = 1, limit = 10 }, thunkAPI) => {
    try {
      return await productService.getProducts({ page, limit });
    } catch (error) {
      const message =
        error.response && error.response.data
          ? error.response.data
          : error.message;
      return thunkAPI.rejectWithValue(message);
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
// Create a new product
export const createProduct = createAsyncThunk(
  "product/create-product",
  async (productData, thunkAPI) => {
    try {
      return await productService.createProduct(productData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error);
    }
  }
);

// Upload images for a product
export const uploadProductImages = createAsyncThunk(
  "product/upload-product-images",
  async ({ productId, data }, thunkAPI) => {
    try {
      const formData = new FormData();
      for (let i = 0; i < data.length; i++) {
        formData.append("images", data[i]);
      }
      return await productService.uploadImagesProduct(productId, formData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error);
    }
  }
);

// Delete product image
export const deleteProductImage = createAsyncThunk(
  "product/delete-product-image",
  async (imageId, thunkAPI) => {
    try {
      return await productService.deleteImageProduct(imageId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error);
    }
  }
);

// Get a single product
export const getaProduct = createAsyncThunk(
  "product/get-a-product",
  async (id, thunkAPI) => {
    try {
      return await productService.getaProduct(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(  
  "product/update-product",
  async ({ id, product }, thunkAPI) => {
    try {
      return await productService.updateProduct(id, product);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Delete product
export const deleteaProduct = createAsyncThunk(
  "product/delete-product",
  async (id, thunkAPI) => {
    try {
      return await productService.deleteProduct(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Reset state action
export const resetState = createAction("Reset_all");

// Initial state
const initialState = {
  products: [],
  createdProduct: null,
  uploadedImages: null,
  deletedImage: null,
  singleProduct: null, 
  updateProduct: null,
  deletedProduct: null,
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};
// Create product slice
export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.createdProduct = action.payload;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(uploadProductImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadProductImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.uploadedImages = action.payload;
      })
      .addCase(uploadProductImages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteProductImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProductImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.deletedImage = action.payload;
      })
      .addCase(deleteProductImage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getaProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getaProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.singleProduct = action.payload;
      })
      .addCase(getaProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.updateProduct = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteaProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteaProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.deletedProduct = action.payload;
      })
      .addCase(deleteaProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getProductsWithMeta.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductsWithMeta.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = action.payload;
      })
      .addCase(getProductsWithMeta.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Reset state
      .addCase(resetState, () => initialState);
  },
});

// Export actions
export default productSlice.reducer;
