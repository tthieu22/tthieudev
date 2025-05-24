import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import Container from "../components/Container";
import CustomInput from "../components/CustomInput";
import { resetPassword } from "../features/user/userSlice";

const Resetpassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }

    try {
      await resetPassword(token, password);
      setSuccess("Đặt lại mật khẩu thành công. Bạn sẽ được chuyển hướng...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError("Đã có lỗi xảy ra khi đặt lại mật khẩu.");
    }
  };

  return (
    <>
      <Meta title="Đặt lại mật khẩu" />
      <BreadCrumb title="Đặt lại mật khẩu" />
      <Container class1="login-wrapper home-wrapper-2 p-5">
        <div className="row p-5" style={{ minHeight: "70vh" }}>
          <div className="col-12">
            <div className="forgot-card p-4 shadow rounded-3 bg-white">
              <h4 className="text-center mb-4 fw-bold">Tạo mật khẩu mới</h4>
              <div className="row">
                {/* Form bên trái */}
                <div className="col-md-6 border-end pe-md-4 mb-4 mb-md-0">
                  <form onSubmit={handleSubmit} className="d-flex gap-3 flex-column" style={{ padding: "50px 0" }}>
                    <CustomInput
                      type="password"
                      name="password"
                      placeholder="Mật khẩu mới"
                      classname="input-control w-100"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <CustomInput
                      type="password"
                      name="confirmPassword"
                      placeholder="Xác nhận mật khẩu"
                      classname="input-control w-100"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    {error && <div className="text-danger text-center">{error}</div>}
                    {success && <div className="text-success text-center">{success}</div>}

                    <div className="d-flex justify-content-center gap-15 align-items-center">
                      <button className="button text-white mt-2" type="submit">
                        Xác nhận
                      </button>
                    </div>

                    <Link to="/login" className="text-center text-black-50 mt-3 text-underline">
                      Quay lại trang đăng nhập
                    </Link>
                  </form>
                </div>

                {/* Hướng dẫn bên phải */}
                <div className="col-md-6 px-md-4">
                  <div className="instruction text-start text-secondary fs-6">
                    <p><strong>Lưu ý khi tạo mật khẩu mới:</strong></p>
                    <ul className="ps-3">
                      <li>Mật khẩu nên có ít nhất 8 ký tự.</li>
                      <li>Sử dụng kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt.</li>
                      <li>Không nên trùng với mật khẩu cũ.</li>
                      <li>Giữ bảo mật và không chia sẻ với người khác.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Resetpassword;
