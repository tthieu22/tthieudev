import React, { useEffect } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { FaHome } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { IoMdMail, IoIosInformationCircle } from "react-icons/io";
import Container from "../components/Container";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createEnquiry } from "../features/enquirry/enquirySlice";

let schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  mobile: Yup.string().required("Mobile is required"),
  comment: Yup.string().required("Comment is required"),
});

const Contact = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const customer = localStorage.getItem("customer")
    ? JSON.parse(localStorage.getItem("customer"))
    : null;
 
  const { isCreateEnquiry, isError, message } = useSelector(
    (state) => state.enquiry
  );
 
  useEffect(() => {
    if (isCreateEnquiry) {
      toast.success("Gửi phản hồi thành công."); 
    }
  }, [isCreateEnquiry]);
 
  useEffect(() => {
    if (isError && message) {
      toast.error(message);
    }
  }, [isError, message]);

  const formik = useFormik({
    initialValues: {
      name: customer ? `${customer.firstname} ${customer.lastname}` : "",
      email: customer ? customer.email : "",
      mobile: customer ? customer.mobile : "",
      comment: "",
    },
    validationSchema: schema,
    onSubmit: ({ name, email, mobile, comment }) => {
      if (!customer) {
        toast.error("Vui lòng đăng nhập để gửi phản hồi.", {
          onClick: () => navigate("/login"),
          autoClose: false,
        });
        return;
      }
      dispatch(createEnquiry({ name, email, mobile, comment }));
    },
  });

  return (
    <>
      <Meta title={"Liên hệ"} />
      <BreadCrumb title="Liên hệ" />
      <Container class1="contact-wrapper py-5 home-wapper-2">
        <div className="row">
          <div className="col-12">
            <iframe
              title="Google Maps Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3733.724879617183!2d106.11844501111632!3d20.640067980834164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135c1c4e38c8e77%3A0xe83eeccec26978d1!2zU-G6o24geHXDosyBdCBjaMO0zIlpIER1bmcgRHXMg25n!5e0!3m2!1sen!2s!4v1720867569878!5m2!1sen!2s"
              width="600"
              height="450"
              className="border-0 w-100"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="row mt-5 ">
            <div className="contact-inner-wapper d-flex justify-content-between ">
              <div className="col-6 left">
                <h3 className="contact-title mb-4">Gửi phản hồi cho chúng tôi</h3>
                <form
                  className="d-flex flex-column gap-20"
                  onSubmit={formik.handleSubmit}
                >
                  <div>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Name"
                      onChange={formik.handleChange}
                      value={formik.values.name}
                      readOnly={!!customer}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <div className="error">{formik.errors.name}</div>
                    ) : null}
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Email"
                      onChange={formik.handleChange}
                      value={formik.values.email}
                      readOnly={!!customer}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="error">{formik.errors.email}</div>
                    ) : null}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="mobile"
                      className="form-control"
                      placeholder="Mobile"
                      onChange={formik.handleChange}
                      value={formik.values.mobile}
                      readOnly={!!customer}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.mobile && formik.errors.mobile ? (
                      <div className="error">{formik.errors.mobile}</div>
                    ) : null}
                  </div>
                  <div>
                    <textarea
                      cols={30}
                      rows={4}
                      className="form-control"
                      placeholder="Comment"
                      name="comment"
                      onChange={formik.handleChange}
                      value={formik.values.comment}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.comment && formik.errors.comment ? (
                      <div className="error">{formik.errors.comment}</div>
                    ) : null}
                  </div>
                  <button type="submit" className="button w-25">
                    Submit
                  </button>
                </form>
              </div>
              <div className="col-6 right">
                <h3 className="contact-title mb-4">Liên hệ với chúng tôi</h3>
                <ul className="ps-0">
                  <li className="mb-3 d-flex align-baseline gap-15">
                    <FaHome className="fs-5" />
                    <address className="m-0">
                      Đ/c: Hưng Hà, Thái Bình, Việt Nam
                    </address>
                  </li>
                  <li className="mb-3 d-flex align-baseline gap-15">
                    <IoCall className="fs-5" />
                    <a href="tel:+84 563650708">+84 563650708</a>
                  </li>
                  <li className="mb-3 d-flex align-baseline gap-15">
                    <IoMdMail className="fs-5" />
                    <a href="mailto:tthieudev.02@gmail.com">
                      tthieudev.02@gmail.com
                    </a>
                  </li>
                  <li className="mb-3 d-flex align-baseline gap-15">
                    <IoIosInformationCircle className="fs-5" />
                    <p>Thứ 2 - 6 | 8AM - 8PM</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Contact;
