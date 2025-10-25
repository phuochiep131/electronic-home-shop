const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShippingSchema = new Schema({
    order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    carrier: { type: String }, // Đơn vị vận chuyển
    tracking_number: { type: String },
    shipped_date: { type: Date },
    delivery_date: { type: Date },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
});

module.exports = mongoose.model('Shipping', ShippingSchema);