import React, { useEffect, useState  , useCallback} from "react";
import { getAllOrder } from "../features/order/orderSlice";
import { useDispatch } from "react-redux";
import { FaSpinner } from "react-icons/fa";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Container from "../components/Container";
import { Link } from "react-router-dom";

const UserOrdersPage = () => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Thêm state cho filter và pagination
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const fetchOrders = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const response = await dispatch(
        getAllOrder({
          page: params.page || page,
          limit: 3,
          search: params.search !== undefined ? params.search : search,
          status: params.status !== undefined ? params.status : status,
        })
      );
      const payload = response?.payload;
      if (payload) {
        setOrders(Array.isArray(payload.orders) ? payload.orders : []);
        setTotalPages(payload.totalPages || 1);
        setPage(payload.currentPage || 1);
      } else {
        setOrders([]);
      }
      setError(null);
    } catch (error) {
      setError(error.message || "Đã xảy ra lỗi khi tải đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [dispatch, page, search, status]); // Đưa các biến liên quan vào dependency
  
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
 
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);  
    fetchOrders({ page: 1, search, status });
  };

  // Hàm reset filter
  const handleResetFilter = () => {
    setSearch("");
    setStatus("");
    setPage(1);
    fetchOrders({ page: 1, search: "", status: "" });
  };

  // Hàm chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    fetchOrders({ page: newPage });
  };

  if (loading) {
    return (
      <>
        <Meta title={"Đơn hàng của bạn"} />
        <BreadCrumb title={"Đơn hàng của bạn"} />
        <div
          className="loading-spinner d-flex align-items-center justify-content-center"
          style={{ textAlign: "center", padding: "50px", minHeight: "70vh" }}
        >
          <FaSpinner
            className="spinner"
            style={{ fontSize: "40px", color: "#333", animation: "spin 1s linear infinite" }}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Meta title={"Đơn hàng của bạn"} />
      <BreadCrumb title={"Đơn hàng của bạn"} />
      <div className="bg-all-order">
      <Container class1="user-orders-container container p-3 pt-4"> 

        {/* Filter */}
        <form
          onSubmit={handleFilterSubmit}
          className="mb-4 d-flex flex-wrap align-items-center gap-3 justify-content-center"
        >
          <input
            type="text"
            placeholder="Tìm theo mã đơn hàng"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ maxWidth: "300px" }}
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="form-select"
            style={{ maxWidth: "200px" }}
          >
            <option value="">Tất cả trạng thái</option> 
            <option value="Not Processed">Not Processed</option>
            <option value="Processing">Processing</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Delivered">Delivered</option>
            <option value="Returned">Returned</option>
            <option value="Completed">Completed</option>
            <option value="Refunded">Refunded</option>
            <option value="Failed">Failed</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
          </select>

          <button type="submit" className="btn button">
            Lọc
          </button>
          <button type="button" className="btn button btn-secondary" onClick={handleResetFilter}>
            Đặt lại
          </button>
        </form> 
        {error && <div className="alert alert-danger text-center">{error}</div>}

        {orders.length === 0 ? (
          <div className="alert text-center d-flex align-items-center justify-content-center" style={{ minHeight: "70vh" }}>Bạn chưa có đơn hàng nào.</div>
        ) : (
          orders.map((order) => {
            const {
              _id,
              orderCode,
              orderStatus,
              paymentMethod,
              paymentStatus,
              deliveryFee,
              totalAmount,
              products = [],
              shippingAddress = {},
              paymentDetails = {},
            } = order;

            return (
              <div className="card order-card mb-5 shadow-sm p-3" key={_id}>
                <div className="order-header d-flex justify-content-between align-items-center mb-3">
                  <h5 className="order-code mb-0">
                    Mã đơn hàng: <span>{orderCode}</span>
                  </h5>
                  
                  <span
                    className={`badge order-status ${
                      orderStatus?.toLowerCase().includes("đã") ? "bg-success" : "bg-warning text-dark"
                    }`}
                  >
                    {orderStatus || "Chưa cập nhật"}
                  </span>
                </div>

                <div className="order-details d-flex flex-wrap gap-3 mb-4">
                  <p>
                    <strong>Ngày thanh toán:</strong>{" "}
                    {paymentDetails?.payDate
                      ? new Date(paymentDetails.payDate).toLocaleDateString("vi-VN")
                      : "Chưa thanh toán"}
                  </p>
                  <p>
                    <strong>Hình thức thanh toán:</strong> {paymentMethod || "Không rõ"}
                  </p>
                  <p>
                    <strong>Trạng thái thanh toán:</strong> {paymentStatus || "Chưa thanh toán"}
                  </p>
                  <p>
                    <strong>Phí vận chuyển:</strong>{" "}
                    {(deliveryFee ?? 0).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                  <p>
                    <strong>Tổng tiền:</strong>{" "}
                    {(totalAmount ?? 0).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                </div>

                <h6 className="mb-3">Sản phẩm:</h6>
                {products.length === 0 ? (
                  <p>Không có sản phẩm</p>
                ) : (
                  <ul className="list-group products-list">
                    {products.map((item, index) => (
                      <li
                        className="list-group-item d-flex align-items-center product-item"
                        key={`${order.orderCode}-${item.product?._id}-${index}`}
                      >
                        <div className="product-img me-3">
                          <img
                            src={item?.product?.images?.[0]?.url || "images/main-banner.jpg"}
                            className="img-fluid rounded"
                            alt={item?.product?.alt || "main-banner"}
                            width={80}
                            height={80}
                          />
                        </div>
                        <div className="product-info flex-grow-1">
                          <strong>{item?.product?.title || "Sản phẩm không rõ"}</strong>
                          <div className="text-muted small">Số lượng: {item?.count || 0}</div>
                        </div>
                        <div className="product-price ms-auto fw-semibold">
                          {(item?.price ?? 0).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                <h6 className="mt-4 mb-2">Thông tin giao hàng:</h6>
                <div className="d-flex justify-content-between"> 
                  <div className="content">
                    <p className="mb-1 shipping-info">
                      <strong>{shippingAddress?.fullName || "Không rõ"}</strong> - {shippingAddress?.phone || "Không có SĐT"}
                    </p>
                    <p className="mb-0">
                      {[shippingAddress?.address, shippingAddress?.district, shippingAddress?.city, shippingAddress?.country]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                  
                   <Link to={`/order-complete/${order.orderCode}`} className="text-white button d-flex align-items-center">Xem chi tiết</Link>
                </div>
              </div>
            );
          })
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav aria-label="Page navigation" className="d-flex justify-content-center mt-4">
            <ul className="pagination">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(page - 1)}>
                  <FaChevronLeft style={{ color: 'black' }} />
                </button>
              </li>
              {[...Array(totalPages)].map((_, idx) => (
                <li key={idx} className={`page-item ${page === idx + 1 ? "active" : ""}`}>
                  <button className="page-link text-dark" onClick={() => handlePageChange(idx + 1)}>
                    {idx + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(page + 1)}>
                  <FaChevronRight style={{ color: 'black' }} />
                </button>
              </li>
            </ul>
          </nav>
        )}

        </Container>
      </div>
    </>
  );
};

export default UserOrdersPage;
