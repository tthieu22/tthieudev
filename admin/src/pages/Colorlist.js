import React, { useEffect, useState, useMemo } from "react";
import { Table, Input, Button, Row, Col, Space } from "antd";
import { Link } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { deleteaColor, getColors } from "../features/color/colorClice";
import CustomModal from "../components/CustomModal";
import { toast } from "react-toastify";

const Colorlist = () => {
  const dispatch = useDispatch();

  const colorStateRaw = useSelector((state) => state.color.colors);
  const colorState = useMemo(() => colorStateRaw || [], [colorStateRaw]);

  const [open, setOpen] = useState(false);
  const [colorId, setColorId] = useState("");

  const [searchTitle, setSearchTitle] = useState("");

  useEffect(() => {
    dispatch(getColors());
  }, [dispatch]);

  const showModal = (id) => {
    setOpen(true);
    setColorId(id);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const handleDeleteColor = (id) => {
    setOpen(false);
    dispatch(deleteaColor(id))
      .unwrap()
      .then(() => {
        toast.success("Xoá màu thành công!");
        dispatch(getColors());
      })
      .catch(() => {
        toast.error("Xoá màu thất bại!");
      });
  };

  const filteredData = colorState
    .filter((color) =>
      color.title.toLowerCase().includes(searchTitle.toLowerCase().trim())
    )
    .map((color, index) => ({
      key: color._id,
      index: index + 1,
      title: (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              display: "inline-block",
              width: 24,
              height: 24,
              borderRadius: 4,
              backgroundColor: color.title,
              border: "1px solid #ccc",
            }}
          ></span>
          <span>{color.title}</span>
        </div>
      ),
      action: (
        <Space size="middle">
          <Link to={`/admin/color/${color._id}`} className="text-dark">
            <FaEdit className="fs-5" />
          </Link>
          <Button
            type="text"
            danger
            onClick={() => showModal(color._id)}
            icon={<MdDeleteForever className="fs-5" />}
          />
        </Space>
      ),
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
      title: "Màu sắc",
      dataIndex: "title",
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      width: 120,
    },
  ];

  const resetFilters = () => {
    setSearchTitle("");
  };

  return (
    <div style={{ padding: 24, backgroundColor: "#fff", borderRadius: 6 }}>
      <h3 className="mb-4 title" style={{ marginBottom: 24 }}>
        Quản lý màu sắc
      </h3>

      {/* Filter bar */}
      <Row
        gutter={[16, 16]}
        align="middle"
        style={{ marginBottom: 24, flexWrap: "wrap" }}
      >
        <Col xs={24} sm={12} md={8} lg={6}>
          <Input.Search
            placeholder="Tìm kiếm theo tên màu"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            allowClear
            enterButton
          />
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
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

      {/* Modal xác nhận xoá */}
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => handleDeleteColor(colorId)}
        title="Bạn có chắc chắn muốn xóa màu sắc này không?"
        btnTitle="Xóa màu"
        performActionBtn="Xóa màu"
      />
    </div>
  );
};

export default Colorlist;
