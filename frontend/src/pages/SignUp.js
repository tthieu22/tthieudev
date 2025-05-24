import React from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import Container from "../components/Container";
import CustomInput from "../components/CustomInput";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { registerUser } from "../features/user/userSlice";
import { Link } from "react-router-dom";

// Validation schema with confirmPassword
const signupschema = yup.object({
  firstname: yup.string().required("Firstname is required"),
  lastname: yup.string().required("Lastname is required"),
  email: yup
    .string()
    .nullable()
    .email("Email should be valid")
    .required("Email is required"),
  mobile: yup.string().required("Mobile number is required"),
  password: yup.string().required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

const SignUp = () => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: signupschema,
    onSubmit: (values) => {
      const { confirmPassword, ...submitValues } = values;
      dispatch(registerUser(submitValues));
    },
  });

  return (
    <>
      <Meta title={"Sign Up"} />
      <BreadCrumb title="Sign Up" />
      <Container class1="login-wrapper home-wrapper-2 p-5" >
        <div className="row p-5"  style={{ minHeight: "100vh" }}>
          <div className="col-12">
            <div className="auth-card">
              <h3 className="text-center mb-5" style={ {color: "black"}}>Đăng ký tài khoản mới</h3>
              <form
                className="d-flex flex-column gap-10"
                onSubmit={formik.handleSubmit}
              >
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <CustomInput
                      type="text"
                      name="firstname"
                      placeholder="Tên"
                      classname="input-control w-100"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.firstname}
                    />
                    <div className="error">
                      {formik.touched.firstname && formik.errors.firstname}
                    </div>
                  </div>

                  <div className="col-md-6 mb-2">
                    <CustomInput
                      type="text"
                      name="lastname"
                      placeholder="Họ"
                      classname="input-control w-100"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.lastname}
                    />
                    <div className="error">
                      {formik.touched.lastname && formik.errors.lastname}
                    </div>
                  </div>
                </div>

                <div className="mb-2">
                  <CustomInput
                    type="email"
                    name="email"
                    placeholder="Email"
                    classname="input-control w-100"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                  />
                  <div className="error">
                    {formik.touched.email && formik.errors.email}
                  </div>
                </div>

                <div className="mb-2">
                  <CustomInput
                    type="text"
                    name="mobile"
                    placeholder="Số điện thoại"
                    classname="input-control w-100"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.mobile}
                  />
                  <div className="error">
                    {formik.touched.mobile && formik.errors.mobile}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-2">
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
                  </div>

                  <div className="col-md-6 mb-2">
                    <CustomInput
                      type="password"
                      name="confirmPassword"
                      placeholder="Nhập lại mật khẩu"
                      classname="input-control w-100"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.confirmPassword}
                    />
                    <div className="error">
                      {formik.touched.confirmPassword && formik.errors.confirmPassword}
                    </div>
                  </div>
                </div>

                <div className="d-flex mt-3 justify-content-center">
                  <button className="button border-0 px-4 py-2 fs-6" type="submit">
                    Đăng ký
                  </button>
                </div>

                <Link to="/login" className="text-center text-black-50 mt-2 text-underline">
                  Quay lại trang đăng nhập
                </Link>
              </form>

            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default SignUp;
