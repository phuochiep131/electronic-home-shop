// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');

// // Định nghĩa các routes
// router.post('/', userController.create);
// router.get('/', userController.getAll);
// router.get('/:id', userController.getOne);
// router.put('/:id', userController.update);
// router.delete('/:id', userController.remove);

// module.exports = router;

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
// Import middleware xác thực (Bạn cần đảm bảo file này tồn tại)
const { authenticate } = require("../middlewares/authMiddleware");

// --- ROUTE CHO USER TỰ CẬP NHẬT (Sửa ở đây) ---
// Phải đặt route này TRƯỚC route '/:id' để tránh nhầm lẫn
router.put("/update", authenticate, userController.updateSelf);

// Các route Admin hoặc CRUD bình thường
router.post("/", userController.create);
router.get("/", userController.getAll);
router.get("/:id", userController.getOne);
router.put("/:id", userController.update); // Route update theo ID (dành cho Admin)
router.delete("/:id", userController.remove);

module.exports = router;
