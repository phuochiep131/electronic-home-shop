const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    category_name: {
        type: String,
        required: true,
        trim: true,
    }
}, {
    timestamps: true, // Tự động thêm createdAt và updatedAt
});

module.exports = mongoose.model('Category', CategorySchema);