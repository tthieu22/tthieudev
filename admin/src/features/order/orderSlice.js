import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import { orderService } from "./orderServive";

export const cancelOrder = createAsyncThunk(
    "order/cancel-order",
    async (orderId, thunkAPI) => {
        try {
            return await orderService.cancelOrder(orderId);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)
export const getOrderDetail = createAsyncThunk(
    "order/get-order-detail",
    async (orderId, thunkAPI) => {
        try {
            return await orderService.getOrderDetail(orderId);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const createOrder = createAsyncThunk(
    "order/create-order",
    async (orderData, thunkAPI) => {
        try {
            return await orderService.createOrder(orderData);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)
export const getOrderByCode = createAsyncThunk(
    "order/get-order-by-code",
    async (orderCode, thunkAPI) => {
        try {
            return await orderService.getOrderByCode(orderCode);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)
export const updateOrderStatus = createAsyncThunk(
    "order/update-order-status",
    async ({ orderId, status }, thunkAPI) => {
        try {
            return await orderService.updateOrderStatus( orderId, status );
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

const initialState = {
    orders: [],
    isCreateOrder: null,
    isGetOrderNew: null,
    isCancelOrder: null,
    isGetOrderDetail: null,
    isError: false,
    isLoading: false,
    isSuccess: false,
    isOrderCode: null,
    isUpdateOrderStatus: null,
    message: "",
}

export const orderSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    resetStatusOrder: (state) => {
      state.isSuccess = false;
      state.isError = false;
      state.isLoading = false;
      state.orders = null;
      state.isGetOrderNew = null;
      state.isCancelOrder = null;
      state.isGetOrderDetail = null;
      state.isCreateOrder = null;
      state.isOrderCode = null;
      state.isUpdateOrderStatus = null;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
        state.isCancelOrder = true;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isCancelOrder = false;
        state.orders = action.payload;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch users";
      })
      .addCase(getOrderDetail.pending, (state) => {
        state.isLoading = true;
        state.isGetOrderDetail = true;
      })
      .addCase(getOrderDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isGetOrderDetail = false;
        state.orders = action.payload;
      })
      .addCase(getOrderDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch users";
      })
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.isCreateOrder = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isCreateOrder = false;
        state.orders = action.payload;
        state.isGetOrderNew = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch users";
      })
      .addCase(getOrderByCode.pending, (state) => {
        state.isLoading = true;
        state.isOrderCode = true;
      })
      .addCase(getOrderByCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isOrderCode = action.payload;
        state.orders = action.payload;
      })
      .addCase(getOrderByCode.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch users";
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.isUpdateOrderStatus = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isUpdateOrderStatus = action.payload;
        state.orders = action.payload;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch users";
      });
      
    }
});

export const { resetStatusOrder } = orderSlice.actions;
export default orderSlice.reducer;
