import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { BsSearch, BsBarChart, BsHeart, BsPerson, BsCart } from "react-icons/bs";

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const userInfo = JSON.parse(localStorage.getItem("customer"));
        if (userInfo) {
          setUser(userInfo);
        }
      }
    } catch (error) {
      console.error("Error fetching user info from localStorage:", error);
      setUser(null);
    }
  }, []);

  return (
    <>
      {/* Header Fixed */}
      <div className="position-fixed top-0 start-0 end-0 bg-white shadow-sm z-3" style={{ zIndex: 1030 }}>
        {/* Main Header */}
        <header className="py-3 border-bottom">
          <div className="container-xxl">
            <div className="row align-items-center">
              <div className="col-6 col-md-2">
                <h2 className="mb-0 site-logo">
                  <Link className="text-decoration-none" to="/">
                    tthieu.dev
                  </Link>
                </h2>
              </div>

              <div className="col-12 col-md-5">
                <div className="input-group custom-search">
                  <input
                    type="text"
                    className="form-control search-input"
                    placeholder="Tìm kiếm sản phẩm ... "
                    aria-label="Tìm kiếm sản phẩm ..."
                  />
                  <span className="input-group-text search-icon">
                    <BsSearch />
                  </span>
                </div>
              </div>

              <div className="col-12 col-md-5">
                <div className="d-flex align-items-center justify-content-end gap-30">
                  <Link to="/compare-product" className="d-flex align-items-center gap-2 text-dark text-decoration-none nav-item-icon">
                    <BsBarChart size={20} className="text-dark" />
                    <span className="nav-text">So sánh</span>
                  </Link>
                  <Link to="/wishlist" className="d-flex align-items-center gap-2 text-dark text-decoration-none nav-item-icon">
                    <BsHeart size={20} className="text-danger" />
                    <span className="nav-text">Yêu thích</span>
                  </Link>
                  {user ? (
                    <Link to="/account" className="d-flex align-items-center gap-2 text-dark text-decoration-none nav-item-icon">
                      <BsPerson size={20} className="text-dark" />
                      <span className="nav-text">{user.firstname} {user.lastname}</span>
                    </Link>
                  ) : (
                    <Link to="/login" className="d-flex align-items-center gap-2 text-dark text-decoration-none nav-item-icon">
                      <BsPerson size={20} className="text-dark" />
                      <span className="nav-text">Đăng nhập / Đăng ký</span>
                    </Link>
                  )}
                  <Link to="/cart" className="d-flex align-items-center gap-2 text-dark text-decoration-none nav-item-icon">
                    <BsCart size={20} className="text-success" />
                    <span className="nav-text">Giỏ hàng</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Bottom Menu */}
        <div className="bg-white">
          <div className="container-xxl">
            <div className="row">
              <div className="col-12 d-flex align-items-center">
                <div className="d-flex gap-10">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `no-padding-left text-decoration-none nav-link ${isActive ? "text-dark fw-bold" : "text-dark"}`
                    }
                  >
                    Trang chủ
                  </NavLink>
                  <NavLink
                    to="/store"
                    className={({ isActive }) =>
                      `text-decoration-none nav-link ${isActive ? "text-dark fw-bold" : "text-dark"}`
                    }
                  >
                    Cửa hàng
                  </NavLink>
                  <NavLink
                    to="/blogs"
                    className={({ isActive }) =>
                      `text-decoration-none nav-link ${isActive ? "text-dark fw-bold" : "text-dark"}`
                    }
                  >
                    Blog
                  </NavLink>
                  <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                      `text-decoration-none nav-link ${isActive ? "text-dark fw-bold" : "text-dark"}`
                    }
                  >
                    Liên hệ
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Padding for fixed header */}
      <div style={{ paddingTop: "120px" }}></div>
    </>
  );
};

export default Header;
