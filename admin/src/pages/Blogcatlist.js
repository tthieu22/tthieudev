import React, { useEffect, useState, useMemo } from "react";
import { Table, Input, Row, Col, Button } from "antd";
import { Link } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getBlogCategorys,
  deleteBlogCategory,
} from "../features/blogcategory/blogcategoryClice";
import CustomModal from "../components/CustomModal";
import { toast } from "react-toastify";

const BlogCatList = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [blogCatId, setBlogCatId] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [isLoaded, setIsLoaded] = useState(false); // kiểm soát load lần đầu

  const showModal = (id) => {
    setOpen(true);
    setBlogCatId(id);
  };
  const hideModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(getBlogCategorys());
  }, [dispatch]);

  const blogcatstate = useSelector(
    (state) => state.blogcategory.blogcategories || []
  );

  const { isSuccess, isError } = useSelector(
    (state) => state.blogcategory
  );

  // Hiện thông báo khi load dữ liệu thành công lần đầu
  useEffect(() => {
    if (isSuccess && !isLoaded) {
      toast.success("Load danh mục bài viết thành công!");
      setIsLoaded(true);
    }
    if (isError) {
      toast.error("Load danh mục bài viết thất bại!");
    }
  }, [isSuccess, isError, isLoaded]);

  // Bộ lọc tìm kiếm theo tiêu đề
  const filteredData = useMemo(() => {
    return blogcatstate
      .filter((cat) =>
        cat.title.toLowerCase().includes(searchTitle.toLowerCase().trim())
      )
      .map((cat, index) => ({
        key: cat._id,
        index: index + 1,
        title: cat.title,
        action: (
          <div className="d-flex gap-3">
            <Link to={`/admin/blog-category/${cat._id}`} className="text-dark">
              <FaEdit className="fs-4" />
            </Link>
            <button
              className="text-dark border-0 bg-transparent"
              onClick={() => showModal(cat._id)}
            >
              <MdDeleteForever className="fs-4" />
            </button>
          </div>
        ),
      }));
  }, [blogcatstate, searchTitle]);

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      sorter: (a, b) => a.index - b.index,
      width: 80,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Hành động",
      dataIndex: "action",
      width: 120,
    },
  ];

  const handleDeleteBlogCategory = (id) => {
    setOpen(false);
    dispatch(deleteBlogCategory(id))
      .unwrap()
      .then(() => {
        toast.success("Xoá danh mục bài viết thành công!");
        dispatch(getBlogCategorys());
      })
      .catch(() => {
        toast.error("Xoá danh mục bài viết thất bại!");
      });
  };

  return (
    <div style={{ padding: 24, backgroundColor: "#fff", borderRadius: 8 }}>
      <h3 className="mb-4 title" style={{ marginBottom: 24 }}>
        Quản lý danh mục bài viết
      </h3>

      {/* Filter tìm kiếm */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={16} md={12} lg={8}>
          <Input
            placeholder="Tìm kiếm theo tiêu đề danh mục"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={24} sm={8} md={6} lg={4}>
          <Button
            onClick={() => setSearchTitle("")}
            style={{ width: "100%" }}
            type="default"
          >
            Reset bộ lọc
          </Button>
        </Col>
      </Row>

      {/* Bảng danh sách */}
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 8 }}
        rowKey="key"
        bordered
        scroll={{ x: "max-content" }}
      />

      {/* Modal xác nhận xóa */}
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => handleDeleteBlogCategory(blogCatId)}
        title="Bạn có chắc chắn muốn xóa danh mục bài viết này không?"
        btnTitle="Xóa danh mục"
        performActionBtn="Xóa"
      />
    </div>
  );
};

export default BlogCatList;
