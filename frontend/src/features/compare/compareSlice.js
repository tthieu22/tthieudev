import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartService } from "./compareService";

export const addToCompare = createAsyncThunk(
  "compare/add-to-compare",
  async (productId, thunkAPI) => {
    try {
      return await cartService.addToCompare(productId);
    } catch (error) {
      const message =
        error.response && error.response.data
          ? error.response.data
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteFromCompare = createAsyncThunk(
  "compare/delete-from-compare",
  async (productId, thunkAPI) => {
    try {
      const existingCompare = JSON.parse(localStorage.getItem("compare")) || [];
      const updatedCompare = existingCompare.filter(item => item._id !== productId);
      localStorage.setItem("compare", JSON.stringify(updatedCompare));
      return productId;
    } catch (error) {
      return thunkAPI.rejectWithValue("Lỗi khi xóa sản phẩm khỏi compare");
    }
  }
);

export const emptyCompare = createAsyncThunk(
  "compare/empty-compare",
  async (_, thunkAPI) => {
    try {
      localStorage.removeItem("compare");
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue("Lỗi khi làm trống compare");
    }
  }
);

export const getAllCompare = createAsyncThunk(
  "compare/get-all-compare",
  async (_, thunkAPI) => {
    try {
      const existingCompare = JSON.parse(localStorage.getItem("compare")) || [];
      return existingCompare;
    } catch (error) {
      return thunkAPI.rejectWithValue("Lỗi khi lấy danh sách compare");
    }
  }
);

const compareState = {
  compareList: [],
  isAddCompare: false,
  isEmptyCompare: false,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const compareSlice = createSlice({
  name: "compare",
  initialState: compareState,
  reducers: {
    resetStatusCompare: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
      state.isAddCompare = null;
      state.isEmptyCompare = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCompare.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCompare.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      
        const newProduct = action.payload;
        const existsInState = state.compareList.some(item => item._id === newProduct._id);
      
        // Lấy compare hiện có trong localStorage
        const existingCompare = JSON.parse(localStorage.getItem("compare")) || [];
      
        const existsInStorage = existingCompare.some(item => item._id === newProduct._id);
      
        if (existsInState && existsInStorage) {
          // Nếu đã tồn tại => xóa khỏi compareList và localStorage
          state.compareList = state.compareList.filter(item => item._id !== newProduct._id);
          const updatedCompare = existingCompare.filter(item => item._id !== newProduct._id);
          localStorage.setItem("compare", JSON.stringify(updatedCompare));
      
          state.isAddCompare = false;
          state.message = "Đã xóa sản phẩm khỏi danh sách so sánh.";
        } else {
          // Nếu chưa có => thêm vào compareList và localStorage
          state.compareList.push(newProduct);
          existingCompare.push(newProduct);
          localStorage.setItem("compare", JSON.stringify(existingCompare));
      
          state.isAddCompare = true;
          state.message = "Đã thêm sản phẩm vào danh sách so sánh.";
        }
      })
      
      .addCase(addToCompare.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isAddCompare = false;
        state.message = action.payload || action.error.message;
      })
      .addCase(emptyCompare.fulfilled, (state) => {
        state.compareList = [];
        state.isEmptyCompare = true;
      })
      .addCase(emptyCompare.rejected, (state, action) => {
        state.isError = true;
        state.isEmptyCompare = false;
        state.message = action.payload || action.error.message;
      })
      .addCase(getAllCompare.fulfilled, (state, action) => {
        state.compareList = action.payload;
      })
      .addCase(getAllCompare.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload || action.error.message;
      });
  }
});

export const { resetStatusCompare } = compareSlice.actions;
export default compareSlice.reducer;
