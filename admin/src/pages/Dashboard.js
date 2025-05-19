import React, { useEffect } from "react";
import { BsGraphUpArrow } from "react-icons/bs";
import { Table } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../features/auth/authSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Hàm lấy trạng thái thanh toán tương tự trang Orders
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

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const orders = useSelector((state) => state.auth.orders) || [];

  // Tính tổng số đơn hàng
  const totalOrders = orders.length;

  // Tính tổng doanh thu (tổngAmount)
  const totalRevenue = orders.reduce((acc, order) => acc + (order?.totalAmount || 0), 0);

  // Đếm đơn hàng đã thanh toán
  const paidOrders = orders.filter(order => getPaymentStatus(order).startsWith("Đã thanh toán")).length;

  // Chuẩn bị dữ liệu bảng hiển thị đơn hàng gần đây (lấy 10 đơn gần nhất)
  const data = orders
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10)
    .map((order, index) => ({
      key: index + 1,
      name: `${order?.orderBy?.firstname || ""} ${order?.orderBy?.lastname || ""}`.trim() || "N/A",
      product: (
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          {order?.products?.map((item, i) => (
            <li key={i}>{item?.product?.title || "N/A"}</li>
          ))}
        </ul>
      ),
      status: order?.orderStatus || "N/A",
    }));

  // Cột cho bảng đơn hàng gần đây
  const columns = [
    { title: "STT", dataIndex: "key" },
    { title: "Tên Khách Hàng", dataIndex: "name" },
    { title: "Sản Phẩm", dataIndex: "product" },
    { title: "Trạng Thái", dataIndex: "status" },
  ];

  // Dữ liệu biểu đồ doanh thu theo tháng (ví dụ giả định)
  // Bạn có thể thay đổi hoặc lấy dữ liệu thực tế nếu có API
  const barData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: [120000000, 90000000, 140000000, 80000000, 150000000, 170000000, 110000000, 130000000, 90000000, 140000000, 160000000, 180000000],
        backgroundColor: "#4caf50",
        borderRadius: 5,
      },
    ],
  };

  const lineData = {
    labels: barData.labels,
    datasets: [
      {
        label: "Xu hướng doanh thu",
        data: barData.datasets[0].data,
        borderColor: "#2196f3",
        backgroundColor: "rgba(33,150,243,0.2)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#2196f3",
      },
    ],
  };

  const pieData = {
    labels: ["Electronics", "Fashion", "Books", "Other"],
    datasets: [
      {
        label: "Phân loại sản phẩm",
        data: [300, 200, 100, 150],
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#9c27b0"],
      },
    ],
  };

  const doughnutData = {
    labels: ["Asia", "Europe", "America", "Other"],
    datasets: [
      {
        label: "Người dùng theo vùng",
        data: [500, 300, 200, 100],
        backgroundColor: ["#4caf50", "#2196f3", "#ff9800", "#9e9e9e"],
      },
    ],
  };

  return (
    <div>
      <h3 className="mb-4 title">Trang Tổng Quan</h3>

      {/* Tổng quan */}
      <div className="d-flex align-content-center justify-content-center gap-3">
        <div className="d-flex justify-content-between align-items-center flex-grow-1 bg-white p-3 rounded-3">
          <div>
            <p className="mb-0">Tổng đơn hàng</p>
            <h4>{totalOrders}</h4>
          </div>
          <div className="d-flex flex-column align-items-end">
            <h6 className="d-flex gap-2 green">
              <BsGraphUpArrow />
              {/* Ví dụ: tăng 10% so với tháng trước, bạn có thể cập nhật logic */}
              10%
            </h6>
            <p className="mb-0">So với tháng trước</p>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center flex-grow-1 bg-white p-3 rounded-3">
          <div>
            <p className="mb-0">Tổng doanh thu</p>
            <h4>{totalRevenue.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</h4>
          </div>
          <div className="d-flex flex-column align-items-end">
            <h6 className="d-flex gap-2 green">
              <BsGraphUpArrow />
              15%
            </h6>
            <p className="mb-0">So với tháng trước</p>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center flex-grow-1 bg-white p-3 rounded-3">
          <div>
            <p className="mb-0">Đơn hàng đã thanh toán</p>
            <h4>{paidOrders}</h4>
          </div>
          <div className="d-flex flex-column align-items-end">
            <h6 className="d-flex gap-2 green">
              <BsGraphUpArrow />
              8%
            </h6>
            <p className="mb-0">So với tháng trước</p>
          </div>
        </div>
      </div>

      {/* Biểu đồ */}
      <div className="mt-4">
        <div className="grid-container mt-4" style={{ display: "flex", gap: "20px" }}>
          <div className="grid-item" style={{ flex: 1, background: "white", padding: "15px", borderRadius: "8px" }}>
            <h5>Doanh thu theo tháng</h5>
            <Bar data={barData} options={{ responsive: true }} />
          </div>
          <div className="grid-item" style={{ flex: 1, background: "white", padding: "15px", borderRadius: "8px" }}>
            <h5>Xu hướng doanh thu</h5>
            <Line data={lineData} options={{ responsive: true }} />
          </div>
        </div>

        <div className="mt-4 grid-container-2" style={{ display: "flex", gap: "20px" }}>
          <div className="grid-item" style={{ flex: 1, background: "white", padding: "15px", borderRadius: "8px" }}>
            <h5>Phân loại sản phẩm</h5>
            <Pie data={pieData} options={{ responsive: true }} />
          </div>
          <div className="grid-item" style={{ flex: 1, background: "white", padding: "15px", borderRadius: "8px" }}>
            <h5>Phân bổ người dùng</h5>
            <Doughnut data={doughnutData} options={{ responsive: true }} />
          </div>
        </div>
      </div>

      {/* Bảng đơn hàng gần đây */}
      <div className="mt-4">
        <h3 className="mb-4">Đơn hàng gần đây</h3>
        <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />
      </div>
    </div>
  );
};

export default Dashboard;
