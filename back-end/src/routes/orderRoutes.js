const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticate, isAdmin } = require("../middlewares/authMiddleware");

router.get("/vnpay-verify", orderController.vnpayVerify);

router.use(authenticate);

router.post("/create", orderController.create);
router.get("/my-orders", orderController.getMyOrders);
router.get("/detail/:id", orderController.getOrderDetail);
router.put("/cancel/:id", orderController.cancelOrder);

router.get("/admin/all", isAdmin, orderController.getAll);
router.put("/admin/status/:id", isAdmin, orderController.updateStatus);
router.get("/admin/:id/items", isAdmin, orderController.getOrderDetails);
router.put('/admin/payment-status/:id', orderController.updateOrderPaymentStatus);

module.exports = router;