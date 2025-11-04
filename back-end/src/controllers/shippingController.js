const shippingService = require('../services/shippingService');

const create = async (req, res) => {
    try {
        const shipping = await shippingService.createShipping(req.body);
        res.status(201).json({ message: 'Tạo thông tin vận chuyển thành công!', shipping });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const update = async (req, res) => {
    try {
        const shipping = await shippingService.updateShipping(req.params.id, req.body);
        res.status(200).json({ message: 'Cập nhật vận chuyển thành công!', shipping });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getByOrderId = async (req, res) => {
    try {
        const shipping = await shippingService.getShippingByOrderId(req.params.orderId);
        res.status(200).json(shipping);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

module.exports = {
    create,
    update,
    getByOrderId,
};