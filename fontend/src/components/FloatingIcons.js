import React, { useState, useEffect, useCallback } from "react";
import { FaFacebookMessenger, FaArrowUp } from "react-icons/fa";
import ChatBox from "./ChatBox";
import { MdPayment } from "react-icons/md";
import { Link } from "react-router-dom";
const FloatingIcons = () => {
  const [showScroll, setShowScroll] = useState(false);
  const [showChatBox, setShowChatBox] = useState(false);

  const checkScrollTop = useCallback(() => {
    setShowScroll(window.pageYOffset > 300);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, [checkScrollTop]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="floating-icons">
        {/* Nút mua sắm */}
        <Link to={"/checkout"} className="icon shop" title="Mua sắm">
          <MdPayment />
        </Link>

        {/* Nút chat */}
        <button
          className="icon messenger"
          title="Chat"
          onClick={() => setShowChatBox(!showChatBox)}
        >
          <FaFacebookMessenger />
        </button>

        {/* Nút lên đầu trang */}
        {showScroll && (
          <button className="icon scroll-top" onClick={scrollToTop} title="Lên đầu trang">
            <FaArrowUp />
          </button>
        )}
      </div>

      {/* Hộp chat */}
      {showChatBox && <ChatBox onClose={() => setShowChatBox(false)} />}
    </>
  );
};

export default FloatingIcons;
