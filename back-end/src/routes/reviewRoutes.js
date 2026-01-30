const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { authenticate, isAdmin } = require("../middlewares/authMiddleware");

// Public route: Ai cũng xem được đánh giá
router.get("/product/:productId", reviewController.getByProduct);

// Authenticated routes: Phải đăng nhập
router.post("/", authenticate, reviewController.create);
router.get("/check/:productId", authenticate, reviewController.checkPermission);

router.get("/admin/all", authenticate, isAdmin, reviewController.getAllReviews);
router.delete(
  "/admin/:id",
  authenticate,
  isAdmin,
  reviewController.deleteReview,
);

module.exports = router;
