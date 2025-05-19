import React, { useEffect, useState } from "react";
import { Table, Input, Select, Form, Row, Col, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { deleteaBrand, getBrands } from "../features/brand/brandClice";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import CustomModal from "../components/CustomModal";

const { Option } = Select;

const Brandlist = () => {
  const [open, setOpen] = useState(false);
  const [brandId, setBrandId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filterLetter, setFilterLetter] = useState("");

  const dispatch = useDispatch();
  const brandstate = useSelector((state) => state.brand.brands);

  useEffect(() => {
    dispatch(getBrands());
  }, [dispatch]);

  const showModal = (id) => {
    setOpen(true);
    setBrandId(id);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const deleteBrand = (id) => {
    setOpen(false);
    dispatch(deleteaBrand(id));
    setTimeout(() => {
      dispatch(getBrands());
    }, 300);
  };

  // Lọc và tìm kiếm thương hiệu
  const filteredBrands = brandstate
    .filter((brand) =>
      brand.title.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter((brand) =>
      filterLetter ? brand.title[0].toLowerCase() === filterLetter.toLowerCase() : true
    );

  const data = filteredBrands.map((brand, index) => ({
    key: index + 1,
    title: brand.title,
    action: (
      <div className="d-flex gap-3">
        <Link to={`/admin/brand/${brand._id}`} className="text-dark">
          <FaEdit className="fs-4" />
        </Link>
        <button
          className="text-dark border-0 bg-transparent"
          onClick={() => showModal(brand._id)}
        >
          <MdDeleteForever className="fs-4" />
        </button>
      </div>
    ),
  }));

  const columns = [
    {
      title: "No",
      dataIndex: "key",
      width: "10%",
    },
    {
      title: "Title",
      dataIndex: "title",
      width: "60%",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "30%",
    },
  ];

  // Tạo danh sách chữ cái đầu để lọc
  const letterOptions = Array.from(
    new Set(brandstate.map((b) => b.title[0]?.toUpperCase()))
  ).sort();

  return (
    <div>
      <h3 className="mb-4 title">Brand List</h3>

      {/* Form Tìm kiếm và Lọc */}
      <Form layout="vertical" className="mb-3">
      <Row gutter={16} align="bottom">
        <Col span={12}>
          <Form.Item label="Search by Name">
            <Input
              placeholder="Enter brand name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Filter by First Letter">
            <Select
              placeholder="Select letter"
              allowClear
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


      {/* Bảng Thương hiệu */}
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 6 }} />

      {/* Modal xác nhận xóa */}
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => deleteBrand(brandId)}
        title="Are you sure you want to delete this brand?"
      />
    </div>
  );
};

export default Brandlist;
