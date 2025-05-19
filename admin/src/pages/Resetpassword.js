import React, { useState } from "react";
import CustomInput from "../components/CustomInput";
import { useParams, useNavigate } from "react-router-dom";  // Use useNavigate instead of useHistory
import authService from "../features/auth/authService";

const Resetpassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();  // Replacing useHistory with useNavigate
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }

    try {
      await authService.resetPassword(token, password);  
      alert("Mật khẩu đã được thay đổi thành công!");
      navigate("/"); 
    } catch (err) {
      setError("Đã có lỗi xảy ra khi reset mật khẩu.");
      console.error(err);
    }
  };

  return (
    <div
      className="d-flex align-items-center"
      style={{
        background: "rgb(200, 200, 200)",
        minHeight: "100vh",
      }}
    >
      <div
        className="my-5 w-25 bg-white rounded-3 p-3 mx-auto"
        style={{ margin: "-20% 0 0 0" }}
      >
        <h4 className="text-center title">Đặt lại mật khẩu</h4>
        <p className="text-center">Nhập mật khẩu mới của bạn</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <CustomInput
            type="password"
            label="Mật khẩu mới"
            id="pass"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <CustomInput
            type="password"
            label="Xác nhận mật khẩu"
            id="confirmpass"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            className="border-0 px-3 py-2 w-100 mt-3 "
            style={{ background: "#ffd333" }}
            type="submit"
          >
            Đặt lại mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default Resetpassword;
