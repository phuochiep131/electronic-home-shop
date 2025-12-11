const mongoose = require("mongoose");
const slugify = require("slugify");

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
  image: { type: String },

  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
});

categorySchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);
