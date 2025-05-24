import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FloatingIcons from "./FloatingIcons"; 

const Layout = () => { 
  const [loading, setLoading] = useState(true); 


  useEffect(() => {  
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);
  const ScrollToTop = () => {
    const { pathname } = useLocation();
  
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pathname]);
  
    return null;
  };
  
  return (
    <div>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">tthieu.dev</div>
        </div>
      )}
      <ScrollToTop />
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
