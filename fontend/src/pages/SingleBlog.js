import React, { useEffect } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { Link, useLocation } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { getBlog } from "../features/blogs/blogSlice";
import moment from "moment";
import defaultImages from "../images/main-banner-1.jpg";

const SingleBlog = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const getBlogId = location.pathname.split("/")[2];
  const blogtate = useSelector((state) => state?.blog?.singleblog);

  useEffect(() => {
    if (getBlogId) {
      dispatch(getBlog(getBlogId));
    }
  }, [dispatch, getBlogId]);

  return (
    <>
      <Meta title={blogtate?.title}></Meta>
      <BreadCrumb title={blogtate?.title} />
      <Container class1="blog-wapper home-wapper-2 py-5">
        <div className="row">
          <div className="col-12">
            <div className="single-blog-card">
              <Link to="/blogs" className="d-flex align-items-center gap-10">
                <IoArrowBackOutline />
                Go back to blogs
              </Link>
              <h3 className="title text-center">{blogtate?.title}</h3>
              <p className="text-center">
                {moment(blogtate?.created_at).format("MMMM Do YYYY, h:mm:ss a")}
              </p>
              <div className="box-img">
                <img 
                  src={
                    blogtate?.images[0]?.url
                      ? blogtate?.images[0]?.url
                      : defaultImages
                  }
                  alt="blog"
                  className="w-100 pb-3 image-primary-blog"
                />
              </div>
              <p
                dangerouslySetInnerHTML={{
                  __html: blogtate?.description,
                }}
              ></p>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default SingleBlog;
