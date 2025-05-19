import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../features/auth/authSlice"; // Import hành động forgotPassword
import CustomInput from "../components/CustomInput";

const Forgotpassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  // Lấy trạng thái từ Redux store
  const { isLoading, isError, message, isSuccess } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      dispatch(forgotPassword(email)); // Gọi action forgotPassword
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
        <h4 className="text-center title">Quên mật khẩu</h4>
        <p className="text-center">Nhập email của bạn để đặt lại mật khẩu</p>
        <form onSubmit={handleSubmit}>
          <CustomInput
            type="email"
            label="Email Address"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Cập nhật email khi thay đổi input
          />
          {isLoading && <p className="text-center text-warning">Đang gửi yêu cầu...</p>}
          {isError && <p className="text-center text-danger">{message}</p>}
          {isSuccess && <p className="text-center text-success">Email đã được gửi thành công!</p>}

          <button
            className="border-0 px-3 py-2 w-100 mt-4"
            style={{ background: "#ffd333" }}
            type="submit"
          >
            Gửi liên kết
          </button>
        </form>
      </div>
    </div>
  );
};

export default Forgotpassword;
