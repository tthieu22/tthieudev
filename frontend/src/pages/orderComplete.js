import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderByCode, cancelOrder } from "../features/order/orderSlice";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";

const OrderDetail = () => {
  const { orderCode } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loadOrder, setLoadOrder] = useState(true);
  const [order, setOrder] = useState(null);
  const contentRef = useRef();

  const { orders, isLoading } = useSelector((state) => state.order);

  useEffect(() => {
    if (orderCode && loadOrder) {
      dispatch(getOrderByCode(orderCode));
      setLoadOrder(false);
    }
  }, [dispatch, orderCode, loadOrder]);

  useEffect(() => {
    if (orders && orders.orderCode === orderCode) {
      setOrder(orders);
    }
  }, [orders, orderCode]);

  const handleExportPDF = () => {
    if (contentRef.current) {
      html2canvas(contentRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`HoaDon_${order?.orderCode || "unknown"}.pdf`);
      });
    }
  };

  const handleCancelOrder = () => {
    if (order && window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
      dispatch(cancelOrder(order._id));
    }
  };

  if (isLoading) {
    return (
      <div className="py-3">
        <div className="loading-spinner d-flex align-items-center justify-content-center" style={{ textAlign: "center", padding: "50px", height: "70vh" }}>
          <h5>Đang tải dữ liệu đơn hàng...</h5>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-3">
        <div className="container text-center" style={{ padding: "50px", height: "70vh" }}>
          <h5>Không tìm thấy thông tin đơn hàng.</h5>
        </div>
      </div>
    );
  }

  return (
    <>
      <Meta title={order.orderCode} />
      <BreadCrumb title={"Chi tiết đơn hàng: " + order.orderCode} />
      <div className="bg-content-order">
        <div className="container mt-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Chi tiết đơn hàng: {order.orderCode}</h2>
            <div>
              <button className="btn btn-secondary me-2" onClick={() => navigate("/orders")}>← Quay lại</button>
              <button className="btn btn-info me-2" onClick={handleExportPDF}>Xuất PDF</button>
              {order.orderStatus === "Not Processed" && (
                <button className="btn btn-danger" onClick={handleCancelOrder}>Hủy đơn hàng</button>
              )}
            </div>
          </div>

          <div ref={contentRef}>
            <div className="row">
              <div className="col-md-6">
                <div className="card mb-4">
                  <div className="card-header bg-primary text-white">Thông tin giao hàng</div>
                  <div className="card-body">
                    <p><strong>Họ tên:</strong> {order.shippingAddress?.fullName || "N/A"}</p>
                    <p><strong>SĐT:</strong> {order.shippingAddress?.phone || "N/A"}</p>
                    <p><strong>Địa chỉ:</strong> {[order.shippingAddress?.address, order.shippingAddress?.district, order.shippingAddress?.city].filter(Boolean).join(", ") || "N/A"}</p>
                    <p><strong>Mã bưu chính:</strong> {order.shippingAddress?.postalCode || "N/A"}</p>
                    <p><strong>Quốc gia:</strong> {order.shippingAddress?.country || "N/A"}</p>
                  </div>
                </div>

                <div className="card mb-4">
                  <div className="card-header bg-success text-white">Thông tin thanh toán</div>
                  <div className="card-body">
                    <p><strong>Phương thức:</strong> {order.paymentMethod || "N/A"}</p>
                    <p><strong>Trạng thái:</strong> {order.paymentStatus || "N/A"}</p>
                    <p><strong>Ngày thanh toán:</strong> {order.paymentDetails?.payDate ? new Date(order.paymentDetails.payDate).toLocaleString() : "Chưa thanh toán"}</p>
                    <p><strong>Mã giao dịch:</strong> {order.paymentDetails?.transactionId || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card mb-4">
                  <div className="card-header bg-dark text-white">Tóm tắt đơn hàng</div>
                  <div className="card-body">
                    <p><strong>Trạng thái đơn:</strong> {order.orderStatus}</p>
                    <p><strong>Tổng tiền:</strong> {(order.totalAmount ?? 0).toLocaleString()}₫</p>
                    <p><strong>Đã giảm:</strong> {((order.totalAmount ?? 0) - (order.totalAfterDiscount ?? order.totalAmount ?? 0)).toLocaleString()}₫</p>
                    <p><strong>Thành tiền:</strong> <span className="text-danger fw-bold">{(order.totalAfterDiscount ?? order.totalAmount ?? 0).toLocaleString()}₫</span></p> 
                    <p><strong>Mã giảm giá:</strong> {order.coupon || "Không có"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card mb-5">
              <div className="card-header bg-info text-white">Danh sách sản phẩm</div>
              <ul className="list-group list-group-flush">
                {order.products?.map((item, index) => (
                  <li className="list-group-item" key={index}>
                    <div className="row">
                      <div className="col-md-2">
                        <img src={item.product?.images?.[0]?.url || ""} className="img-fluid" alt={item.product?.title || ""} />
                      </div>
                      <div className="col-md-10">
                        <p><strong>Tên sản phẩm:</strong> {item.product?.title || "Không có dữ liệu"}</p>
                        <p><strong>Mã sản phẩm:</strong> {item.product?._id || "Không có dữ liệu"}</p>
                        <p><strong>Màu sắc:</strong> {
                          typeof item.color === "object"
                            ? (item.color.title || item.color.name || JSON.stringify(item.color))
                            : item.color || "Không có dữ liệu"
                        }</p>
                        <p><strong>Số lượng:</strong> {item.count || 0}</p>
                        <p><strong>Giá:</strong> {typeof item.price === "number" ? item.price.toLocaleString() : item.price}₫</p>
                      </div>
                    </div>
                  </li>
                )) || <li className="list-group-item">Không có sản phẩm</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;
