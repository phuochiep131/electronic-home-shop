const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');

// === Public Routes ===
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);

// === Admin Routes ===
router.post('/', authenticate, isAdmin, categoryController.create);
router.put('/:id', authenticate, isAdmin, categoryController.update);
router.delete('/:id', authenticate, isAdmin, categoryController.remove);

module.exports = router;