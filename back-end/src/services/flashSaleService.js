const FlashSale = require("../models/FlashSale");
const Product = require("../models/Product");

async function getActiveFlashSales() {
  const now = new Date();
  return await FlashSale.find({
      start_date: { $lte: now },
      end_date: { $gte: now },
      status: true
  }).populate('product_id').sort({ discount_percent: -1 }).limit(10);
}

// Hàm validate chung cho cả Create và Update
async function validateQuantity(productId, saleQuantity) {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Sản phẩm không tồn tại");
    if (saleQuantity > product.quantity) {
        throw new Error(`Số lượng Sale (${saleQuantity}) không được lớn hơn tồn kho (${product.quantity})`);
    }
}

async function createFlashSale(data) {
    // 1. Check tồn kho trước khi tạo
    await validateQuantity(data.product_id, data.quantity);
    
    // 2. Tạo mới
    const newSale = new FlashSale(data);
    await newSale.save();
    return newSale;
}

// --- Update ---
async function updateFlashSale(id, data) {
    // Check tồn kho nếu có sửa số lượng
    if (data.quantity && data.product_id) {
        await validateQuantity(data.product_id, data.quantity);
    }
    
    const updatedSale = await FlashSale.findByIdAndUpdate(id, data, { new: true });
    if (!updatedSale) throw new Error("Không tìm thấy chiến dịch để cập nhật");
    return updatedSale;
}

// --- Delete ---
async function deleteFlashSale(id) {
    const deleted = await FlashSale.findByIdAndDelete(id);
    if (!deleted) throw new Error("Không tìm thấy chiến dịch để xóa");
    return deleted;
}

module.exports = {
    getActiveFlashSales,
    createFlashSale,
    updateFlashSale,
    deleteFlashSale
};