const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    payment_date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    payment_method: { type: String, required: true }, // Ví dụ: 'COD', 'Credit Card'
    payment_status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    },
});

module.exports = mongoose.model('Payment', PaymentSchema);