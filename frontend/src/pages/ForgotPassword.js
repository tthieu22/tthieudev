import React, { useEffect, useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import CustomInput from "../components/CustomInput";
import { forgotPassword } from "../features/user/userSlice"; 
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify"; 

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const { isLoading, isError, message, isSuccess } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message || "Đã xảy ra lỗi!");
    }
    if (isSuccess) {
      toast.success("Email đặt lại mật khẩu đã được gửi!");
    }
  }, [isError, isSuccess, message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      dispatch(forgotPassword(email));
    } else {
      toast.warning("Vui lòng nhập địa chỉ email.");
    }
  };

  return (
    <>
      <Meta title={"Reset Your Password"} />
      <BreadCrumb title="Reset Your Password" />
      <Container class1="login-wrapper home-wrapper-2 p-5">
        <div className="row p-5"  style={{ minHeight: "70vh" }}>
          <div className="col-12">
            <div className="forgot-card p-4 shadow rounded-3 bg-white">
              <h4 className="text-center mb-4 fw-bold">Đặt lại mật khẩu</h4>
              <div className="row">
                {/* Form bên trái */}
                <div className="col-md-6 border-end pe-md-4 mb-4 mb-md-0 ">
                  <form onSubmit={handleSubmit} className="d-flex gap-3 flex-column" style={{padding:"50px 0"}}>
                    <CustomInput
                      type="email"
                      label="Địa chỉ Email"
                      id="email"
                      classname="input-control w-100"
                      value={email}
                      placeholder="Nhập địa chỉ email của bạn"
                      onChange={(e) => setEmail(e.target.value)}
                    /> 
                      
                    <div className="d-flex justify-content-center gap-15 align-items-center">
                      <button className=" button text-white mt-2" type="submit">
                        Gửi
                      </button>
                    </div>
                    <Link to="/login" className="text-center  text-black-50 mt-2 text-underline">
                      Quay lại trang đăng nhập
                    </Link> 
                  </form>
                </div>

                {/* Hướng dẫn bên phải */}
                <div className="col-md-6 px-md-4">
                  <div className="instruction text-start text-secondary fs-6">
                    <p><strong>Hướng dẫn đặt lại mật khẩu:</strong></p>
                    <ul className="ps-3">
                      <li>Nhập địa chỉ email bạn đã dùng để đăng ký tài khoản.</li>
                      <li>Chúng tôi sẽ gửi một email chứa liên kết đặt lại mật khẩu.</li>
                      <li>Nhấp vào liên kết trong email để tạo mật khẩu mới.</li>
                      <li>Kiểm tra mục Spam nếu không thấy email trong Hộp thư đến.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {isLoading && (
                <div className="text-center text-secondary mt-4">
                  <span className="spinner-border spinner-border-sm me-2"></span>Đang gửi yêu cầu...
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ForgotPassword;
