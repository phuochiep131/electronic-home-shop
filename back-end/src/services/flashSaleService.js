const FlashSale = require("../models/FlashSale");
const Product = require("../models/Product");

// --- 1. Dành cho ADMIN (Dashboard) ---
// Lấy tất cả, không lọc ngày tháng, sắp xếp cái mới tạo lên đầu
async function getAllFlashSales() {
  return await FlashSale.find()
    .populate("product_id") // Quan trọng: Phải populate để hiện tên/ảnh sản phẩm
    .sort({ createdAt: -1 });
}

// --- 2. Dành cho CLIENT (Trang chủ/User) ---
// Chỉ lấy cái đang chạy và còn active
async function getActiveFlashSales() {
  const now = new Date();
  return await FlashSale.find({
    start_date: { $lte: now }, // Đã bắt đầu
    end_date: { $gte: now }, // Chưa kết thúc
    status: true, // Đang kích hoạt
  })
    .populate("product_id")
    .sort({ discount_percent: -1 })
    .limit(10);
}

// Hàm validate
async function validateFlashSaleData(data) {
  // Check 1: Ngày tháng (Backend cũng phải check, không chỉ tin Frontend)
  if (new Date(data.start_date) >= new Date(data.end_date)) {
    throw new Error("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc");
  }

  // Check 2: Sản phẩm và Tồn kho
  if (data.product_id) {
    const product = await Product.findById(data.product_id);
    if (!product) throw new Error("Sản phẩm không tồn tại");

    // Lưu ý: Nếu product của bạn có biến thể (sizes/colors), logic này cần điều chỉnh
    // Hiện tại đang giả định product.quantity là tổng tồn kho
    if (data.quantity && data.quantity > product.quantity) {
      throw new Error(
        `Số lượng Sale (${data.quantity}) lớn hơn tồn kho thực tế (${product.quantity})`,
      );
    }
  }
}

async function createFlashSale(data) {
  await validateFlashSaleData(data);

  const newSale = new FlashSale(data);
  const savedSale = await newSale.save();

  // Populate ngay sau khi tạo để trả về Frontend hiển thị luôn
  return await savedSale.populate("product_id");
}

async function updateFlashSale(id, data) {
  await validateFlashSaleData(data);

  // Thêm .populate vào đây để sau khi update, frontend nhận được object product đầy đủ
  const updatedSale = await FlashSale.findByIdAndUpdate(id, data, {
    new: true,
  }).populate("product_id");

  if (!updatedSale) throw new Error("Không tìm thấy chiến dịch để cập nhật");
  return updatedSale;
}

async function deleteFlashSale(id) {
  const deleted = await FlashSale.findByIdAndDelete(id);
  if (!deleted) throw new Error("Không tìm thấy chiến dịch để xóa");
  return deleted;
}

module.exports = {
  getAllFlashSales, // Admin dùng cái này
  getActiveFlashSales, // User trang chủ dùng cái này
  createFlashSale,
  updateFlashSale,
  deleteFlashSale,
};
