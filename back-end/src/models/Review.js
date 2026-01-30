const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    is_purchased: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

ReviewSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

module.exports = mongoose.model("Review", ReviewSchema);
