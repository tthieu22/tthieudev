import React, { useEffect, useState, useCallback } from "react";
import { Table, Input, Select, DatePicker, Button, Row, Col, Space, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit, FaPrint, FaFileExcel, FaFilePdf } from "react-icons/fa";
import { getOrders } from "../features/auth/authSlice";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Option } = Select;
const { RangePicker } = DatePicker;

const getPaymentStatus = (order) => {
  if (
    order?.paymentMethod === "VNPay" &&
    order?.paymentDetails?.responseCode === "00" &&
    order?.paymentStatus === "Paid"
  ) {
    return "Đã thanh toán (VNPay)";
  }
  if (
    order?.paymentMethod === "Momo" &&
    order?.paymentDetails?.responseCode === "00" &&
    order?.paymentStatus === "Paid"
  ) {
    return "Đã thanh toán (Momo)";
  }
  if (
    order?.paymentMethod === "COD" &&
    order?.paymentStatus === "Paid" &&
    order?.orderStatus === "Delivered"
  ) {
    return "Đã thanh toán (COD)";
  }
  return "Chưa thanh toán";
};

const Orders = () => {
  const dispatch = useDispatch();
  const orderstate = useSelector((state) => state.auth.orders);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  useEffect(() => {
    setFilteredData(orderstate);
  }, [orderstate]);

  const handleSearch = useCallback(() => {
    let result = [...orderstate];
    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      result = result.filter(
        (o) =>
          o?.orderCode?.toString().includes(searchText) ||
          `${o?.orderBy?.firstname} ${o?.orderBy?.lastname}`
            .toLowerCase()
            .includes(lowerSearch)
      );
    }
    if (statusFilter) {
      result = result.filter((o) => o?.orderStatus === statusFilter);
    }
    if (dateRange && dateRange.length === 2) {
      const [startMoment, endMoment] = dateRange;
      const start = startMoment.startOf('day').toDate();
      const end = endMoment.endOf('day').toDate();
      result = result.filter((o) => {
        const orderDate = new Date(o?.createdAt);
        return orderDate >= start && orderDate <= end;
      });
    }
    setFilteredData(result);
  }, [orderstate, searchText, statusFilter, dateRange]);

  const resetFilters = () => {
    setSearchText("");
    setStatusFilter(null);
    setDateRange([]);
    setFilteredData(orderstate);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredData.map((o, i) => ({
        STT: i + 1,
        "Mã đơn": o?.orderCode,
        "Khách hàng": `${o?.orderBy?.firstname} ${o?.orderBy?.lastname}`,
        "Sản phẩm": o?.products?.map((p) => p?.product?.title).join(", "),
        "Ngày đặt": new Date(o?.createdAt).toLocaleString(),
        "Tổng tiền": o?.totalAmount,
        "Trạng thái": o?.orderStatus,
        "Thanh toán": getPaymentStatus(o),
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, "orders.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["STT", "Mã đơn", "Khách hàng", "Sản phẩm", "Ngày đặt", "Tổng tiền", "Trạng thái", "Thanh toán"]],
      body: filteredData.map((o, i) => [
        i + 1,
        o?.orderCode,
        `${o?.orderBy?.firstname} ${o?.orderBy?.lastname}`,
        o?.products?.map((p) => p?.product?.title).join(", "),
        new Date(o?.createdAt).toLocaleString(),
        o?.totalAmount,
        o?.orderStatus,
        getPaymentStatus(o),
      ]),
    });
    doc.save("orders.pdf");
  };

  const handlePrint = (order) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`<h2>Hóa đơn đơn hàng</h2>`);
    printWindow.document.write(`<p>Mã đơn: ${order.orderCode}</p>`);
    printWindow.document.write(
      `<p>Khách hàng: ${order.orderBy.firstname} ${order.orderBy.lastname}</p>`
    );
    printWindow.document.write(
      `<p>Ngày đặt: ${new Date(order.createdAt).toLocaleString()}</p>`
    );
    printWindow.document.write(
      `<p>Sản phẩm:</p><ul>${order.products
        .map((p) => `<li>${p.product.title}</li>`)
        .join("")}</ul>`
    );
    printWindow.document.write(`<p>Tổng tiền: ${order.totalAmount}</p>`);
    printWindow.document.write(`<p>Trạng thái: ${order.orderStatus}</p>`);
    printWindow.document.write(`<p>Thanh toán: ${getPaymentStatus(order)}</p>`);
    printWindow.document.close();
    printWindow.print();
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
    },
    {
      title: "Mã đơn",
      dataIndex: "orderCode",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "name",
    },
    {
      title: "Sản phẩm",
      dataIndex: "product",
    },
    {
      title: "Ngày đặt",
      dataIndex: "date",
    },
    {
      title: "Tổng tiền",
      dataIndex: "amount",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (text) => (
        <Tag color={text === "Delivered" ? "green" : "orange"}>{text}</Tag>
      ),
    },
    {
      title: "Thanh toán",
      dataIndex: "pay",
    },
    {
      title: "Hành động",
      dataIndex: "action",
    },
  ];

  const data = filteredData?.map((order, index) => ({
    key: index + 1,
    orderCode: order?.orderCode?.toString() || "N/A",
    name: `${order?.orderBy?.firstname || ""} ${order?.orderBy?.lastname || ""}`
      .trim() || "N/A",
    product: (
      <ul style={{ paddingLeft: "20px", margin: 0 }}>
        {order?.products?.map((item, i) => (
          <li key={`${order.orderCode}-${item.product?._id}-${i}`}>
            {item?.product?.title || "N/A"}
          </li>
        ))}

      </ul>
    ),
    date: new Date(order?.createdAt).toLocaleString(),
    amount:
      order?.totalAmount?.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      }) || "N/A",
    status: order?.orderStatus || "N/A",
    pay: getPaymentStatus(order),
    action: (
      <div className="d-flex gap-3">
        <Link
          to={`/admin/admin-order-details/${order?.orderCode}`}
          className="text-dark"
          title="Sửa"
        >
          <FaEdit className="fs-4" />
        </Link>
        <FaPrint
          className="fs-4 text-primary"
          style={{ cursor: "pointer" }}
          onClick={() => handlePrint(order)}
          title="In đơn hàng"
        />
        <button
          className="btn btn-link p-0 text-danger"
          style={{ cursor: "pointer", border: "none", background: "none" }}
          title="Xóa"
          onClick={() => alert("Chức năng xóa chưa được cài đặt")}
          type="button"
        >
          <MdDeleteForever className="fs-4" />
        </button>
      </div>
    ),
  }));

  const orderCounts = orderstate.reduce((acc, cur) => {
    acc[cur.orderStatus] = (acc[cur.orderStatus] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <h3 className="mb-4 title">Orders</h3>

      <Row gutter={[16, 16]} className="mb-3">
        <Col span={6}>
          <Input
            placeholder="Tìm theo tên hoặc mã đơn"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            allowClear
          />
        </Col>
        <Col span={4}>
          <Select
            placeholder="Trạng thái"
            allowClear
            style={{ width: "100%" }}
            value={statusFilter}
            onChange={setStatusFilter}
          >
            <Option value="Not Processed">Not Processed - Chưa xử lý</Option>
            <Option value="Pending">Pending - Đang xử lý</Option>
            <Option value="Delivered">Delivered - Đã giao hàng</Option>
            <Option value="Shipped">Shipped - Đã gửi hàng</Option>
            <Option value="Cancelled"> Cancelled - Đã hủy</Option>
          </Select>
        </Col>
        <Col span={6}>
          <RangePicker
            style={{ width: "100%" }}
            value={dateRange}
            onChange={(dates) => setDateRange(dates || [])}
            allowClear
          />
        </Col>
        <Col span={8}>
          <Space>
            <Button type="primary" onClick={handleSearch}>
              Lọc
            </Button>
            <Button onClick={resetFilters}>Đặt lại lọc</Button>
            <Button icon={<FaFileExcel />} onClick={exportToExcel}>
              Excel
            </Button>
            <Button icon={<FaFilePdf />} onClick={exportToPDF}>
              PDF
            </Button>
          </Space>
        </Col>
      </Row>

      <div className="mb-3">
        {Object.entries(orderCounts).map(([status, count]) => (
          <Tag key={status} color="blue">
            {status}: {count}
          </Tag>
        ))}
      </div>

      <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default Orders;
