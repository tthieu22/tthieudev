import React, { useEffect, useState } from "react";
import { Table, Input, Row, Col, Select, Form, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { deleteaCategory, getCategories } from "../features/category/categoryClice";
import { Link } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import CustomModal from "../components/CustomModal";

const { Option } = Select;

const Categorylist = () => {
  const [open, setOpen] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filterLetter, setFilterLetter] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const categorystate = useSelector((state) => state.category.categories);

  const showModal = (id) => {
    setOpen(true);
    setCategoryId(id);
  };
  const hideModal = () => setOpen(false);

  const deleteCategory = (id) => {
    setOpen(false);
    dispatch(deleteaCategory(id));
    setTimeout(() => {
      dispatch(getCategories());
    }, 100);
  };

  const filteredData = categorystate
    .filter((item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter((item) =>
      filterLetter ? item.title.toLowerCase().startsWith(filterLetter.toLowerCase()) : true
    );

  const data = filteredData.map((item, index) => ({
    key: index + 1,
    title: item.title,
    action: (
      <div className="d-flex gap-3">
        <Link to={`/admin/category/${item._id}`} className="text-dark">
          <FaEdit className="fs-4" />
        </Link>
        <button
          className="text-dark border-0 bg-transparent"
          onClick={() => showModal(item._id)}
        >
          <MdDeleteForever className="fs-4" />
        </button>
      </div>
    ),
  }));

  const letterOptions = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  const columns = [
    {
      title: "No",
      dataIndex: "key",
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  return (
    <div>
      <h3 className="mb-4 title">Category List</h3>

      {/* Bộ lọc */}
      <Form layout="vertical" className="mb-3">
        <Row gutter={16} align="bottom">
          <Col span={12}>
            <Form.Item label="Search by Name">
              <Input
                placeholder="Enter category name..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Filter by First Letter">
              <Select
                allowClear
                placeholder="Select letter"
                value={filterLetter || undefined}
                onChange={(value) => setFilterLetter(value || "")}
              >
                {letterOptions.map((letter) => (
                  <Option key={letter} value={letter}>
                    {letter}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label=" ">
              <Button
                type="default"
                block
                onClick={() => {
                  setSearchText("");
                  setFilterLetter("");
                }}
              >
                Reset Filters
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {/* Bảng danh mục */}
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />

      {/* Modal xác nhận xóa */}
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => deleteCategory(categoryId)}
        title="Are you sure you want to delete this category?"
      />
    </div>
  );
};

export default Categorylist;
