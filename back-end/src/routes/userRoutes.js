const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Định nghĩa các routes
router.post('/', userController.create);
router.get('/', userController.getAll);
router.get('/:id', userController.getOne);
router.put('/:id', userController.update);
router.delete('/:id', userController.remove);

module.exports = router;