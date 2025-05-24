const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const Fuse = require("fuse.js");
const { callGemini } = require("../config/chatbotConfig.js");
const Order = require("../models/orderModel"); 

const {
  createTypePrompt,
  createSummaryPrompt,
  createChatPrompt,
  createGeneralInfoPrompt,
  createOrderSummaryPrompt
} = require("../config/prompts.js");

const MAX_INPUT_LENGTH = 5000;

const handleChat = asyncHandler(async (req, res) => {
  let { userInput } = req.body; 
  if (typeof userInput !== "string" || userInput.trim() === "") {
    return res.json({
      status: "error",
      message: "Vui lòng gửi câu hỏi hợp lệ."
    });
  }
  userInput = userInput.trim();

  if (userInput.length > MAX_INPUT_LENGTH) {
    return res.json({
      status: "error",
      message: `Câu hỏi quá dài, tối đa ${MAX_INPUT_LENGTH} ký tự.`
    });
  }

  let responseText;
  try {
    const typePrompt = createTypePrompt(userInput);
    responseText = await callGemini(typePrompt);
  } catch {
    return res.json({
      status: "error",
      message: "Lỗi hệ thống, vui lòng thử lại sau."
    });
  } 
  let rawText = "";
  if (
    responseText &&
    responseText.parts &&
    Array.isArray(responseText.parts) &&
    responseText.parts[0].text
  ) {
    rawText = responseText.parts[0].text;
  }

  if (typeof rawText !== "string" || rawText.trim() === "") {
    return res.json({
      status: "error",
      message: "Không nhận được phản hồi từ hệ thống."
    });
  }

  const cleanedText = rawText.replace(/```[a-z]*\n?([\s\S]*?)```/, "$1").trim(); 
  
  let parsed;
  try {
    parsed = JSON.parse(cleanedText);
  } catch (err) {
    console.error("JSON parse error:", err, cleanedText);
    return res.json({
      status: "error",
      message: "Không phân tích được nội dung người dùng."
    });
  }
  console.log("parsed", parsed);
  
  try {
    if (parsed.type === "product" && typeof parsed.keyword === "string") {
      let products = []; 
      
      const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escapeRegex(parsed.keyword), "i");

      try {
        products = await Product.find({
          title: { $regex: regex }
        }).limit(5);
      } catch {
        return res.json({
          status: "error",
          message: "Lỗi truy vấn dữ liệu sản phẩm."
        });
      }

      if (!products.length) {
        let allProducts = [];
        try {
          allProducts = await Product.find().lean();
        } catch {
          return res.json({
            status: "error",
            message: "Lỗi truy vấn dữ liệu sản phẩm."
          });
        }

        const fuse = new Fuse(allProducts, {
          keys: ['title'],
          threshold: 0.3,
          includeScore: true
        });

        const result = fuse.search(userInput).slice(0, 5);
        products = result.map(r => r.item);
      }

      if (!products.length) {
        return res.json({
          status: "success",
          data: {
            type: "product",
            message: "Không tìm thấy sản phẩm phù hợp. Bạn muốn hỏi sản phẩm khác không?"
          }
        });
      }

      let summary;
      try {
        const summaryPrompt = createSummaryPrompt(products);
        summary = await callGemini(summaryPrompt);
      } catch {
        summary = "Không thể tóm tắt sản phẩm lúc này.";
      }

      return res.json({
        status: "success",
        data: {
          type: "product",
          keyword: userInput,
          products,
          summary,
        }
      });
    }

    if (parsed.type === "suggest") {
      if (typeof parsed.price !== "number" || isNaN(parsed.price)) {
        return res.json({
          status: "error",
          message: "Giá tiền không hợp lệ trong yêu cầu gợi ý."
        });
      }

      const margin = 1_000_000;
      const price = parsed.price;

      let products;
      try {
        products = await Product.find({
          price: {
            $gte: price - margin,
            $lte: price + margin
          },
        }).sort({ price: 1 }).limit(5);
      } catch {
        return res.json({
          status: "error",
          message: "Lỗi truy vấn dữ liệu sản phẩm gợi ý."
        });
      }

      let summary;
      try {
        const summaryPrompt = createSummaryPrompt(products);
        summary = await callGemini(summaryPrompt);
      } catch {
        summary = "Không thể tóm tắt sản phẩm lúc này.";
      }

      return res.json({
        status: "success",
        data: {
          type: "suggest",
          budget: price,
          suggestions: products,
          summary,
        }
      });
    }

    if (parsed.type === "general_info") {
      const generalInfoPrompt = createGeneralInfoPrompt(userInput);
      let reply;
      try {
        reply = await callGemini(generalInfoPrompt);
      } catch {
        reply = "Xin lỗi, mình không thể trả lời câu hỏi chính sách lúc này.";
      }

      return res.json({
        status: "success",
        data: {
          type: "general_info",
          message: reply,
        }
      });
    }

    if (parsed.type === "find_order") {
      if (!parsed.orderCode?.startsWith("ORD")) {
        return res.json({
          status: "error",
          data: {
            type: "find_order",
            message: "Mã đơn hàng không hợp lệ.",
          },
        });
      }
    
      const order = await Order.findOne({ orderCode: parsed.orderCode })
        .populate("products.product", "title")
        .populate("products.color", "title")
        .populate("orderBy", "firstname lastname email");
    
      if (!order) {
        return res.json({
          status: "error",
          data: {
            type: "find_order",
            message: "Không tìm thấy đơn hàng. Bạn hãy kiểm tra lại mã code của đơn hàng.",
          },
        });
      }
    
      let summary = "";
      try {
        const prompt = createOrderSummaryPrompt(order);
        summary = await callGemini(prompt);
      } catch {
        summary = "Không thể tóm tắt đơn hàng lúc này.";
      }
    
      return res.json({
        status: "success",
        data: {
          type: "find_order",
          order,
          summary,
        },
      });
    }
    if (parsed.type === "find_order_near") {
      if (!req.user) {
        return res.status(200).json({
          status: "error",
          data: {
            type: "find_order_near",
            message: "Bạn cần đăng nhập để xem đơn hàng gần đây.",
          },
        });
      }

      const userId = req.user._id;
      const latestOrder = await Order.findOne({ orderBy: userId })
        .sort({ createdAt: -1 })
        .populate("products.product", "title")
        .populate("products.color", "title");

      if (!latestOrder) {
        return res.json({
          status: "error",
          data: {
            type: "find_order_near",
            message: "Bạn chưa có đơn hàng nào gần đây.",
          },
        });
      }

      let summary = "";
      try {
        const prompt = createOrderSummaryPrompt(latestOrder);
        summary = await callGemini(prompt);
      } catch {
        summary = "Không thể tóm tắt đơn hàng gần đây.";
      }

      return res.json({
        status: "success",
        data: {
          type: "find_order_near",
          order: latestOrder,
          summary,
        },
      });
    }
    
    if (parsed.type === "stock_check") {
      if (!parsed.keyword) {
        return res.json({
          status: "error",
          data: {
            type: "stock_check",
            message: "Không có tên sản phẩm để kiểm tra tồn kho.",
          },
        });
      }
    
      const product = await Product.findOne({
        name: { $regex: parsed.keyword, $options: "i" },
      });
    
      if (!product) {
        return res.json({
          status: "error",
          data: {
            type: "stock_check",
            message: "Không tìm thấy sản phẩm.",
          },
        });
      }
    
      return res.json({
        status: "success",
        data: {
          type: "stock_check",
          product: {
            name: product.name,
            inStock: product.stock > 0,
            stock: product.stock,
          },
        },
      });
    }
    
    if (parsed.type === "promotion_info") {
      const promoPrompt = createPromoPrompt(userInput);
      let reply;
      try {
        reply = await callGemini(promoPrompt);
      } catch {
        reply = "Hiện tại không thể lấy thông tin khuyến mãi.";
      }
    
      return res.json({
        status: "success",
        data: {
          type: "promotion_info",
          message: reply,
        },
      });
    }
    
    if (parsed.type === "consult") {
      const consultPrompt = createConsultPrompt(userInput);
      let reply;
      try {
        reply = await callGemini(consultPrompt);
      } catch {
        reply = "Chưa thể tư vấn lựa chọn ngay lúc này.";
      }
    
      return res.json({
        status: "success",
        data: {
          type: "consult",
          message: reply,
        },
      });
    }
    
    if (parsed.type === "base") {
      const chatPrompt = createChatPrompt(userInput);
      let reply;
      try {
        reply = await callGemini(chatPrompt);
      } catch {
        reply = "Xin lỗi, mình chưa thể trả lời câu hỏi này.";
      }

      return res.json({
        status: "success",
        data: {
          type: "base",
          message: reply,
        }
      });
    }

    return res.json({
      status: "success",
      data: {
        type: "unknown",
        message: "Mình chưa hiểu câu hỏi của bạn, bạn có thể nói rõ hơn không?",
      }
    });
  } catch {
    return res.json({
      status: "error",
      message: "Lỗi hệ thống, vui lòng thử lại sau."
    });
  }
});

module.exports = {
  handleChat
};
