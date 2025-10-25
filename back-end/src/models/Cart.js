const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    // created_at được tự động tạo bởi timestamps
}, {
    timestamps: { createdAt: 'created_at', updatedAt: false },
});

module.exports = mongoose.model('Cart', CartSchema);