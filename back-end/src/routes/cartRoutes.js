const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middlewares/authMiddleware');

router.use(authenticate);

// Lấy giỏ hàng của người dùng hiện tại
router.get('/', cartController.getMyCart);
// Thêm sản phẩm vào giỏ hàng
router.post('/add', cartController.addItem);
// Cập nhật số lượng của một món hàng
router.put('/update/:itemId', cartController.updateItem);
// Xóa một món hàng khỏi giỏ hàng
router.delete('/remove/:itemId', cartController.removeItem);

module.exports = router;