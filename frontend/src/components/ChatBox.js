import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
import { sendMessage, addUserMessage } from "../features/chatbot/chatbotSlice";
import { Link } from "react-router-dom";
import TypingEffect from "./TypingEffect";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";


const ChatBox = ({ onClose }) => {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector(state => state.chatbot);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null); 
  const [dimensions, setDimensions] = useState({ width: 350, height: 500 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  const startResizing = (direction, e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = dimensions.width;
    const startHeight = dimensions.height;

    const onMouseMove = (event) => {
      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction === "left" || direction === "top-left") {
        newWidth = startWidth - (event.clientX - startX);
      }
      if (direction === "top" || direction === "top-left") {
        newHeight = startHeight - (event.clientY - startY);
      }

      // Ràng buộc kích thước tối thiểu
      newWidth = Math.max(newWidth, 250);
      newHeight = Math.max(newHeight, 300);

      setDimensions({ width: newWidth, height: newHeight });
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };
  
  const handleSend = () => {
    if (!input.trim()) return;
    dispatch(addUserMessage(input.trim()));
    dispatch(sendMessage(input.trim()));
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); 
  return (
    <div
      className={`chatbox-container ${isFullscreen ? "fullscreen" : ""}`}
        style={{ width: isFullscreen ? "100vw" : dimensions.width, height: isFullscreen ? "100vh" : dimensions.height }}
      >

      <div className="resizer left" onMouseDown={(e) => startResizing("left", e)} />
      <div className="resizer top" onMouseDown={(e) => startResizing("top", e)} />
      <div className="resizer top-left" onMouseDown={(e) => startResizing("top-left", e)} />

      <div className="chatbox-header">
        <strong>tthieudev Bot - Chat AI</strong>
        <div className="d-flex align-items-center gap-1" > 
          <button
            type="button"
            className="btn-fullscreen"
            aria-label="Fullscreen"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <MdFullscreenExit size={18} /> : <MdFullscreen size={18} />}
          </button>

          <button type="button" className="btn-close " aria-label="Close" onClick={onClose}>
            <AiOutlineClose size={18} />
          </button>
        </div>
      </div>
      <div className="chatbox-messages position-relative">
      {messages?.map((msg) => (
        <div key={msg.id} className={`chatbox-message ${msg.role}`}>
          <div className="chatbox-bubble">
            {msg.type === "text" && <TypingEffect text={msg.content} speed={20} />}
            {msg.type === "summary" && <div dangerouslySetInnerHTML={{ __html: msg.content }} />}
            {msg.type === "products" && (
              <div className="chatbox-products">
                {msg.content && msg.content.length > 0 ? (
                  msg.content.map(product => (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      className="chatbox-product-item d-flex align-items-center p-2 border rounded shadow-sm text-decoration-none"
                    >
                      {product.images?.[0]?.url && (
                        <img
                          src={product.images[0].url}
                          alt={product.title}
                          style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 6 }}
                        />
                      )}
                      <div className="flex-grow-1 ms-3">
                        <p className="mb-1 fw-semibold text-dark">{product.title}</p>
                        <p className="mb-0 text-danger">Giá: {product.price.toLocaleString()}₫</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <>
                    <TypingEffect text={"Bạn hãy nhập tên sản phẩm, tôi sẽ tìm và giúp bạn.."} speed={20} /> 
                  </>
                )}
              </div>
            )}
            {msg.type === "suggestions" && (
              <div className="chatbox-suggestions">
                {msg.content && msg.content.length > 0 ? (
                  msg.content.map(item => (
                    <Link
                      key={item._id}
                      to={`/product/${item._id}`}
                      className="chatbox-suggestion-item border rounded p-2 bg-light shadow-sm d-flex text-decoration-none gap-3"
                    >
                      {item.images?.[0]?.url && (
                        <img
                          src={item.images[0].url}
                          alt={item.title}
                          style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 6 }}
                        />
                      )}
                      <div className="flex-grow-1 ms-3">
                        <p className="mb-1 fw-semibold text-dark">{item.title}</p>
                        <p className="mb-0 text-danger">Giá: {item.price.toLocaleString()}₫</p>
                        {item.tags?.length > 0 && (
                          <p className="mb-0 text-muted">Tags: {item.tags.join(", ")}</p>
                        )}
                      </div>
                    </Link>
                  ))
                ) : (
                  <>
                    <TypingEffect text={"Hiện tại không có sản phẩm nào trong khoảng giá đó."} speed={20} />
                  </>
                )}
              </div>
            )}
            {msg.type === "order_info" && (
              <div className="chatbox-orders">
              {msg.content ? (
                (() => {
                  const order = msg.content;
                  if (!order || typeof order !== "object") return null; 
                  return (
                    <div className="chatbox-order-item border rounded p-3 mb-3 shadow-sm bg-light">
                      <p className="fw-bold mb-1">Đơn hàng: #{order.orderCode || "N/A"}</p>
                      <p className="mb-1 text-danger">
                        Tổng tiền: {order.totalAmount ? order.totalAmount.toLocaleString() + "₫" : "Không rõ"}
                        {order.paymentMethod ? ` (${order.paymentMethod} - ${order.paymentStatus || "?"})` : ""}
                      </p>
                      <p className="mb-1">Trạng thái: <strong>{order.orderStatus || "Không rõ"}</strong></p>
                      <p className="mb-2">Ngày đặt: {order.createdAt ? new Date(order.createdAt).toLocaleString() : "Không rõ"}</p>
                      <p className="mb-2">Sản phẩm:</p>
                      <ul className="mb-2">
                        {order.items?.length > 0 ? order.items.map((item, idx) => (
                          <li key={idx}>
                            {item.count} x {item.title}{" "}
                            <span style={{ color: item.color }}>{item.color}</span> -{" "}
                            {item.price ? item.price.toLocaleString() + "₫" : "?"}
                          </li>
                        )) : <li>Không có sản phẩm</li>}
                      </ul>
                      <p className="mb-0">
                        Giao tới: {order.shippingAddress?.fullName}, {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.country} - SĐT: {order.shippingAddress?.phone}
                      </p>
                    </div>
                  );
                })()
              ) : (
                <TypingEffect text="Không tìm thấy đơn hàng nào." speed={20} />
              )}

              </div>
            )}

            {msg.type === "keyword" && (
              <>
                <h6 className="fw-bold">Từ khóa tìm kiếm:</h6>
                <p className="text-primary">{msg.content}</p>
              </>
            )}
          </div>
        </div>
      ))}
        {loading && (
          <div className="chatbox-message bot">
            <div className="chatbox-bubble">
              <p className="loading-text"> 
                <span className="loading-dot dot1">.</span>
                <span className="loading-dot dot2">.</span>
                <span className="loading-dot dot3">.</span>
              </p>
            </div>
          </div>
        )}


        <div ref={messagesEndRef} />
      </div>
      <div className="chatbox-input">
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={loading}
          autoFocus
        />
        <button onClick={handleSend} className="send-button" disabled={loading}>
          <IoSend size={16} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
