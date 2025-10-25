const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    order_date: { type: Date, default: Date.now },
    total_amount: { type: Number, required: true },
    shipping_address: { type: String, required: true },
    order_status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    note: { type: String },
    discount_amount: { type: Number, default: 0 },
    payment_id: { type: Schema.Types.ObjectId, ref: 'Payment' },
    shipping_id: { type: Schema.Types.ObjectId, ref: 'Shipping' },
}, {
    timestamps: { createdAt: false, updatedAt: 'updated_at' },
});

module.exports = mongoose.model('Order', OrderSchema);