require("dotenv").config({ path: "../.env" });
const fetch = require("node-fetch");

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  console.log("GEMINI_API_KEY:", apiKey);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ]
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Gemini API error response:", errorText);
    throw new Error(`Gemini API error: ${res.status}`);
  }

  const data = await res.json();

  // Kiểm tra và lấy nội dung trả về đúng theo cấu trúc response của Gemini API
  if (!data.candidates || data.candidates.length === 0) {
    throw new Error("Không có kết quả trả về từ Gemini API");
  }

  return data.candidates[0].content;
}

module.exports = { callGemini };
