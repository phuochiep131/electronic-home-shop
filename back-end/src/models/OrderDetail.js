const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderDetailSchema = new Schema({
    order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    unit_price: { type: Number, required: true }, // Giá của sản phẩm tại thời điểm đặt hàng
    subtotal: { type: Number, required: true },
});

module.exports = mongoose.model('OrderDetail', OrderDetailSchema);