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
import { toast } from "react-toastify";

const signupschema = yup.object({
  email: yup
    .string()
    .nullable()
    .email("Email should be valid")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
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
      toast.success("Login successfully");
      navigate("/");
    }
  }, [isSuccess, loginuser, navigate]);

  return (
    <>
      <Meta title={"Login"} />
      <BreadCrumb title="Login" />
      <Container class1="login-wrapper home-wapper-2 py-5">
        <div className="row">
          <div className="col-12">
            <div className="auth-card">
              <h3 className="text-center mb-3">Login</h3>
              <form
                className="d-flex gap-10 flex-column"
                onSubmit={formik.handleSubmit}
              >
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

                <CustomInput
                  type="password"
                  placeholder="Password"
                  name="password"
                  classname="input-control w-100"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                <div className="error">
                  {formik.touched.password && formik.errors.password}
                </div>

                <div>
                  <Link to="/forgot-password" className="px-2 forgot">
                    Forgot Password?
                  </Link>
                </div>

                <div className="d-flex mt-3 justify-content-center gap-15 align-items-center">
                  <button className="button border-0" type="submit" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Login"}
                  </button>
                  <Link to="/sign-up" className="button border-0">
                    Sign Up
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Login;
