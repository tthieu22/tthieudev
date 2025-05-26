import React, { useEffect } from "react";
import CustomInput from "../components/CustomInput";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const userSchema = Yup.object({
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập Email"),
  password: Yup.string().required("Vui lòng nhập mật khẩu"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  ); 
  
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: userSchema,
    onSubmit: (values, { resetForm }) => {
      dispatch(login(values)).unwrap()
        .then(() => {
          resetForm();
        })
        .catch(() => { 
        });
    },
  });

  useEffect(() => {
    if (isSuccess && user) {
      toast.success("Đăng nhập thành công!");
      navigate("/admin");
    } else if (isError) { 
      const errorMsg =
        typeof message === "string"
          ? message
          : message?.message || "Vui lòng kiểm tra lại";
      toast.error("Đăng nhập thất bại! " + errorMsg);
    }
  }, [isSuccess, isError, user, message, navigate]);

  return (
    <div
      className="login-wrapper d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", background: "#f7f7f7" }}
    >
      <div className="login-box shadow p-5 bg-white rounded-4" style={{ maxWidth: 400, width: "100%" }}>
        <h3 className="text-center mb-3 fw-bold">Chào mừng Admin!</h3>
        <p className="text-center text-muted mb-4">
          Vui lòng đăng nhập để tiếp tục
        </p>
        <form onSubmit={formik.handleSubmit} autoComplete="off" noValidate>
          <CustomInput
            name="email"
            type="email"
            label="Email"
            id="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Nhập email của bạn"
            isInvalid={formik.touched.email && formik.errors.email}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-danger small mb-3">{formik.errors.email}</div>
          )}

          <CustomInput
            name="password"
            type="password"
            label="Mật khẩu"
            id="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Nhập mật khẩu"
            isInvalid={formik.touched.password && formik.errors.password}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="text-danger small mb-3">{formik.errors.password}</div>
          )}

          <button
            className="btn btn-primary w-100 fw-bold mt-3 d-flex justify-content-center align-items-center"
            type="submit"
            disabled={isLoading}
          >
            {isLoading && (
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
            )}
            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>
        <div className="d-flex justify-content-between mt-3">
          <Link to="/forgot-password" className="small text-decoration-none">
            Quên mật khẩu?
          </Link>
          {/* <Link to="/register" className="small text-decoration-none">
            Đăng ký
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
