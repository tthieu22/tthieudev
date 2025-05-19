import axios from "axios";
import { base_url, config } from "../../utils/axiosConfig";

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
    const response = await axios.get(`${base_url}user/wish-list`, config);

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
      const response = await axios.get(`${base_url}user/cart`, config);
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
      const response = await axios.post(`${base_url}user/cart`, { productId, quantity, colorId }, config);
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
      const response = await axios.put(`${base_url}user/update-quantity-product`, { productId, quantity, colorId }, config);
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
    console.log(config);
    
      const response = await axios.delete(`${base_url}user/delete-product-cart`, { productId, colorId }, config);
      return response.data;
  } catch (error) {
      throw error.response && error.response.data
          ? error.response.data
          : error.message;
  }
}
// Empty cart
const emptyCart = async () => {
  try {
      const response = await axios.delete(`${base_url}user/empty-cart`, config);
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
      const response = await axios.post(`${base_url}user/cart/applycoupon`, { couponCode }, config);
      return response.data;
  } catch (error) {
      throw error.response && error.response.data
          ? error.response.data
          : error.message;
  }
}
const logout = async () => {
  try {
    const response = await axios.get(`${base_url}user/logout`, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

const updateUser = async (formData) => {
  try {
    const response = await axios.put(`${base_url}user/edit-user`, formData, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}
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
};
