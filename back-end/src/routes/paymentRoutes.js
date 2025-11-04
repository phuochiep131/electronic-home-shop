const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');

// === Admin Routes ===
// Tạo một bản ghi thanh toán (Admin)
router.post('/create', authenticate, isAdmin, paymentController.create);
// Cập nhật trạng thái thanh toán (Admin)
router.put('/status/:id', authenticate, isAdmin, paymentController.updateStatus);

// === Authenticated Routes ===
// Lấy thông tin thanh toán của một đơn hàng (cả user và admin)
router.get('/order/:orderId', authenticate, paymentController.getByOrderId);

module.exports = router;