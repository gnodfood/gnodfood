import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client to prevent crashes if key is initially absent
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// AI Recipe API
app.post("/api/ai-recipe", async (req, res) => {
  try {
    const { product, occasion, taste } = req.body;
    if (!product) {
      res.status(400).json({ error: "Vui lòng chọn sản phẩm hải sản khô." });
      return;
    }

    const ai = getGeminiClient();

    const Prompt = `Bạn là một Đầu bếp chuyên nghiệp (Chef AI) của Gnod Food - thương hiệu khô hải sản thượng hạng, tối giản, tinh tế của Việt Nam.
Hãy thiết kế một công thức ẩm thực độc đáo, chi tiết hoặc một gợi ý bàn tiệc/món quà sang trọng sử dụng sản phẩm: "${product}".
- Mục đích / Dịp sử dụng: "${occasion || "Không giới hạn"}"
- Khẩu vị mong muốn: "${taste || "Truyền thống thuần khiết"}"

Vui lòng phản hồi hoàn toàn bằng Tiếng Việt thân thiện, trang trọng, đậm chất chuyên gia ẩm thực cao cấp, bao gồm các phần chính sau:
1. **Tên Món Ăn Sáng Tạo & Đẳng Cấp** (Do bạn tự nghĩ ra, hấp dẫn và sang trọng)
2. **Ý Tưởng & Hương Vị**: Giải thích sự hài hòa giữa sản phẩm và khẩu vị mục tiêu (2-3 câu).
3. **Danh Sách Nguyên Liệu Phụ Đi Kèm**: Các phụ gia, nước chấm, đồ nhắm kèm theo để tôn vinh vị khô.
4. **Các Bước Thực Hiện / Chế Biến Chi Tiết**: Các bước chế biến nhanh chóng nhưng tinh tế (áp chảo, nướng cồn, làm nộm/gỏi, sốt bơ tỏi, v.v.).
5. **Gợi Ý Thức Uống Đi Kèm (Pairing Guide)**: Bia craft, rượu vang trắng, trà hoa cúc dừa, hay nước ép trái cây để nâng tầm món ăn.

Hãy trình bày rõ ràng, sử dụng Markdown, khoảng cách dòng thoáng và ngôn từ tinh tế quyến rũ người đọc. Hãy giữ tinh thần thương hiệu Gnod Food: Khô thượng hạng, sạch sẽ, không bột ngọt dồi dào, giữ nguyên vị ngọt tự nhiên của biển cả.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: Prompt,
      config: {
        temperature: 0.8,
      },
    });

    const resultText = response.text || "Xin lỗi, không có gợi ý nào được tạo ra.";
    res.json({ recipe: resultText });
  } catch (error: any) {
    console.error("AI Recipe Error:", error);
    res.status(500).json({
      error: "Không thể kết nối với Chef AI vào lúc này. " + (error.message || ""),
    });
  }
});

// AI Chatbot API
app.post("/api/chatbot", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "Yêu cầu có danh sách tin nhắn." });
      return;
    }

    const ai = getGeminiClient();

    // Map messages to Gemini API format (role: user/model)
    const contents = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const systemInstruction = `Bạn là Trợ lý Ảo Thông Minh Gnod Food (Gnod AI Chatbot) - Thương hiệu Khô Hải Sản Sạch Thượng Hạng hàng đầu tại Việt Nam.

Hệ thống sản phẩm chính của Gnod Food gồm có:
1. Mực Khô Vỉa Cát Phú Quốc: Mực xẻ sấy nhiệt sạch cát từ đảo Ngọc, ngọt thơm đậm đà, không tanh bụi bẩn bè nổi.
2. Khô Cá Đuối Nghệ Sụn: Làm từ loài đuối nghệ sụn mềm ngọt xắt mỏng vừa vặn, ăn kèm xốt mắm me gia truyền dẻo kẹo cay cay chua ngọt đặc trưng.
3. Tôm Đất Cà Mau Sấy Đất Mũi: Tôm đất thiên nhiên mẩy ngọt sấy giữ độ ẩm mềm lý tưởng mọng ngọt không khô cứng.

Triết lý thương hiệu:
- "SẠCH CỰC ĐOAN - 4 KHÔNG":
  1. Không phẩm màu, hóa chất nhuộm màu.
  2. Không chất bảo quản tổng hợp cực đoan gây hại.
  3. Không phụ gia tạo ngọt hóa học (không bột ngọt dồi dào, ngọt từ hải sản tự nhiên).
  4. Không phơi xả bừa bãi bụi bẩn côn trùng.
- Quy cách đóng gói tinh tế: Đóng hũ tròn PET sạch sẽ sang trọng hoặc túi chân không tối giản làm quà tặng chữ TÂM.
- Phong vị ẩm thực: Nhạt muối, tự nhiên, thích hợp ăn vui, nhậu lành mạnh kết nối bè bạn gia đình.

Chính sách & dịch vụ nổi bật:
- CHÍNH SÁCH VÀNG 7 NGÀY: Bao đổi trả hoàn tiền 100% nếu khách không ưng ý, mốc, hôi dầu hoặc vỡ hũ khi vận chuyển.
- GIAO HỎA TỐC 2H: Phục vụ nhanh tại các khu vực nội thành Trung tâm TP. Hồ Chí Minh và TP. Vũng Tàu.
- Hỗ trợ giao hàng toàn quốc đồng kiểm trước khi nhận.

Tuyển dụng nổi bật:
- Trưởng Phòng Phân Phối (Mức lương 20 - 35 triệu VNĐ/tháng + Thưởng doanh số).

Liên hệ:
- Email đối tác sỉ: partner@gnodfood.vn
- Có form hỗ trợ phản hồi và ứng tuyển trực tiếp ngay trên trang mạng này.

Quy tắc giao tiếp của chatbot:
- Xưng hô lịch thiệp, ấm áp, nhã nhặn, mang đậm tinh thần của sản phẩm quà tặng tinh hoa bờ biển Việt.
- Sử dụng tiếng Việt chuẩn. Trả lời súc tích, ngắn gọn, có cấu trúc rõ ràng với các gạch đầu dòng hoặc in đậm để dễ đọc.
- Tuyệt đối không tự bịa ra thông tin sai lý lịch hoặc giá cả ngoài các chi tiết trên.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "Dạ, tôi chưa kịp hiểu ý bạn. Bạn có thể hỏi lại được không ạ?";
    res.json({ reply });
  } catch (error: any) {
    console.error("Chatbot API Error:", error);
    res.status(500).json({
      error: "Không thể kết nối với Gnod AI vào lúc này. " + (error.message || ""),
    });
  }
});

// Mock Application / Contact form endpoint to show functional integration
app.post("/api/contact", (req, res) => {
  const { name, phone, email, message, interest } = req.body;
  if (!name || !phone) {
    res.status(400).json({ error: "Họ tên và Số điện thoại là trường bắt buộc." });
    return;
  }
  // Store or process contact here
  console.log(`[Contact Registered] Name: ${name}, Phone: ${phone}, Email: ${email}, Message: ${message}, Interest: ${interest}`);
  res.json({
    success: true,
    message: `Cảm ơn ${name}! Yêu cầu của bạn về "${interest || "Tư vấn sản phẩm"}" đã được ghi nhận. Đội ngũ Gnod Food sẽ liên hệ lại ngay qua số ${phone}.`,
  });
});

// Setup Vite Dev server or Serve Static dist
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Gnod Food running on http://localhost:${PORT}`);
  });
}

initServer().catch((err) => {
  console.error("Failed to start server:", err);
});
