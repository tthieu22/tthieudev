import React, { useEffect ,useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FloatingIcons from "./FloatingIcons";
import { isTokenExpired } from "../utils/checkTokenExpired";

const Layout = () => {
  const navigate = useNavigate();
  const notifiedRef = useRef(false);
  const location = useLocation();

  useEffect(() => {
    if (notifiedRef.current) return;

    const token = localStorage.getItem("token");

    if (token && isTokenExpired(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("customer");
      toast.error("Phiên đăng nhập đã hết hạn. Nhấn vào đây để đăng nhập lại.", {
        onClick: () => {
          navigate("/login");
        },
        autoClose: false,
      });
      notifiedRef.current = true;
    } else if (!token) {
      if (location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/store" && location.pathname !== "/sign-up" && location.pathname !== "/forgot-password" && location.pathname !== "/compare-product" && location.pathname !== "/blogs") {
        toast.error("Bạn cần đăng nhập để sử dụng tính năng này.", {
          onClick: () => {
            navigate("/login");
          },
          autoClose: false,
        });
        notifiedRef.current = true;
      }
      
    }
  }, [location, navigate]);
  
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
      <FloatingIcons />
      <ToastContainer
        position="top-right"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Layout;
