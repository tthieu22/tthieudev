import { toast } from "react-toastify";
import { isTokenExpired } from "./checkTokenExpired";

// export const base_url = "http://localhost:5000/api/";
export const base_url = "https://tthieudev.duckdns.org/api/";

export const getConfig = () => {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    toast.info("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", {
      onClick: () => {
        window.location.href = "/login";
      },
    });
    localStorage.removeItem("token");
    localStorage.removeItem("customer");
    return {
      headers: {
        Accept: "application/json",
      },
    };
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };
};

export const getTokenFromLocalStorage = () => {
  try {
    const customer = localStorage.getItem("customer");
    if (customer) {
      const parsedCustomer = JSON.parse(customer);
      return parsedCustomer?.token || null;
    }
    return null;
  } catch (error) {
    console.error("Error parsing token from localStorage:", error);
    return null;
  }
};

export const getUserFromLocalStorage = () => {
  try {
    const customer = localStorage.getItem("customer");
    return customer ? JSON.parse(customer) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (token && !isTokenExpired(token)) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };
  }
  return {
    headers: {
      Accept: "application/json",
    },
  };
};
