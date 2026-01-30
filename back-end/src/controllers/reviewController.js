const reviewService = require("../services/reviewService");

const create = async (req, res) => {
  try {
    const userId = req.user.id;
    const review = await reviewService.createReview(userId, req.body);
    res.status(201).json({ message: "Đánh giá thành công!", review });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getByProduct = async (req, res) => {
  try {
    const reviews = await reviewService.getReviewsByProduct(
      req.params.productId,
    );
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const checkPermission = async (req, res) => {
  try {
    const canReview = await reviewService.checkCanReview(
      req.user.id,
      req.params.productId,
    );
    res.status(200).json({ canReview });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- PHẦN ADMIN ĐÃ SỬA ---

const getAllReviews = async (req, res) => {
  try {
    // Gọi sang service xử lý
    const data = await reviewService.getAllReviews(req.query);
    res.status(200).json(data);
  } catch (err) {
    console.error("Lỗi getAllReviews:", err); // Log lỗi để dễ debug
    res.status(500).json({ error: err.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    await reviewService.deleteReview(req.params.id);
    res.status(200).json({ message: "Xóa đánh giá thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  create,
  getByProduct,
  checkPermission,
  getAllReviews,
  deleteReview,
};
