const Payment = require('../models/Payment');
const Order = require('../models/Order');

// Tạo một bản ghi thanh toán mới cho đơn hàng
async function createPayment(data) {
    const { order_id, amount, payment_method } = data;

    // Kiểm tra xem đơn hàng có tồn tại không
    const order = await Order.findById(order_id);
    if (!order) throw new Error('Không tìm thấy đơn hàng để tạo thanh toán');
    
    // Kiểm tra xem đơn hàng đã có thanh toán chưa để tránh trùng lặp
    const existingPayment = await Payment.findOne({ order_id });
    if (existingPayment) throw new Error('Đơn hàng này đã có thông tin thanh toán');

    const newPayment = new Payment({
        order_id,
        amount,
        payment_method,
        payment_status: 'pending', // Mặc định là đang chờ xử lý
    });
    
    // Cập nhật payment_id trong bản ghi Order
    order.payment_id = newPayment._id;
    await order.save();
    
    await newPayment.save();
    return newPayment;
}

// Cập nhật trạng thái thanh toán
async function updatePaymentStatus(paymentId, status) {
    // Chỉ cho phép các trạng thái hợp lệ
    const allowedStatus = ['pending', 'completed', 'failed'];
    if (!allowedStatus.includes(status)) {
        throw new Error('Trạng thái thanh toán không hợp lệ');
    }

    const payment = await Payment.findByIdAndUpdate(
        paymentId,
        { payment_status: status },
        { new: true }
    );

    if (!payment) throw new Error('Không tìm thấy thông tin thanh toán');
    return payment;
}

// Lấy thông tin thanh toán theo ID đơn hàng
async function getPaymentByOrderId(orderId) {
    const payment = await Payment.findOne({ order_id: orderId });
    if (!payment) throw new Error('Không tìm thấy thông tin thanh toán cho đơn hàng này');
    return payment;
}

module.exports = {
    createPayment,
    updatePaymentStatus,
    getPaymentByOrderId,

};