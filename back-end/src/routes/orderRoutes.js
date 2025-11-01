const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middlewares/authMiddleware');

router.use(authenticate);

// Tạo đơn hàng mới
router.post('/create', orderController.create);

// Lấy lịch sử đơn hàng của người dùng hiện tại
router.get('/my-orders', orderController.getMyOrders);

module.exports = router;