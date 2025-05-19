import React, { useEffect, useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import BlogCard from "../components/BlogCard";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlog } from "../features/blogs/blogSlice";
import moment from "moment";

const Blog = () => {
  const dispatch = useDispatch();
  const blogstate = useSelector((state) => state?.blog?.blog);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  useEffect(() => {
    dispatch(getAllBlog());
  }, [dispatch]);

  // Lấy danh sách danh mục duy nhất từ blogstate
  const categories = [
    "Tất cả",
    ...new Set(blogstate?.map((item) => item.category))
  ];

  // Lọc blog theo category được chọn
  const filteredBlogs =
    selectedCategory === "Tất cả"
      ? blogstate
      : blogstate?.filter((item) => item.category === selectedCategory);

  return (
    <>
      <Meta title={"Các bài viết"} />
      <BreadCrumb title="Các bài viết" />
      <Container class1="blog-wapper home-wapper-2 py-5">
        <div className="row">
          <div className="col-3">
            <div className="filter-card mb-3">
              <h3 className="filter-title">Danh mục bài viết</h3>
              <div>
                <ul className="ps-0 mb-0">
                  {categories.map((cat, index) => (
                    <li
                      key={index}
                      style={{
                        cursor: "pointer",
                        fontWeight: cat === selectedCategory ? "bold" : "normal",
                        color: cat === selectedCategory ? "#000" : "inherit",
                      }}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-9">
            <div className="row">
              {filteredBlogs?.map((item, index) => {
                return (
                  <BlogCard
                    key={index}
                    id={item?._id}
                    title={item?.title}
                    description={item?.description}
                    image={item?.images[0]?.url}
                    date={moment(item?.createdAt).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
                  />
                );
              })}
              {filteredBlogs?.length === 0 && (
                <p>Không có bài viết nào thuộc danh mục này.</p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Blog;
