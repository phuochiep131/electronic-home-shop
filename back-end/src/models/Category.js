const mongoose = require("mongoose");
const slugify = require("slugify"); // Gợi ý cài thêm: npm install slugify

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  slug: {
    type: String,
    unique: true,
    index: true,
  },
  description: { type: String },
  image: { type: String }, // URL ảnh đại diện cho danh mục

  // Quan trọng: Để làm danh mục đa cấp (Cha - Con)
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },

  is_active: { type: Boolean, default: true }, // Ẩn/Hiện danh mục
  created_at: { type: Date, default: Date.now },
});

// Middleware: Tự động tạo slug từ name trước khi lưu
// VD: "Đồ Gia Dụng" -> "do-gia-dung"
categorySchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);
