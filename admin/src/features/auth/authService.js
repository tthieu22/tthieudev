import axios from "axios";
import { base_url } from "../../utils/base_url";
import { config } from "../../utils/axiosconfig";

const login = async (user) => {
  try {
    const response = await axios.post(`${base_url}user/admin-login`, user);
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const getOrders = async () => {
  try {
    const response = await axios.get(
      `${base_url}user/order/get-all-order`,
      config
    );
    // console.log("Fetched orders:", response.data); // Kiểm tra dữ liệu
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error.response?.data || error;
  }
};

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
const register = async (user) => {
  try {
    const response = await axios.post(`${base_url}user/register`, user);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}
const updateUser = async (values) => {
  try {
    const response = await axios.put(`${base_url}user/edit-user`, values, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}
const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${base_url}user/${id}`, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
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
const getUsers = async () => {
  try {
    const response = await axios.get(`${base_url}user/all-users`, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}
const getSingleUser = async (id) => {
  try {
    const response = await axios.get(`${base_url}user/${id}`, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}
const refreshToken = async () => {
  try {
    const response = await axios.get(`${base_url}user/refresh`, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}
const authService = {
  login,
  getOrders,
  forgotPassword,
  resetPassword,
  register,
  updateUser,
  deleteUser,
  logout,
  getUsers,
  getSingleUser,
  refreshToken
};

export default authService;
