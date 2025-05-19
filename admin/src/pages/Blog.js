import React, { useEffect, useState, useMemo } from "react";
import { Table, Input, Select, Button, Row, Col, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getBlogs, deleteaBlog } from "../features/blog/blogClice";
import { Link } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import CustomModal from "../components/CustomModal";
import { toast } from "react-toastify";

const { Option } = Select;

const Blog = () => {
  const dispatch = useDispatch();

  const blogstateRaw = useSelector((state) => state.blog.blogs);
  const blogstate = useMemo(() => blogstateRaw || [], [blogstateRaw]);

  const [open, setOpen] = useState(false);
  const [blogId, setBlogId] = useState("");

  // Filter states
  const [searchTitle, setSearchTitle] = useState("");
  const [filteredCategory, setFilteredCategory] = useState("");

  // Lấy danh sách category duy nhất
  const categories = useMemo(() => {
    const uniqueCategories = new Set(blogstate.map((b) => b.category));
    return [...uniqueCategories];
  }, [blogstate]);

  useEffect(() => {
    dispatch(getBlogs());
  }, [dispatch]);

  const showModal = (id) => {
    setOpen(true);
    setBlogId(id);
  };
  const hideModal = () => {
    setOpen(false);
  };

  const handleDeleteBlog = (id) => {
    setOpen(false);
    dispatch(deleteaBlog(id))
      .unwrap()
      .then(() => {
        toast.success("Xoá bài viết thành công!");
        dispatch(getBlogs());
      })
      .catch(() => {
        toast.error("Xoá bài viết thất bại!");
      });
  };

  // Lọc và tìm kiếm dữ liệu hiển thị
  const filteredData = blogstate
    .filter((blog) =>
      blog.title.toLowerCase().includes(searchTitle.toLowerCase().trim())
    )
    .filter((blog) =>
      filteredCategory ? blog.category === filteredCategory : true
    )
    .map((blog, index) => ({
      key: blog._id,
      title: blog.title,
      category: blog.category,
      numViews: blog.numViews,
      author: blog.author,
      action: (
        <Space size="middle">
          <Link to={`/admin/blog/${blog._id}`} className="text-dark">
            <FaEdit className="fs-5" />
          </Link>
          <Button
            type="text"
            danger
            onClick={() => showModal(blog._id)}
            icon={<MdDeleteForever className="fs-5" />}
          />
        </Space>
      ),
      index: index + 1,
    }));

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      width: 70,
      sorter: (a, b) => a.index - b.index,
      defaultSortOrder: "ascend",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: "Lượt xem",
      dataIndex: "numViews",
      sorter: (a, b) => a.numViews - b.numViews,
      width: 100,
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      sorter: (a, b) => a.author.localeCompare(b.author),
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      width: 120,
    },
  ];

  const resetFilters = () => {
    setSearchTitle("");
    setFilteredCategory("");
  };

  return (
    <div style={{ padding: 24, backgroundColor: "#fff", borderRadius: 6 }}>
      <h3 className="mb-4 title" style={{ marginBottom: 24 }}>
        Quản lý bài viết
      </h3>

      {/* Filter bar */}
      <Row
        gutter={[16, 16]}
        align="middle"
        style={{ marginBottom: 24, flexWrap: "wrap" }}
      >
        <Col xs={24} sm={12} md={8} lg={6}>
          <Input.Search
            placeholder="Tìm kiếm theo tiêu đề"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            allowClear
            enterButton
          />
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Select
            placeholder="Lọc theo danh mục"
            value={filteredCategory || undefined}
            onChange={(value) => setFilteredCategory(value)}
            allowClear
            style={{ width: "100%" }}
          >
            {categories.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={24} md={8} lg={6}>
          <Button onClick={resetFilters} block>
            Reset bộ lọc
          </Button>
        </Col>
      </Row>

      {/* Table dữ liệu */}
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 8 }}
        rowKey="key"
        bordered
        scroll={{ x: "max-content" }}
      />

      {/* Modal xóa */}
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => handleDeleteBlog(blogId)}
        title="Bạn có chắc chắn muốn xóa bài viết này không?"
        btnTitle="Xóa bài viết"
        performActionBtn="Xóa bài viết"
      />
    </div>
  );
};

export default Blog;
