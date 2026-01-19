const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FlashSaleSchema = new Schema({
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, // Liên kết tới sản phẩm
    discount_percent: { type: Number, required: true }, // Phần trăm giảm riêng cho đợt này
    sale_price: { type: Number },
    quantity: { type: Number, required: true }, // Số lượng dành riêng cho Flash Sale (ví dụ kho có 100, nhưng chỉ sale 10 cái)
    sold: { type: Number, default: 0 }, // Số lượng đã bán trong đợt sale này
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    status: { type: Boolean, default: true } // Có đang bật hay tắt
}, {
    timestamps: true,
});

module.exports = mongoose.model('FlashSale', FlashSaleSchema);