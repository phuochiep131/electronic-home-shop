const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticate, isAdmin } = require("../middlewares/authMiddleware");

router.use(authenticate);

// User Routes
router.post("/create", orderController.create);
router.get("/my-orders", orderController.getMyOrders);
router.get("/detail/:id", orderController.getOrderDetail);
router.put("/cancel/:id", orderController.cancelOrder);

// --- ADMIN ROUTES ---
// Lấy tất cả đơn hàng
router.get("/admin/all", isAdmin, orderController.getAll);
// Cập nhật trạng thái
router.put("/admin/status/:id", isAdmin, orderController.updateStatus);
// Lấy chi tiết sản phẩm trong đơn (Admin xem)
router.get("/admin/:id/items", isAdmin, orderController.getOrderDetails);

module.exports = router;
