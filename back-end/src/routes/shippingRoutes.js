const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');

// === Admin Routes ===
router.post('/create', authenticate, isAdmin, shippingController.create);
router.put('/update/:id', authenticate, isAdmin, shippingController.update);

// === Authenticated Routes ===
router.get('/order/:orderId', authenticate, shippingController.getByOrderId);

module.exports = router;