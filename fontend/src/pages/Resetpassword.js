import React from "react";

import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import Container from "../components/Container";
import CustomInput from "../components/CustomInput";
// import { Link } from "react-router-dom";
const Resetpassword = () => {
  return (
    <div>
      <Meta title={"Reset Password"}></Meta>
      <BreadCrumb title="Reset Password" />
      <Container class1="login-wrapper home-wapper-2 p-5">
        <div className="row p-5">
          <div className="col-12">
            <div className="auth-card">
              <h3 className="text-center mb-3">Đặt lại mật khẩu</h3>
              <form action="" className="d-flex gap-15 flex-column">
                <CustomInput
                  type="password"
                  name="password"
                  placeholder="Password"
                  classname="input-control w-100"
                />
                <CustomInput
                  type="password"
                  name="confpassword"
                  placeholder="Confirm Password"
                  classname="input-control w-100"
                />
                <div className="d-flex mt-3 justify-content-center gap-15 align-items-center">
                  <button className="button border-0" type="submit">
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Resetpassword;
