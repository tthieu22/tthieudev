import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { chatbotService } from "./chatbotServive";
import {handleOrderMessage } from "../../utils/chatbotFunction"
export const sendMessage = createAsyncThunk(
  "chatbot/send-message",
  async (userInput, thunkAPI) => {
    try {
      const response = await chatbotService.sendMessage(userInput);
      return response;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  messages: [
    { id: 'welcome-1', role: 'bot', type: 'text', content: 'Xin chào! Tôi là tthieu.dev botchat. Tôi có thể trả lời tất cả các câu hỏi hoặc tư vấn cho bạn các sản phẩm trong cửa hàng của chúng tôi, tình hình về đơn hàng hay giới thiệu sản phẩm tôi có thể làm được hết. Bạn chỉ cần yêu cầu. Tôi được tạo bởi tthieu.dev.' }
  ],
  loading: false,
  isError: false,
  isSuccess: false,
  message: "",
  budget: 0,
};

export const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    addUserMessage: (state, action) => { 
      state.messages.push({
        id: Date.now(),
        role: "user",
        type: "text",
        content: action.payload,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.isSuccess = true;

        const data = action.payload.data;
        if (!data) return;
 
        switch (data.type) {
          case "base":
          case "general_info":
            if (data.message && Array.isArray(data.message.parts)) {
              const text = data.message.parts.map((part) => part.text).join("");
              state.messages.push({
                id: Date.now(),
                role: "bot",
                type: "text",
                content: text,
              });
            }
            break;

          case "suggest":
            state.budget = data.budget || 0;
            if (data.summary && Array.isArray(data.summary.parts)) {
              const summaryText = data.summary.parts.map((part) => part.text).join("");
              state.messages.push({
                id: Date.now() + 1,
                role: "bot",
                type: "summary",
                content: summaryText,
              });
            }
            if (data.suggestions && data.suggestions.length > 0) {
              state.messages.push({
                id: Date.now() + 2,
                role: "bot",
                type: "suggestions",
                content: data.suggestions,
              });
            }
            break;

          case "product":
            if (data.keyword) {
              state.messages.push({
                id: Date.now() + 1,
                role: "bot",
                type: "keyword",
                content: data.keyword,
              });
            }
            if (data.summary && Array.isArray(data.summary.parts)) {
              const summaryText = data.summary.parts.map((part) => part.text).join("");
              state.messages.push({
                id: Date.now() + 2,
                role: "bot",
                type: "summary",
                content: summaryText,
              });
            }
            if (data.products && data.products.length > 0) {
              state.messages.push({
                id: Date.now() + 3,
                role: "bot",
                type: "products",
                content: data.products ,
              });
            } else if (data.message) { 
              state.messages.push({
                id: Date.now() + 4,
                role: "bot",
                type: "text",
                content: data.message,
              });
            }
            break; 
          case "find_order":
          case "find_order_near":
            handleOrderMessage(data, state);
            break;
              
          default:
            state.messages.push({
              id: Date.now() + 1,
              role: "bot",
              type: "text",
              content: "Xin lỗi, tôi không hiểu yêu cầu của bạn. Sản phẩm bạn tìm có thể chúng tôi không có. Vui lòng thử lại với từ khóa khác.",
            });
            break;
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || action.error.message;
      });
  },
});

export const { addUserMessage } = chatbotSlice.actions;
export default chatbotSlice.reducer;