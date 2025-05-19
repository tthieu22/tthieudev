import React from "react";
import { Link, useLocation } from "react-router-dom";
const BlogCard = (props) => {
  const { pathname } = useLocation();
  const columnClasses = `${pathname === "/blogs" ? "col-6" : "col-3"} `;
  const { id, title, description, date, image } = props;
  return (
    <div className={columnClasses}>
      <div className="blog-card mb-3" key={id}>
        <div className="card-image w-100">
          <img src={image} className="img-fluid" alt="blog1" />
        </div>
        <div className="blog-content">
          <p className="date">{date}</p>
          <h5 className="title">{title}</h5>
          <p
            className="desc"
            dangerouslySetInnerHTML={{
              __html: description.substr(0, 70) + "...",
            }}
          ></p>
          <Link to={`/blog/${id}`} className="button">
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
