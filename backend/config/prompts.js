const GENERAL_INFO_TEXT = `
    Thanh toán
    - Có hỗ trợ trả góp 0% lãi suất.
    - Thanh toán qua thẻ Visa, Mastercard đều được.

    Vận chuyển
    - Giao hàng toàn quốc nhanh chóng.
    - Phí ship tùy khu vực, thường từ 20k đến 50k.

    Bảo hành & đổi trả
    - Bảo hành chính hãng 12 tháng.
    - Đổi trả trong 7 ngày nếu lỗi từ nhà sản xuất.

    Dịch vụ khác
    - Có thu cũ đổi mới với giá tốt.
    - Dán cường lực miễn phí khi mua máy.

    Liên hệ & hỗ trợ
    - Địa chỉ: Hà Nội (cụ thể liên hệ để được hướng dẫn).
    - Số điện thoại: 0123 456 789.
    - Giờ mở cửa: 9h - 21h hàng ngày.
`;
function createTypePrompt(userInput) {
  return `
    Phân tích câu sau và CHỈ TRẢ VỀ JSON:

    - Lời chào, trò chuyện chung                           
      { "type": "base" }

    - Hỏi thông tin sản phẩm                                
      { "type": "product", "keyword": "<tên sản phẩm>" }

    - Gợi ý theo số tiền                                    
      { "type": "suggest", "price": <số tiền> }

    - Thông tin chung về chính sách, hỗ trợ mua hàng        
      { "type": "general_info" }

    - Hỏi trạng thái đơn hàng theo mã (bắt đầu bằng ORD)    
      { "type": "find_order", "orderCode": "<mã đơn hàng>" }

    - Hỏi xem có đơn hàng nào gần đây không                 
      { "type": "find_order_near" }

    Không trả lời gì khác ngoài JSON.

    Câu: "${userInput}"
  `;
}

// - Hỏi về tình trạng tồn kho / còn hàng không            
// { "type": "stock_check", "keyword": "<tên sản phẩm>" }

// - Hỏi về chương trình khuyến mãi, mã giảm giá           
// { "type": "promotion_info" }

// - Yêu cầu tư vấn lựa chọn (chưa rõ nhu cầu)             
// { "type": "consult" }

function createSummaryPrompt(productList) {
  const productInfo = productList.map(p => `- ${p.title}: ${p.description}`).join("\n");
  return `
    Dưới đây là danh sách sản phẩm:
    ${productInfo}

    Nếu không có danh sách sản phẩm hãy trả lời là không có sản phẩm nào phù hợp.
    Tóm tắt lại thông tin trong khoảng 5 câu.Nên mua gì nhất trong số này?
    Chỉ trả về nội dung tóm tắt, không trả về JSON.
    `;
}

function createChatPrompt(userInput) {
  return `
    Bạn là trợ lý AI thân thiện. Hãy trả lời người dùng một cách ngắn gọn, tự nhiên và thân thiện. 5 câu là đủ.
    Nếu câu hỏi không liên quan đến sản phẩm, hãy trả lời như một người bạn. Nếu câu hỏi liên quan đến sản phẩm, hãy trả lời như một nhân viên bán hàng.

    Câu hỏi: "${userInput}"
    `;
}

function createGeneralInfoPrompt(userInput) {
  return `
    Bạn là trợ lý bán hàng, dựa trên thông tin chính sách và hỗ trợ mua hàng sau đây, hãy trả lời ngắn gọn, chính xác câu hỏi của khách hàng:

    ${GENERAL_INFO_TEXT}

    Câu hỏi: "${userInput}"
    Chỉ trả lời nội dung, không cần JSON.
`;
}
function createOrderSummaryPrompt(order) {
  const itemsList = order.products.map((item, i) => {
    const productName = item.product?.title || "Sản phẩm chưa rõ";
    const colorName = item.color?.title ? ` - Màu: ${item.color.title}` : "";
    const itemPrice = item.price?.toLocaleString("vi-VN") || "0";
    return `${i + 1}. ${productName}${colorName} - SL: ${item.count} - Giá: ${itemPrice}đ`;
  }).join("\n");

  const totalFormatted = order.totalAmount.toLocaleString("vi-VN");
  const discountAmount = order.totalAfterDiscount
    ? (order.totalAmount - order.totalAfterDiscount).toLocaleString("vi-VN") + "đ"
    : "Không có";

  const address = order.shippingAddress
    ? `${order.shippingAddress.fullName}, ${order.shippingAddress.phone}, ${order.shippingAddress.address}`
    : "Không có thông tin giao hàng";

  return `
    Đơn hàng #${order.orderCode}
    - Trạng thái: ${order.orderStatus}
    - Thanh toán: ${order.paymentMethod} (${order.paymentStatus})
    - Tổng tiền: ${totalFormatted}đ
    - Giảm giá: ${discountAmount}
    - Giao tới: ${address}

    Danh sách sản phẩm:
    ${itemsList}

    Vui lòng tóm tắt đơn hàng một cách ngắn gọn, dễ hiểu cho khách hàng.
      `.trim();
}


module.exports = {
  createTypePrompt,
  createSummaryPrompt,
  createChatPrompt,
  createGeneralInfoPrompt,
  createOrderSummaryPrompt
};
