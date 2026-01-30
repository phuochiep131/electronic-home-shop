const Review = require("../models/Review");
const Order = require("../models/Order");
const OrderDetail = require("../models/OrderDetail");
const Product = require("../models/Product");

// 1. Kiểm tra xem user có quyền đánh giá sản phẩm này không
async function checkCanReview(userId, productId) {
  // Tìm tất cả đơn hàng của user có trạng thái là 'delivered'
  const deliveredOrders = await Order.find({
    user_id: userId,
    order_status: "delivered",
  }).select("_id");

  if (deliveredOrders.length === 0) return false;

  const orderIds = deliveredOrders.map((o) => o._id);

  // Kiểm tra xem trong các đơn đã giao, có chứa sản phẩm này không
  const hasPurchased = await OrderDetail.findOne({
    order_id: { $in: orderIds },
    product_id: productId,
  });

  return !!hasPurchased; // Trả về true nếu tìm thấy, false nếu không
}

// 2. Tạo đánh giá mới
async function createReview(userId, data) {
  const { product_id, rating, comment } = data;

  // Bước 1: Kiểm tra điều kiện "Đã mua và Đã giao hàng"
  const canReview = await checkCanReview(userId, product_id);
  if (!canReview) {
    throw new Error(
      "Bạn chỉ có thể đánh giá sản phẩm đã mua và được giao thành công.",
    );
  }

  // Bước 2: Kiểm tra xem đã đánh giá chưa (Tránh spam)
  const existingReview = await Review.findOne({ user_id: userId, product_id });
  if (existingReview) {
    throw new Error("Bạn đã đánh giá sản phẩm này rồi.");
  }

  // Bước 3: Tạo review
  const newReview = new Review({
    user_id: userId,
    product_id,
    rating,
    comment,
  });
  await newReview.save();

  // Bước 4: Cập nhật lại điểm trung bình cho Product
  await updateProductRating(product_id);

  return newReview;
}

// 3. Hàm phụ: Tính toán lại sao trung bình cho sản phẩm
async function updateProductRating(productId) {
  const stats = await Review.aggregate([
    { $match: { product_id: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$product_id",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      average_rating: stats[0].avgRating.toFixed(1), // Làm tròn 1 số thập phân
      review_count: stats[0].count,
    });
  }
}

// 4. Lấy danh sách đánh giá của 1 sản phẩm
async function getReviewsByProduct(productId) {
  return await Review.find({ product_id: productId })
    .populate("user_id", "fullname avatar") // Lấy tên và avatar người đánh giá
    .sort({ createdAt: -1 }); // Mới nhất lên đầu
}

// 5. Lấy tất cả đánh giá (Admin - có phân trang, filter)
async function getAllReviews(query) {
  const { page = 1, limit = 10, rating, search } = query;
  const skip = (page - 1) * limit;

  let filter = {};

  if (rating) {
    filter.rating = parseInt(rating);
  }

  if (search) {
    filter.comment = { $regex: search, $options: "i" };
  }

  const totalReviews = await Review.countDocuments(filter);
  const reviews = await Review.find(filter)
    .populate("user_id", "fullname email avatar")
    .populate("product_id", "product_name image_url")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return {
    reviews,
    totalPages: Math.ceil(totalReviews / limit),
    currentPage: parseInt(page),
    totalReviews,
  };
}

// 6. Xóa đánh giá (Admin)
async function deleteReview(reviewId) {
  // Có thể thêm logic tính lại sao cho product sau khi xóa nếu muốn kỹ hơn
  return await Review.findByIdAndDelete(reviewId);
}

const mongoose = require("mongoose");

module.exports = {
  createReview,
  getReviewsByProduct,
  checkCanReview,
  getAllReviews,
  deleteReview,
};
