const orderService = require("../services/orderService");

// Tạo đơn hàng mới
const create = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.user.id, req.body);
    res.status(201).json({ message: "Đặt hàng thành công!", order });
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

const getAll = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status);
    res.status(200).json({ message: "Cập nhật trạng thái thành công", order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const items = await orderService.getOrderItems(req.params.id);
    res.status(200).json(items);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

module.exports = {
  create,
  getMyOrders,
  getAll,
  updateStatus,
  getOrderDetails,
};
