const express = require('express');
const router = express.Router();
const flashSaleController = require('../controllers/flashSaleController');

// Public: Lấy danh sách Flash Sale để hiển thị trang chủ
router.get('/', flashSaleController.getFlashSales);

// Admin: Tạo Flash Sale mới
router.post('/', flashSaleController.createFlashSale);
router.put('/:id', flashSaleController.updateFlashSale);
router.delete('/:id', flashSaleController.deleteFlashSale);

module.exports = router;