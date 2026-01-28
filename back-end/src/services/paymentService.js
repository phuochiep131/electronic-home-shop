const Payment = require("../models/Payment");
const Order = require("../models/Order");

// 1. Tạo thanh toán mới
async function createPayment(data) {
  const { order_id, amount, payment_method } = data;

  const order = await Order.findById(order_id);
  if (!order) throw new Error("Không tìm thấy đơn hàng");

  // Check trùng (tùy nghiệp vụ, có thể cho phép thanh toán nhiều lần nếu chia đợt)
  const existingPayment = await Payment.findOne({ order_id });
  if (existingPayment) throw new Error("Đơn hàng đã có phiếu thanh toán");

  const newPayment = new Payment({
    order_id,
    amount,
    payment_method,
    payment_status: "pending",
  });

  // Link ngược lại Order
  order.payment_id = newPayment._id;
  await order.save();

  await newPayment.save();
  return newPayment;
}

// 2. Cập nhật trạng thái (Dùng cho Admin Dashboard khi có Payment ID)
async function updatePaymentStatus(paymentId, status) {
  const allowedStatus = ["pending", "completed", "failed"];
  if (!allowedStatus.includes(status))
    throw new Error("Trạng thái không hợp lệ");

  const payment = await Payment.findByIdAndUpdate(
    paymentId,
    { payment_status: status },
    { new: true },
  );
  if (!payment) throw new Error("Không tìm thấy payment");
  return payment;
}

// 3. [MỚI - QUAN TRỌNG] Cập nhật trạng thái theo Order ID
// (Để phục vụ API: /orders/admin/payment-status/:orderId)
async function updatePaymentStatusByOrderId(orderId, status) {
  const allowedStatus = ["pending", "completed", "failed"];
  if (!allowedStatus.includes(status))
    throw new Error("Trạng thái không hợp lệ");

  // Tìm payment dựa trên order_id
  const payment = await Payment.findOneAndUpdate(
    { order_id: orderId },
    { payment_status: status },
    { new: true },
  );

  if (!payment) {
    // Nếu chưa có record Payment, có thể tùy chọn TẠO MỚI luôn hoặc báo lỗi
    // Ở đây mình báo lỗi để đảm bảo tính toàn vẹn
    throw new Error("Đơn hàng chưa có bản ghi thanh toán nào để cập nhật");
  }
  return payment;
}

// 4. Lấy thông tin
async function getPaymentByOrderId(orderId) {
  return await Payment.findOne({ order_id: orderId });
}

module.exports = {
  createPayment,
  updatePaymentStatus,
  updatePaymentStatusByOrderId, // Export hàm mới
  getPaymentByOrderId,
};
