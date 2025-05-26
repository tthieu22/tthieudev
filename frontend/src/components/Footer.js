import React from "react";
import { Link } from "react-router-dom";
import {
  BsLinkedin,
  BsGithub,
  BsYoutube,
  BsInstagram,
  BsTwitter,
  BsGeoAlt,
  BsTelephone,
  BsEnvelope,
} from "react-icons/bs";
import { HiOutlineMail } from "react-icons/hi";

const Footer = () => {
  return (
    <>
      {/* Section: Newsletter */}
      <footer className="py-3 bg-light border-top">
        <div className="container-xxl">
          <div className="row align-items-center content-footer-top">
            <div className=" col-12 col-md-5 col-lg-5 col-xl-5 col-xxl-5">
              <div className="footer-top-data d-flex gap-3 align-items-center">
                <HiOutlineMail className="fs-1 text-primary text-dark" />
                <h2 className="mb-0 text-dark">Sign Up for Newsletter</h2>
              </div>
            </div>
            <div className="col-12 col-md-7 col-lg-7 col-xl-7 col-xxl-7">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control py-1"
                  placeholder="Your Email Address"
                  aria-label="Your Email Address"
                  aria-describedby="basic-addon2"
                />
                <span className="input-group-text p-2 text-white" id="basic-addon2">
                  Subscribe
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Section: Footer Main */}
      <footer className="py-4 bg-white border-top">
        <div className="container-xxl">
          <div className="row row-content">
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 col-xxl-3">
              <h4 className="text-dark mb-4">Contact Us</h4>
              <p className="text-dark fs-6 mb-1">
                <BsGeoAlt className="me-2" />
                Hno: z115 near Brigd z115, Quyet Thang, Thai Nguyen
              </p>
              <p className="text-dark fs-6 mb-1">
                <BsTelephone className="me-2" />
                <a href="tel:+84 563650708" className="text-dark">+84 563650708</a>
              </p>
              <p className="text-dark fs-6 mb-3">
                <BsEnvelope className="me-2" />
                <a href="mailto:tthieu.dev.02@gmail.com" className="text-dark">tthieu.dev.02@gmail.com</a>
              </p>
              <div className="social-icons d-flex gap-3">
                <Link className="text-dark" to="/"><BsTwitter className="fs-4" /></Link>
                <Link className="text-dark" to="/"><BsLinkedin className="fs-4" /></Link>
                <Link className="text-dark" to="/"><BsGithub className="fs-4" /></Link>
                <Link className="text-dark" to="/"><BsYoutube className="fs-4" /></Link>
                <Link className="text-dark" to="/"><BsInstagram className="fs-4" /></Link>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
              <h4 className="text-dark mb-4">Information</h4>
              <div className="footer-links d-flex flex-column">
                <Link to="/privacy-policy" className="text-dark mb-1">Privacy Policy</Link>
                <Link to="/refund-policy" className="text-dark mb-1">Refund Policy</Link>
                <Link to="/shipping-policy" className="text-dark mb-1">Shipping Policy</Link>
                <Link to="/term-and-contions" className="text-dark mb-1">Terms of Service</Link>
                <Link to="/blogs" className="text-dark mb-1">Blogs</Link>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
              <h4 className="text-dark mb-4">Account</h4>
              <div className="footer-links d-flex flex-column">
                <Link className="text-dark mb-1" to="#">Search</Link>
                <Link className="text-dark mb-1" to="#">About Us</Link>
                <Link className="text-dark mb-1" to="#">FAQ</Link>
                <Link className="text-dark mb-1" to="#">Contact</Link>
                <Link className="text-dark mb-1" to="#">Size Chart</Link>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-2 col-lg-3 col-xl-3 col-xxl-3">
              <h4 className="text-dark mb-4">Quick Links</h4>
              <div className="footer-links d-flex flex-column">
                <Link className="text-dark mb-1" to="#">Accessories</Link>
                <Link className="text-dark mb-1" to="#">Laptops</Link>
                <Link className="text-dark mb-1" to="#">Headphones</Link>
                <Link className="text-dark mb-1" to="#">Tablets</Link>
                <Link className="text-dark mb-1" to="#">Smart Watches</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Section: Copyright */}
      <footer className="py-2 bg-light border-top">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <p className="text-center mb-0 text-dark">
                &copy; {new Date().getFullYear()} Powered by <strong>tthieu.dev.02</strong>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
