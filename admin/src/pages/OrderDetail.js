import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrderByCode, updateOrderStatus } from "../features/order/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaLink } from "react-icons/fa";
const OrderDetail = () => {
  const { orderCode } = useParams();
  const dispatch = useDispatch();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const { orders, isLoading, isUpdateOrderStatus, updateError } = useSelector((state) => state.order);

  useEffect(() => {
    if (orderCode) {
      dispatch(getOrderByCode(orderCode));
    }
  }, [dispatch, orderCode]);

  useEffect(() => {
    if (orders && orders.orderCode === orderCode) {
      setOrder(orders);
      setStatus(orders.orderStatus || "");
    }
  }, [orders, orderCode]);

  useEffect(() => {
    if (isUpdating) {
      if (isUpdateOrderStatus?.order?.orderStatus === status) {
        toast.success(`Đã cập nhật trạng thái đơn hàng thành "${status}".`);
        setIsUpdating(false);
        setShowCancelConfirm(false);
      } else if (updateError) {
        toast.error("Cập nhật trạng thái đơn hàng không thành công.");
        setIsUpdating(false);
        setShowCancelConfirm(false);
      }
    }
  }, [isUpdateOrderStatus, updateError, status, isUpdating]);

  // Copy mã đơn hàng
  const handleCopyOrderCode = () => {
    if (orderCode) {
      navigator.clipboard.writeText(orderCode).then(() => {
        toast.success("Đã sao chép mã đơn hàng!");
      });
    }
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    if (!order?._id) return;

    setIsUpdating(true);
    dispatch(updateOrderStatus({ orderId: order._id, status: newStatus }));
  };

  const handleCancelOrder = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancelOrder = () => {
    if (!order?._id) return;

    setIsUpdating(true);
    dispatch(updateOrderStatus({ orderId: order._id, status: "Cancelled" }));
  };

  const cancelCancelOrder = () => {
    setShowCancelConfirm(false);
  };

  const handleRefresh = () => {
    if (orderCode) {
      dispatch(getOrderByCode(orderCode));
      toast.info("Đang làm mới dữ liệu đơn hàng...");
    }
  };

  if (isLoading || !order) {
    return <div className="text-center mt-5">Đang tải đơn hàng...</div>;
  }

  const {
    shippingAddress,
    orderBy,
    paymentMethod,
    paymentStatus,
    paymentDetails,
    totalAmount,
    products,
    createdAt,
    transactionId,
  } = order;

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center text-primary">
        Chi tiết đơn hàng -{" "}
        <span className="text-warning" style={{ cursor: "pointer" }} onClick={handleCopyOrderCode} title="Click để sao chép mã đơn hàng">
          {order.orderCode} <FaLink />
        </span>
      </h2>

      <div className="mb-4 text-end">
        <button className="btn btn-outline-primary me-2" onClick={handleRefresh}>
          Làm mới đơn hàng
        </button>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-header bg-info text-white fw-semibold">Thông tin khách hàng</div>
            <div className="card-body">
            <p><strong>Họ tên:</strong> {shippingAddress?.fullName}</p>
            <p><strong>Địa chỉ:</strong> {shippingAddress?.address}, {shippingAddress?.district}, {shippingAddress?.city}, {shippingAddress?.country}</p>
            <p><strong>Mã bưu điện:</strong> {shippingAddress?.postalCode}</p>
            <p><strong>Điện thoại:</strong> {shippingAddress?.phone}</p>
            <p><strong>Email:</strong> {orderBy?.email}</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-header bg-info text-white fw-semibold">Thông tin đơn hàng</div>
            <div className="card-body">
              <p><strong>Ngày tạo đơn:</strong> {createdAt ? new Date(createdAt).toLocaleString() : "N/A"}</p>
              <p><strong>Mã giao dịch:</strong> {transactionId || "Chưa có"}</p>
              <p><strong>Phương thức thanh toán:</strong> {paymentMethod}</p>
              <p><strong>Trạng thái thanh toán:</strong> {paymentStatus}</p>
              <p>
                <strong>Ngày thanh toán:</strong>{" "}
                {paymentDetails?.payDate ? new Date(paymentDetails.payDate).toLocaleString() : "Chưa thanh toán"}
              </p>
              <p><strong>Tổng tiền:</strong> <span className="text-danger fs-5">{totalAmount.toLocaleString()}₫</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-secondary text-white fw-semibold">Cập nhật trạng thái đơn hàng</div>
        <div className="card-body d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3">
          <select
            className="form-select w-auto"
            value={status}
            onChange={handleStatusChange}
            disabled={isUpdating}
          >
            <option value="Not Processed">Chưa xử lý</option>
            <option value="Processing">Đang xử lý</option>
            <option value="Shipped">Đã gửi hàng</option>
            <option value="Delivered">Đã giao hàng</option>
            <option value="Cancelled">Đã hủy</option>
          </select>

          <div className="d-flex gap-2 flex-wrap">
            <button onClick={handleCancelOrder} className="btn btn-danger" disabled={isUpdating}>
              Hủy đơn
            </button>
          </div>
        </div>
      </div>

      {/* Popup xác nhận hủy đơn */}
      {showCancelConfirm && (
        <div className="modal show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Xác nhận hủy đơn hàng</h5>
                <button type="button" className="btn-close" onClick={cancelCancelOrder} disabled={isUpdating}></button>
              </div>
              <div className="modal-body">
                <p>Bạn có chắc chắn muốn hủy đơn hàng này không?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cancelCancelOrder} disabled={isUpdating}>Không</button>
                <button className="btn btn-danger" onClick={confirmCancelOrder} disabled={isUpdating}>Có, hủy đơn</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white fw-semibold">Danh sách sản phẩm</div>
        <div className="card-body">
          {products?.length === 0 && <p>Không có sản phẩm trong đơn hàng.</p>}
          {products?.map((item, idx) => (
            <div key={idx} className="d-flex flex-column flex-md-row align-items-center border-top pt-3 mt-3 gap-3">
              <img
                src={item.product?.images[0]?.url}
                alt={item.product?.title}
                style={{ width: 130, height: 130, objectFit: "cover", borderRadius: 8 }}
              />
              <div className="flex-grow-1">
                <p className="mb-1"><strong>Sản phẩm:</strong> {item.product?.title}</p>
                <p className="mb-1"><strong>Số lượng:</strong> {item.count}</p>
                <p className="mb-1"><strong>Giá:</strong> {item.price.toLocaleString()}₫</p>
                <p className="mb-0">
                  <strong>Màu sắc:</strong>{" "}
                  <span
                    style={{
                      backgroundColor: item.color?.title || "#ccc",
                      width: 20,
                      height: 20,
                      display: "inline-block",
                      borderRadius: "50%",
                      border: "1px solid #000",
                      verticalAlign: "middle",
                    }}
                    title={item.color?.title}
                  />
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
