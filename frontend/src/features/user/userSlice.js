import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import { authService } from "./userService";
import { toast } from "react-toastify";
import {getTokenFromLocalStorage , getUserFromLocalStorage} from "../../utils/axiosConfig";
// register
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      const message =
        error.response && error.response.data
          ? error.response.data
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error) {
      const message =
        error.response && error.response.data
          ? error.response.data
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// get wishlist
export const getAWishList = createAsyncThunk(
  "auth/get-wishlist",
  async (thunkAPI) => {
    try {
      return await authService.getaWishlist();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// add to cart
export const addToCart = createAsyncThunk(
  "cart/add-to-cart",
  async ({ productId, quantity, colorId }, thunkAPI) => {
    try {
      return await authService.addToCart({ productId, quantity, colorId });
    } catch (error) {
      const message =
        error.response && error.response.data
          ? error.response.data
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get cart
export const getCartUser = createAsyncThunk(
  "cart/get-cart-user",
  async (thunkAPI) => {
    try {
      return await authService.getCartUser();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
)

// Update quantity item
export const updateCartItemQuantity = createAsyncThunk(
  "cart/update-quantity-item",
  async (cartData, thunkAPI) => {
    try {
      return await authService.updateCartItemQuantity(cartData);
    } catch (error) {
      const message =
        error.response && error.response.data
          ? error.response.data
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
)

// Delte item
export const deleteCartItem = createAsyncThunk(
  "cart/delete-item",
  async ({ productId, colorId }, thunkAPI) => {
    try {
      return await authService.deleteCartItem({ productId, colorId });
    } catch (error) {
      const message =
        error.response && error.response.data
          ? error.response.data
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
)
// Empty cart
export const emptyCartAction = createAsyncThunk(
  "cart/empty-cart",
  async (thunkAPI) => {
    try {
      return await authService.emptyCart();
    } catch (error) {
      const message =
        error.response && error.response.data
          ? error.response.data
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
)

// Aplly coupon
export const applyCoupon = createAsyncThunk(
  "cart/apply-coupon",
  async (couponCode, thunkAPI) => {
    try {
      return await authService.applyCoupon(couponCode);
    } catch (error) {
      const message =
        error.response && error.response.data
          ? error.response.data
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
)
// Logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      return await authService.logout();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/update-user",
  async (formData, thunkAPI) => {
    try {
      return await authService.updateUser(formData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgot-password",
  async (email, thunkAPI) => {
    try {
      return await authService.forgotPassword(email);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/reset-password",
  async ({ token, password }, thunkAPI) => {
    try {
      return await authService.resetPassword(token, password);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Initial state
const initialState = {
  user: getTokenFromLocalStorage(),
  createUser: null,
  loginuser: getUserFromLocalStorage(),
  isAddCart: false,
  getCart: null,
  updateQuantityItem: null,
  removeItem: null,
  emptyCart: null,
  wishlist: [],
  isApplyCoupon: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};
export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    resetStatus: (state) => {
      state.isSuccess = false;
      state.isError = false;
      state.isLoading = false; 
      state.updateQuantityItem = null;
      state.removeItem = null;
      state.emptyCart = null;
      state.isAddCart = false;
      state.message = "";
      state.isApplyCoupon = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createUser = action.payload;
        toast.info("User created successfully", {
          onClick: () => {
            navigator("/login");
          }
        });
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || action.error.message;
        toast.error(state.message);
      })
      // login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = action.payload?.message;
        if (state.message === "Error") {
          localStorage.removeItem("customer");
          localStorage.removeItem("token");
          toast.error("Tên tài khoản hoặc mật khẩu không đúng");
        } else {
          state.loginuser = action.payload;
          if (state.isSuccess === true) {
            localStorage.setItem("token", action.payload?.token);
            toast.success("Đăng nhập thành công");
          }
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || action.error.message; 
      })
      // get wishlist
      .addCase(getAWishList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAWishList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true; 
        state.wishlist = action.payload;
      })
      .addCase(getAWishList.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || action.error.message; 
      }) 
      
      // add to cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isAddCart = true;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isAddCart = false;
        state.message = action.payload || action.error.message;
      })
      // Get cart
      .addCase(getCartUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCartUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.getCart = action.payload;
      })
      .addCase(getCartUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || action.error.message;
      })
      // Update quantity item
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updateQuantityItem = action.payload;
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || action.error.message;
      })
      // Remove item
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.removeItem = action.payload;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || action.error.message;
      })
      // Empty cart
      .addCase(emptyCartAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(emptyCartAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.emptyCart = action.payload;
      })
      .addCase(emptyCartAction.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || action.error.message;
      })
      // Apply coupon
      .addCase(applyCoupon.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isApplyCoupon = action.payload;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || action.error.message;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.user = null;
        state.loginuser = null;
        localStorage.removeItem("customer");
        localStorage.removeItem("token");
        toast.success("Đăng xuất thành công");
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.user = null;
        state.loginuser = null;
        localStorage.removeItem("customer");
        localStorage.removeItem("token");
        toast.success("Đăng xuất thành công");
      })
      
      // forgotPassword
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Password reset email sent";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to send reset email";
      })

      // resetPassword
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Password reset successful";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Password reset failed";
      });
  },
});
export default authSlice.reducer;

export const { resetStatus } = authSlice.actions;
