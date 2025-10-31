const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');

// === Public Routes ===
router.get('/', productController.getAll);
router.get('/:id', productController.getById);

// === Admin Routes ===
router.post('/', authenticate, isAdmin, productController.create);
router.put('/:id', authenticate, isAdmin, productController.update);
router.delete('/:id', authenticate, isAdmin, productController.remove);

module.exports = router;