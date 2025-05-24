import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../features/user/userSlice";
import { toast } from "react-toastify";

import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { useNavigate } from "react-router-dom";
import {logout} from "../features/user/userSlice";
const AccountPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getUserFromLocalStorage = () => {
    const data = localStorage.getItem("customer");
    return data ? JSON.parse(data) : null;
  };

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
  });

  useEffect(() => {
    const user = getUserFromLocalStorage();
    if (user) {
      setFormData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        mobile: user.mobile || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile(formData))
      .unwrap()
      .then(() => {
        toast.success("Cập nhật thành công!");
        const updatedUser = {
          ...getUserFromLocalStorage(),
          ...formData,
        };
        localStorage.setItem("customer", JSON.stringify(updatedUser));
      })
      .catch(() => toast.error("Có lỗi xảy ra!"));
  };
  const handleLogout = async () => {
    await dispatch(logout());         
    navigate("/");
    window.location.reload();          
  };
  
  return (
    <>
      <Meta title="Thông tin tài khoản" />
      <BreadCrumb title="Thông tin tài khoản" />
      <div className="bg-account">
        <div className="container p-5 bg-white rounded shadow mb-5" style={ { border: "1px solid #ddd" } }>
          <h3 className="text-center mb-4">Thông tin tài khoản</h3>
          <div className="d-flex flex-wrap gap-4 justify-content-center">
            <div className="card-body p-4 border rounded" style={{ maxWidth: 500, flex: "1 1 400px" }}>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Họ</label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    placeholder="Nhập họ"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Tên</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    placeholder="Nhập tên"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                    pattern="[0-9+()-\s]*"
                  />
                </div>

                <div className="d-grid">
                  <button className="btn button" type="submit">
                    Cập nhật thông tin
                  </button>
                </div>
              </form>
            </div>

            <aside className="text-secondary d-flex flex-column align-items-center justify-content-center" style={{ maxWidth: "100%", flex: "1 1 300px" }}>
              <a href="https://www.facebook.com/tt.hieu.22" target="_blank" rel="noopener noreferrer" className="text-dark fw-bold fs-2">
                tthieu.dev
              </a>.
              <p style={{ fontSize: "0.9rem", lineHeight: 1.5, color: "#555", textAlign: "center"  }}>
                Chào mừng bạn đến với trang thông tin tài khoản của mình! Tại đây, bạn có thể xem và cập nhật các thông tin cá nhân, thay đổi mật khẩu, quản lý đơn hàng và theo dõi các hoạt động liên quan đến tài khoản của bạn một cách dễ dàng và bảo mật.&nbsp;
              </p> 
              <div className="d-flex justify-content-center gap-3 mt-4">
                <button
                  className="btn button"
                  onClick={() => navigate("/")}
                >
                  Trang chủ
                </button>
                <button
                  className="btn button"
                  onClick={() => navigate("/orders")}
                >
                  Đơn hàng
                </button>
                
                <button
                  className="btn button"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountPage;
