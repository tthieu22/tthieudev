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
    - Lời chào, trò chuyện chung       { "type": "base" }
    - Hỏi thông tin sản phẩm           { "type": "product" }
    - Gợi ý theo số tiền               { "type": "suggest", "price": <số tiền> }
    - Thông tin chung về chính sách, hỗ trợ mua hàng { "type": "general_info" }
    Không trả lời gì khác ngoài JSON.

    Câu: "${userInput}"
    `;
}

function createSummaryPrompt(productList) {
  const productInfo = productList.map(p => `- ${p.title}: ${p.description}`).join("\n");
  return `
    Dưới đây là danh sách sản phẩm:
    ${productInfo}

    Tóm tắt lại thông tin trong khoảng 5 câu.Nên mua gì nhất trong số này?
    Nếu không có sản phẩm hãy trả lời là không có sản phẩm nào phù hợp.
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

module.exports = {
  createTypePrompt,
  createSummaryPrompt,
  createChatPrompt,
  createGeneralInfoPrompt,
};
