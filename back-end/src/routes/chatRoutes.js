const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Route gửi tin nhắn
router.post('/', chatController.chat);

// Route xóa lịch sử (tùy chọn)
router.post('/reset', chatController.resetChat);

module.exports = router;