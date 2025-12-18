const router = require('express').Router();
const bannerController = require('../controllers/bannerController');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware'); 

router.get('/active', bannerController.getActive);

// Admin routes
router.get('/all', authenticate, isAdmin, bannerController.getAll);
router.post('/', authenticate, isAdmin, bannerController.create);
router.put('/:id', authenticate, isAdmin, bannerController.update);
router.delete('/:id', authenticate, isAdmin, bannerController.remove);

module.exports = router;