const paymentService = require('../services/paymentService');

const create = async (req, res) => {
    try {
        const payment = await paymentService.createPayment(req.body);
        res.status(201).json({ message: 'Tạo thanh toán thành công!', payment });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const payment = await paymentService.updatePaymentStatus(req.params.id, status);
        res.status(200).json({ message: 'Cập nhật trạng thái thanh toán thành công!', payment });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getByOrderId = async (req, res) => {
    try {
        const payment = await paymentService.getPaymentByOrderId(req.params.orderId);
        res.status(200).json(payment);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

module.exports = {
    create,
    updateStatus,
    getByOrderId,
};