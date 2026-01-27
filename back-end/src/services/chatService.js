const OpenAI = require("openai");
const Product = require("../models/Product");
const Category = require("../models/Category");
const FlashSale = require("../models/FlashSale");

// Khởi tạo OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Lưu trữ lịch sử chat theo sessionId
const chatHistory = {};

/**
 * Hàm lấy context (bối cảnh) dữ liệu sản phẩm để nạp cho AI
 */
async function getSystemContext() {
  const now = new Date();

  // 1. Lấy danh mục
  const categories = await Category.find({ is_active: true });
  const categoryNames = categories.map((c) => c.name).join(", ");

  // 2. Lấy Flash Sale đang hoạt động
  const activeFlashSales = await FlashSale.find({
    start_date: { $lte: now },
    end_date: { $gte: now },
    status: true,
  });

  // Tạo Map để tra cứu nhanh Flash Sale theo Product ID
  const saleMap = {};
  activeFlashSales.forEach((sale) => {
    // Chỉ tính nếu số lượng bán (sold) chưa vượt quá số lượng sale (quantity)
    if (sale.quantity > sale.sold) {
      saleMap[sale.product_id.toString()] = sale;
    }
  });

  // 3. Lấy sản phẩm (Lấy thêm các trường quan trọng cho đồ gia dụng: bảo hành, xuất xứ)
  const products = await Product.find()
    .select("_id product_name price description quantity category_id warranty origin material size color")
    .populate("category_id", "name");

  // 4. Ghép thông tin sản phẩm với Flash Sale
  const productText = products
    .map((p) => {
      const catName = p.category_id ? p.category_id.name : "Khác";
      
      // Xử lý thông tin đặc thù đồ gia dụng
      const warrantyInfo = p.warranty ? `| BH: ${p.warranty}` : "";
      const originInfo = p.origin ? `| Xuất xứ: ${p.origin}` : "";
      const specInfo = p.size ? `| Kích thước/Thông số: ${p.size}` : "";

      // Kiểm tra xem sản phẩm này có Flash Sale không
      const sale = saleMap[p._id.toString()];
      let saleInfo = "";
      let priceDisplay = `${p.price.toLocaleString("vi-VN")} VND`;

      if (sale) {
        // Tính giá sau giảm
        const finalPrice = sale.sale_price 
            ? sale.sale_price 
            : p.price * (1 - sale.discount_percent / 100);
        
        const remainingSaleQty = sale.quantity - sale.sold;

        saleInfo = ` | 🔥 ĐANG FLASH SALE: Giảm ${sale.discount_percent}% -> GIÁ SỐC: ${finalPrice.toLocaleString("vi-VN")} VND (Còn ${remainingSaleQty} suất)`;
        priceDisplay = `${p.price.toLocaleString("vi-VN")} VND (Giá gốc)`; 
      }

      // Format dòng thông tin gửi cho AI
      return `- ID: ${p._id} | Tên: ${p.product_name} | Danh mục: ${catName} | Giá: ${priceDisplay}${saleInfo} | Tồn kho: ${p.quantity} ${warrantyInfo} ${originInfo} ${specInfo}`;
    })
    .join("\n");

  return `
    Bạn là chuyên viên tư vấn kỹ thuật và bán hàng của "ELECTRO SHOP" - Hệ thống đồ điện gia dụng chính hãng.
    Phong cách: Lịch sự, chuyên nghiệp, am hiểu kỹ thuật nhưng giải thích dễ hiểu.
    Luôn gọi khách hàng bằng "Anh/chị" và xưng "Em".
    
    DƯỚI ĐÂY LÀ DỮ LIỆU SẢN PHẨM & KHUYẾN MÃI (Cập nhật lúc ${now.toLocaleString("vi-VN")}):
    ${productText}

    DANH SÁCH DANH MỤC: ${categoryNames}

    HƯỚNG DẪN TRẢ LỜI QUAN TRỌNG:
    1. ƯU TIÊN KHUYẾN MÃI: Nếu khách hỏi chung chung (ví dụ: "tư vấn máy giặt"), hãy giới thiệu các mẫu có "🔥 FLASH SALE" trước.
    2. LINK SẢN PHẨM: QUY TẮC TRẢ LỜI QUAN TRỌNG (BẮT BUỘC TUÂN THỦ)
       - TUYỆT ĐỐI KHÔNG dùng link dấu thăng (#) hoặc link giả.
       - BẮT BUỘC phải lấy mã "ID_SP" trong dữ liệu bên trên để tạo link theo đúng định dạng: [Tên sản phẩm](/product/ID_SP).
       - Ví dụ: Nếu ID_SP là "65a123...", link phải là: [Tên sản phẩm](/product/65a123...).
       Ví dụ: "Anh/chị tham khảo mẫu [Tủ lạnh LG Inverter](/product/65a1b...) này nhé, chạy rất êm ạ."
    3. TƯ VẤN KỸ THUẬT: Với đồ điện gia dụng, khách quan tâm đến: Bền bỉ, Tiết kiệm điện, Bảo hành và Xuất xứ. Hãy nhắc đến các thông tin này (có trong dữ liệu) để thuyết phục.
    4. GIÁ CẢ: Luôn hiển thị giá có định dạng (ví dụ: 1.200.000 VND).
    5. TỒN KHO: Nếu tồn kho = 0, phải báo hết hàng và gợi ý mẫu khác cùng danh mục.
    6. IMPERATIVE: Không được bịa đặt thông tin không có trong dữ liệu (ví dụ: không tự bịa chức năng AI nếu mô tả không ghi).
  `;
}

async function handleChat(sessionId, userMessage) {
  // 1. Khởi tạo lịch sử nếu chưa có
  if (!chatHistory[sessionId]) {
    chatHistory[sessionId] = [];
  }

  // 2. Lấy System Prompt 
  const systemPrompt = await getSystemContext();

  // 3. Chuẩn bị messages
  const messages = [
    { role: "system", content: systemPrompt },
    ...chatHistory[sessionId],
    { role: "user", content: userMessage },
  ];

  // 4. Gọi API OpenAI
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 0.5, // Giảm temperature để AI trả lời chính xác thông số kỹ thuật hơn
      max_tokens: 800,
    });

    const botResponse = completion.choices[0].message.content;

    // 5. Cập nhật lịch sử
    chatHistory[sessionId].push({ role: "user", content: userMessage });
    chatHistory[sessionId].push({ role: "assistant", content: botResponse });

    // Giới hạn lịch sử 10 tin gần nhất để tiết kiệm token
    if (chatHistory[sessionId].length > 10) {
      chatHistory[sessionId] = chatHistory[sessionId].slice(-10);
    }

    return botResponse;
  } catch (error) {
    console.error("OpenAI Error:", error);
    throw new Error("Lỗi kết nối AI");
  }
}

// Hàm xóa lịch sử
function clearHistory(sessionId) {
  delete chatHistory[sessionId];
  return { message: "Đã xóa lịch sử chat" };
}

module.exports = {
  handleChat,
  clearHistory,
};