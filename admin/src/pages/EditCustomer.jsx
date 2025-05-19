import React, { useEffect, useState } from "react";
import { Form, Input, Button, Spin, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, updateUser } from "../features/auth/authSlice";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const { Option } = Select;

const EditCustomer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { users, isLoading } = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    if (!users.length) dispatch(getUsers());
  }, [dispatch, users.length]);

  useEffect(() => {
    const user = users.find((u) => u._id === id); 
    if (user) {
      const values = {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      };
      setInitialValues(values);
      form.setFieldsValue(values);
    }
  }, [users, id, form]);

  const onFinish = (values) => {
    dispatch(updateUser({ ...values, _id: id }))
      .unwrap()
      .then(() => {
        toast.success("Cập nhật người dùng thành công!");
        navigate("/admin/customer", { state: { reload: true } });
      })
      .catch((error) => {
        toast.error("Cập nhật người dùng thất bại: " + (error.message || error));
      });
  };

  if (isLoading || !initialValues) return <Spin size="large" />;

  return (
    <div>
      <h3 className="mb-4 title">Chỉnh sửa người dùng</h3>
      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={initialValues}>
        <Form.Item label="First Name" name="firstname" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Last Name" name="lastname" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Mobile" name="mobile" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Role" name="role" rules={[{ required: true }]}>
          <Select>
            <Option value="user">User</Option>
            <Option value="admin">Admin</Option>
            <Option value="moderator">Moderator</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Lưu thay đổi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditCustomer;
