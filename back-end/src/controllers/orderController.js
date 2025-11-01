const orderService = require('../services/orderService');

// Tạo đơn hàng mới
const create = async (req, res) => {
    try {
        const order = await orderService.createOrder(req.user.id, req.body);
        res.status(201).json({ message: 'Đặt hàng thành công!', order });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Lấy lịch sử đơn hàng của tôi
const getMyOrders = async (req, res) => {
    try {
        const orders = await orderService.getOrdersByUser(req.user.id);
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    create,
    getMyOrders,
};