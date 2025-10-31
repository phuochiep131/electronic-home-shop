const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');

// === Public Routes ===
// Lấy tất cả danh mục
router.get('/', categoryController.getAll);
// Lấy một danh mục theo ID
router.get('/:id', categoryController.getById);

// === Admin Routes ===
// Tạo danh mục mới (yêu cầu đăng nhập và là Admin)
router.post('/', authenticate, isAdmin, categoryController.create);
// Cập nhật danh mục (yêu cầu đăng nhập và là Admin)
router.put('/:id', authenticate, isAdmin, categoryController.update);
// Xóa danh mục (yêu cầu đăng nhập và là Admin)
router.delete('/:id', authenticate, isAdmin, categoryController.remove);

module.exports = router;