const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  image_url: { type: String, required: true },
  title: { type: String },
  subtitle: { type: String },
  link_to: { type: String },
  order: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Banner", bannerSchema);
