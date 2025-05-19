import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Select,
  Popconfirm,
  Button,
  Tag,
  Row,
  Col,
  message as antdMessage,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, deleteUser } from "../features/auth/authSlice";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate ,useLocation  } from "react-router-dom";

const { Option } = Select;

const Customers = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, isLoading, isError, message } = useSelector((state) => state.auth);

  const [searchText, setSearchText] = useState("");
  const [filteredRole, setFilteredRole] = useState("");

  useEffect(() => {
    if (location.state?.reload) {
      dispatch(getUsers());
      // Xóa reload state để không chạy lại khi rerender
      window.history.replaceState({}, document.title);
    } else {
      dispatch(getUsers());
    }
  }, [dispatch, location.state]);
  useEffect(() => {
    if (isError) {
      antdMessage.error(message || "Đã xảy ra lỗi!");
    }
  }, [isError, message]);

  const handleDelete = (id) => {
    dispatch(deleteUser(id))
      .unwrap()
      .then(() => {
        antdMessage.success("Xoá người dùng thành công!");
        dispatch(getUsers());
      })
      .catch(() => {
        antdMessage.error("Xoá không thành công.");
      });
  };

  const handleEdit = (user) => {
    navigate(`/admin/customers/${user._id}`);
  };

  const filteredUsers = users
    ?.filter((user) => {
      const combined = `${user._id} ${user.firstname} ${user.lastname} ${user.email} ${user.mobile} ${user.role}`.toLowerCase();
      return combined.includes(searchText.toLowerCase());
    })
    .filter((user) => (filteredRole ? user.role === filteredRole : true));

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
      width: 70,
    },
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (_, record) => `${record.firstname} ${record.lastname}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "admin" ? "volcano" : "blue"}>{role}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="primary"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xoá người dùng?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button icon={<DeleteOutlined />} danger>
              Xoá
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h3 className="mb-4 title">Quản lý người dùng</h3>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Input
            placeholder="Tìm kiếm theo tất cả thông tin..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </Col>
        <Col span={6}>
          <Select
            placeholder="Lọc theo vai trò"
            style={{ width: "100%" }}
            value={filteredRole}
            onChange={(value) => setFilteredRole(value)}
            allowClear
          >
            <Option value="admin">admin</Option>
            <Option value="user">user</Option>
          </Select>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="_id"
        loading={isLoading}
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
};

export default Customers;
