import React, { useEffect, useState, useMemo } from "react";
import { Table, Input, Select, Button, Row, Col, Space, Modal, Form, Input as AntInput } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { MdDeleteForever } from "react-icons/md";
import CustomModal from "../components/CustomModal"; 
import { toast } from "react-toastify";
import { getEnquiries , deleteEnquiry ,updateEnquiryFeedback } from "../features/enquiries/enquiriesClice";

const { Option } = Select;

const Enquiries = () => {
  const dispatch = useDispatch();

  const enquiriesRaw = useSelector((state) => state.enquiry.enquiries);
  const enquiries = useMemo(() => enquiriesRaw || [], [enquiriesRaw]);

  const [open, setOpen] = useState(false);
  const [enquiryId, setEnquiryId] = useState("");

  // Filter states
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [filteredStatus, setFilteredStatus] = useState("");

  // Popup nhập phản hồi
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    dispatch(getEnquiries());
  }, [dispatch]);

  const showModal = (id) => {
    setOpen(true);
    setEnquiryId(id);
  };
  const hideModal = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    setOpen(false);
    dispatch(deleteEnquiry(enquiryId))
      .unwrap()
      .then(() => {
        toast.success("Xóa enquiry thành công!");
        dispatch(getEnquiries());
      })
      .catch(() => {
        toast.error("Xóa enquiry thất bại!");
      });
  };

  // Mở popup nhập phản hồi
  const openFeedbackModal = (enquiry, newStatus) => {
    setSelectedEnquiry(enquiry);
    setSelectedStatus(newStatus);
    setFeedbackText("");
    setFeedbackModalVisible(true);
  };

  // Xử lý lưu phản hồi
  const handleFeedbackOk = async () => {
    if (!feedbackText.trim()) {
      toast.error("Vui lòng nhập phản hồi!");
      return;
    }
    setFeedbackModalVisible(false); 
    const data = await dispatch(updateEnquiryFeedback({ id: selectedEnquiry._id, status: selectedStatus, feedback: feedbackText }));
    console.log(data);
    if (data?.payload?.status === "success") {
      toast.success("Phản hồi thành cong!");
    } else {
      toast.error("Phản hồi thất bại!");
    }
    
  };

  const handleFeedbackCancel = () => {
    setFeedbackModalVisible(false);
  };

  // Lọc và tìm kiếm
  const filteredData = enquiries
    .filter((enq) =>
      enq.name.toLowerCase().includes(searchName.toLowerCase().trim())
    )
    .filter((enq) =>
      enq.email.toLowerCase().includes(searchEmail.toLowerCase().trim())
    )
    .filter((enq) => (filteredStatus ? enq.status === filteredStatus : true))
    .map((enq, index) => ({
      key: enq._id || index,
      name: enq.name,
      email: enq.email,
      mobile: enq.mobile,
      comment: enq.comment,
      status: enq.comment === "N/A" ? "N/A" : enq.status,
      enquiryObj: enq, // lưu đối tượng để dùng khi chọn status
      action: (
        <Space size="middle">
          <Button
            type="text"
            danger
            onClick={() => showModal(enq._id)}
            icon={<MdDeleteForever className="fs-5" />}
          />
        </Space>
      ),
      index: index + 1,
    }));

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      width: 70,
      sorter: (a, b) => a.index - b.index,
      defaultSortOrder: "ascend",
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
    },
    {
      title: "Comment",
      dataIndex: "comment",
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (_, record) => { 
        const enq = record.enquiryObj;
    
        return (
          <Select
            value={enq.status}
            disabled={enq.status === "In Progress"}
            style={{ width: 140 }}
            onChange={(value) => {
              if (value === "In Progress") {
                toast.info("Enquiry đã được phản hồi, không thể thay đổi trạng thái.");
                return;
              }
              openFeedbackModal(enq, value);
            }}
          >
            <Option value="Submitted">Submitted</Option>
            <Option value="In Progress">In Progress</Option>
            <Option value="N/A">N/A</Option>
          </Select>
        );
      },
    }, 
    {
      title: "Action",
      dataIndex: "action",
      width: 100,
    },
  ];

  const resetFilters = () => {
    setSearchName("");
    setSearchEmail("");
    setFilteredStatus("");
  };

  return (
    <div style={{ padding: 24, backgroundColor: "#fff", borderRadius: 6 }}>
      <h3 className="mb-4 title" style={{ marginBottom: 24 }}>
        Quản lý Enquiries
      </h3>

      {/* Filter bar */}
      <Row
        gutter={[16, 16]}
        align="middle"
        style={{ marginBottom: 24, flexWrap: "wrap" }}
      >
        <Col xs={24} sm={12} md={8} lg={6}>
          <Input.Search
            placeholder="Tìm kiếm theo tên"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            allowClear
            enterButton
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Input.Search
            placeholder="Tìm kiếm theo email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            allowClear
            enterButton
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Select
            placeholder="Lọc theo trạng thái"
            value={filteredStatus || undefined}
            onChange={(value) => setFilteredStatus(value)}
            allowClear
            style={{ width: "100%" }}
          >
            <Option value="Submitted">Submitted</Option>
            <Option value="In Progress">In Progress</Option>
            <Option value="N/A">N/A</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Button onClick={resetFilters} block>
            Reset bộ lọc
          </Button>
        </Col>
      </Row>

      {/* Table */}
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
        performAction={handleDelete}
        title="Bạn có chắc chắn muốn xóa enquiry này không?"
        btnTitle="Xóa enquiry"
        performActionBtn="Xóa enquiry"
      />

      {/* Modal nhập phản hồi */}
      <Modal
        title={`Phản hồi cho enquiry: ${selectedEnquiry?.name || ""}`}
        open={feedbackModalVisible}
        onOk={handleFeedbackOk}
        onCancel={handleFeedbackCancel}
        okText="Gửi phản hồi"
        cancelText="Hủy"
      >
        <Form layout="vertical">
          <Form.Item label="Phản hồi">
            <AntInput.TextArea
              rows={4}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Nhập phản hồi của bạn..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Enquiries;
