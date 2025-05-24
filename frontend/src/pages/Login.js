import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import CustomInput from "../components/CustomInput";
import * as yup from "yup";
import { useFormik } from "formik";
import { loginUser } from "../features/user/userSlice";

const signupschema = yup.object({
  email: yup
    .string()
    .nullable()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  password: yup.string().required("Vui lòng nhập mật khẩu"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userState = useSelector((state) => state?.auth) || {};
  const { isSuccess, loginuser, isLoading } = userState;

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: signupschema,
    onSubmit: (values) => {
      dispatch(loginUser(values));
    },
  });

  useEffect(() => {
    if (isSuccess && loginuser) {
      navigate("/");
    }
  }, [isSuccess, loginuser, navigate]);

  return (
    <>
      <Meta title={"Đăng nhập"} />
      <BreadCrumb title="Đăng nhập" />
      <Container class1="login-wrapper home-wrapper-2 p-5">
        <div className="row p-5" style={{ minHeight: "70vh" }}>
          <div className="col-12">
            <div className="forgot-card p-4 shadow rounded-3 bg-white">
              <h4 className="text-center mb-4 fw-bold">Đăng nhập</h4>
              <div className="row">
                {/* Cột trái - Form đăng nhập */}
                <div className="col-md-6 border-end pe-md-4 mb-4 mb-md-0">
                  <form
                    className="d-flex flex-column"
                    onSubmit={formik.handleSubmit}
                    style={{ padding: "50px 0" }}
                  >
                    <CustomInput
                      type="email"
                      name="email"
                      placeholder="Email"
                      classname="input-control w-100 mb-3 "
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                    />
                    <div className="error">
                      {formik.touched.email && formik.errors.email}
                    </div>

                    <CustomInput
                      type="password"
                      name="password"
                      placeholder="Mật khẩu"
                      classname="input-control w-100"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                    />
                    <div className="error">
                      {formik.touched.password && formik.errors.password}
                    </div>

                    <div className="w-100">
                      
                      <Link
                        to="/forgot-password"
                        className="text-center text-black-50 mt-1 mx-1 text-underline"
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>
                    <div className="d-flex justify-content-center gap-15 align-items-center mt-2">
                      <button
                        className="button text-white mt-3 fs-6"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Cột phải - Nội dung chào mừng */}
                <div className="col-md-6 px-md-4">
                  <div className="d-flex align-items-center justify-content-center h-100 site-logo flex-column">
                    <Link className="text-decoration-none fs-2 fw-bold" to="/">
                      tthieu.dev
                    </Link>
                    <p className="mb-3">Chào mừng bạn trở lại</p>
                    <p className="mb-1 mt-3">Nếu bạn chưa có tài khoản đăng ký ngay!</p>
                    <Link to="/sign-up" className="button text-white fs-6">
                      Đăng ký
                    </Link>
                  </div>
                </div>
              </div>

              {isLoading && (
                <div className="text-center text-secondary mt-4">
                  <span className="spinner-border spinner-border-sm me-2"></span>Đang xử lý...
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Login;
