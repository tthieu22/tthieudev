const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const Fuse = require("fuse.js");
const { callGemini } = require("../config/chatbotConfig.js");
const {
  createTypePrompt,
  createSummaryPrompt,
  createChatPrompt,
  createGeneralInfoPrompt
} = require("../config/prompts.js");

const MAX_INPUT_LENGTH = 500;

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

  try {
    if (parsed.type === "product") {
      let products = [];

      const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const fuzzyRegex = escapeRegex(userInput).split("").join(".*");

      try {
        products = await Product.find({
          title: {
            $regex: fuzzyRegex,
            $options: "i"
          }
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
