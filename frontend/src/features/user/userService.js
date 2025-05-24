import axios from "axios";
import { base_url, getConfig } from "../../utils/axiosConfig";

//Register
const register = async (userData) => {
  try {
    const response = await axios.post(`${base_url}user/register`, userData);
    if (response.data) {
      const { token, ...user } = response.data; 
      localStorage.setItem("customer", JSON.stringify(user));
      localStorage.setItem("token", token);  
      return response.data;
    }
  } catch (error) {
    throw error.response && error.response.data
      ? error.response.data
      : error.message;
  }
};
// Login
const login = async (userData) => {
  try {
    const response = await axios.post(`${base_url}user/login`, userData);
    if (response.data) {
      const { token, ...user } = response.data; 
      localStorage.setItem("customer", JSON.stringify(user));
      localStorage.setItem("token", token);  
      return response.data;
    }
  } catch (error) {}
};

// Wishlist
const getaWishlist = async () => {
  try {
    const response = await axios.get(`${base_url}user/wish-list`, getConfig());

    if (response.data) {
      return response.data;
    }
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get cart 
const getCartUser = async () => {
  try {
      const response = await axios.get(`${base_url}user/cart`, getConfig());
      return response.data;
  } catch (error) {
      throw error.response && error.response.data
          ? error.response.data
          : error.message;
  }
}
// Add to cart
const addToCart = async ({ productId, quantity, colorId }) => {
  try {
      const response = await axios.post(`${base_url}user/cart`, { productId, quantity, colorId }, getConfig());
      return response.data;
  } catch (error) {
      throw error.response && error.response.data
          ? error.response.data
          : error.message;
  }
}

// Update cart item
const updateCartItemQuantity = async ({ productId, quantity, colorId }) => {
  try {
      const response = await axios.put(`${base_url}user/update-quantity-product`, { productId, quantity, colorId }, getConfig());
      return response.data;
  } catch (error) {
      throw error.response && error.response.data
          ? error.response.data
          : error.message;
  }
}
// Delete cart item
const deleteCartItem = async ({ productId, colorId }) => {
  try {  
    const response = await axios.delete(`${base_url}user/delete-product-cart`, {
      data: { productId, colorId },
      ...getConfig()
    });
    return response.data;
  } catch (error) {
    throw error.response && error.response.data
      ? error.response.data
      : error.message;
  }
};

// Empty cart
const emptyCart = async () => {
  try {
      const response = await axios.delete(`${base_url}user/empty-cart`, getConfig());
      return response.data;
  } catch (error) {
      throw error.response && error.response.data
          ? error.response.data
          : error.message;
  }
}

// Apply coupon
const applyCoupon = async (couponCode) => {
  try {
      const response = await axios.post(`${base_url}user/cart/applycoupon`, { couponCode }, getConfig());
      return response.data;
  } catch (error) {
      throw error.response && error.response.data
          ? error.response.data
          : error.message;
  }
}
const logout = async () => {
  try {
    const response = await axios.get(`${base_url}user/logout`,  getConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const updateUser = async (formData) => {
  try {
    const response = await axios.put(`${base_url}user/edit-user`, formData, getConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

// Gửi email quên mật khẩu
const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${base_url}user/forgot-password-token`, { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Reset mật khẩu
const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.put(`${base_url}user/reset-password/${token}`, {
      password: newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const authService = {
  register,
  login,
  getaWishlist,
  addToCart,
  getCartUser,
  updateCartItemQuantity,
  deleteCartItem,
  emptyCart,
  applyCoupon,
  logout,
  updateUser,
  forgotPassword,
  resetPassword
};
