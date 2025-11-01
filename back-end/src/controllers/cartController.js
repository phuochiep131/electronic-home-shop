const cartService = require('../services/cartService');

// Lấy giỏ hàng của tôi
const getMyCart = async (req, res) => {
    try {
        // req.user.id được lấy từ middleware authenticate
        const cartData = await cartService.getCart(req.user.id);
        res.status(200).json(cartData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Thêm vào giỏ hàng
const addItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const cartItem = await cartService.addItemToCart(req.user.id, productId, quantity);
        res.status(201).json({ message: 'Thêm vào giỏ hàng thành công!', cartItem });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Cập nhật giỏ hàng
const updateItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const cartItem = await cartService.updateCartItem(req.params.itemId, quantity);
        res.status(200).json({ message: 'Cập nhật giỏ hàng thành công!', cartItem });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Xóa khỏi giỏ hàng
const removeItem = async (req, res) => {
    try {
        const result = await cartService.removeItemFromCart(req.params.itemId);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    getMyCart,
    addItem,
    updateItem,
    removeItem,
};