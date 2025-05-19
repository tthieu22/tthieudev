import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrderByCode } from "../features/order/orderSlice";
import { useDispatch, useSelector } from "react-redux";

const OrderDetail = () => {
  const { orderCode } = useParams();
  const dispatch = useDispatch();
  const [loadOrder, setLoadOrder] = useState(true);

  const [order, setOrder] = useState(null);
  const {
    orders,  
    isLoading,
  } = useSelector((state) => state.order);

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

  if (isLoading || !order) return <div className="text-center mt-5">Đang tải đơn hàng...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Chi tiết đơn hàng: {order.orderCode}</h2>

      <div className="row">
        {/* Thông tin giao hàng & thanh toán */}
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">Thông tin giao hàng</div>
            <div className="card-body">
              <p><strong>Họ tên:</strong> {order.shippingAddress?.fullName}</p>
              <p><strong>SĐT:</strong> {order.shippingAddress?.phone}</p>
              <p><strong>Địa chỉ:</strong> {order.shippingAddress?.address}, {order.shippingAddress?.district}, {order.shippingAddress?.city}</p>
              <p><strong>Mã bưu chính:</strong> {order.shippingAddress?.postalCode}</p>
              <p><strong>Quốc gia:</strong> {order.shippingAddress?.country}</p>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header bg-success text-white">Thông tin thanh toán</div>
            <div className="card-body">
              <p><strong>Phương thức:</strong> {order.paymentMethod}</p>
              <p><strong>Trạng thái:</strong> {order.paymentStatus}</p>
              <p><strong>Ngày thanh toán:</strong> {order.paymentDetails?.payDate ? new Date(order.paymentDetails.payDate).toLocaleString() : "Chưa thanh toán"}</p>
              <p><strong>Mã giao dịch:</strong> {order.paymentDetails?.transactionId || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Chi tiết đơn hàng */}
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-dark text-white">Tóm tắt đơn hàng</div>
            <div className="card-body">
              <p><strong>Trạng thái đơn:</strong> {order.orderStatus}</p>
              <p><strong>Tổng tiền:</strong> {order.totalAmount?.toLocaleString()}₫</p>
              <p><strong>Đã giảm:</strong> {(order.totalAmount - (order.totalAfterDiscount || order.totalAmount)).toLocaleString()}₫</p>
              <p><strong>Thành tiền:</strong> <span className="text-danger fw-bold">{(order.totalAfterDiscount || order.totalAmount).toLocaleString()}₫</span></p>
              <p><strong>Mã giảm giá:</strong> {order.coupon || "Không có"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="card">
        <div className="card-header bg-info text-white">Danh sách sản phẩm</div>
        <ul className="list-group list-group-flush">
        {order.products.map((item, index) => (
          <li className="list-group-item" key={index}>
            <div className="row">
              <div className="col-md-2">
                <img src={item.product ? item.product.images[0].url : ""} className="img-fluid" alt= {item.product ? item.product.title : ""} />
              </div>
              <div className="col-md-10">
                <p><strong>Tên sản phẩm:</strong> {item.product ? item.product.title : "Không có dữ liệu"}</p>
                <p><strong>Mã sản phẩm:</strong> {item.product ? item.product._id : "Không có dữ liệu"}</p>
                <p><strong>Màu sắc:</strong> {
                  typeof item.color === "object" 
                    ? (item.color.title || item.color.name || JSON.stringify(item.color)) 
                    : item.color || "Không có dữ liệu"
                }</p>
                <p><strong>Số lượng:</strong> {item.count}</p>
                <p><strong>Giá:</strong> {typeof item.price === "number" ? item.price.toLocaleString() : item.price}₫</p>
              </div>
            </div>
          </li>
        ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderDetail;
