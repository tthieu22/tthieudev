import React, { useEffect, useState, useMemo } from "react";
import { Table, Input, Select, Button, Row, Col, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { getAllCoupon } from "../features/coupon/couponSlice";

const { Option } = Select;

const Coupon = () => {
  const dispatch = useDispatch();

  const [searchName, setSearchName] = useState("");
  const [filteredDiscount, setFilteredDiscount] = useState("");

  useEffect(() => {
    dispatch(getAllCoupon());
  }, [dispatch]);

  const couponstate = useSelector((state) => state.coupon.coupons || []);

  // Lấy danh sách discount duy nhất để làm dropdown lọc
  const discountOptions = useMemo(() => {
    const uniqueDiscounts = new Set(couponstate.map((c) => c.discount));
    return [...uniqueDiscounts].sort((a, b) => a - b);
  }, [couponstate]);

  // Filter data theo search và lọc discount
  const filteredData = couponstate
    .filter((coupon) =>
      coupon.name.toLowerCase().includes(searchName.toLowerCase().trim())
    )
    .filter((coupon) =>
      filteredDiscount ? coupon.discount === filteredDiscount : true
    )
    .map((coupon, index) => ({
      key: index,
      name: coupon.name,
      expiry: coupon.expiry,
      discount: coupon.discount,
      action: (
        <Space size="middle">
          <Link to="/admin" className="text-dark">
            <FaEdit className="fs-4" />
          </Link>
          <Link to="/admin" className="text-dark">
            <MdDeleteForever className="fs-4" />
          </Link>
        </Space>
      ),
    }));

  const columns = [
    {
      title: "No",
      dataIndex: "key",
      sorter: (a, b) => a.key - b.key,
      defaultSortOrder: "ascend",
      width: 70,
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Expiry",
      dataIndex: "expiry",
      sorter: (a, b) => new Date(a.expiry) - new Date(b.expiry),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      sorter: (a, b) => a.discount - b.discount,
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 120,
    },
  ];

  const resetFilters = () => {
    setSearchName("");
    setFilteredDiscount("");
  };

  return (
    <div style={{ padding: 24, backgroundColor: "#fff", borderRadius: 6 }}>
      <h3 className="mb-4 title">Coupon List</h3>

      {/* Filter bar */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Input.Search
            placeholder="Search by name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            allowClear
            enterButton
          />
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Select
            placeholder="Filter by discount"
            value={filteredDiscount || undefined}
            onChange={(value) => setFilteredDiscount(value)}
            allowClear
            style={{ width: "100%" }}
          >
            {discountOptions.map((discount) => (
              <Option key={discount} value={discount}>
                {discount}%
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={24} md={8} lg={6}>
          <Button onClick={resetFilters} block>
            Reset Filters
          </Button>
        </Col>
      </Row>

      {/* Data Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 8 }}
        rowKey="key"
        bordered
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default Coupon;
