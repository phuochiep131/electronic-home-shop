const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    product_name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    description: { type: String, trim: true },
    image_url: { type: String },
    quantity: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    size: { type: String },
    color: { type: String },
    material: { type: String },
    warranty: { type: String },
    origin: { type: String },
    average_rating: { type: Number, default: 0 },
    review_count: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Product", ProductSchema);
