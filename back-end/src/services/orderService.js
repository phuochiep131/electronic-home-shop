const Order = require("../models/Order");
const OrderDetail = require("../models/OrderDetail");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
const paymentService = require("./paymentService");

async function createOrder(userId, orderData) {
  const { shipping_address, note, payment_method } = orderData;

  const cart = await Cart.findOne({ user_id: userId });
  if (!cart) throw new Error("Không tìm thấy giỏ hàng");

  const cartItems = await CartItem.find({ cart_id: cart._id }).populate(
    "product_id"
  );
  if (cartItems.length === 0)
    throw new Error("Giỏ hàng trống, không thể đặt hàng");

  let total_amount = 0;

  for (const item of cartItems) {
    if (item.product_id.quantity < item.quantity) {
      throw new Error(
        `Sản phẩm "${item.product_id.product_name}" không đủ số lượng tồn kho.`
      );
    }
    total_amount += item.quantity * item.price_at_time;
  }

  const newOrder = new Order({
    user_id: userId,
    total_amount,
    shipping_address,
    note,
    order_status: "pending",
  });
  await newOrder.save();

  await paymentService.createPayment({
    order_id: newOrder._id,
    amount: total_amount,
    payment_method: payment_method || "COD",
  });

  for (const item of cartItems) {
    const orderDetail = new OrderDetail({
      order_id: newOrder._id,
      product_id: item.product_id._id,
      quantity: item.quantity,
      unit_price: item.price_at_time,
      subtotal: item.quantity * item.price_at_time,
    });
    await orderDetail.save();

    await Product.findByIdAndUpdate(item.product_id._id, {
      $inc: { quantity: -item.quantity },
    });
  }

  await CartItem.deleteMany({ cart_id: cart._id });

  return newOrder;
}

async function getOrdersByUser(userId) {
  return await Order.find({ user_id: userId })
    .populate("payment_id")
    .sort({ order_date: -1 });
}

async function getAllOrders() {
  return await Order.find()
    .populate("user_id", "fullname email phone_number")
    .populate("payment_id")
    .sort({ order_date: -1 });
}

async function updateOrderStatus(orderId, status) {
  const validStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  if (!validStatuses.includes(status))
    throw new Error("Trạng thái không hợp lệ");

  const order = await Order.findByIdAndUpdate(
    orderId,
    { order_status: status },
    { new: true }
  );
  if (!order) throw new Error("Không tìm thấy đơn hàng");
  return order;
}

async function getOrderItems(orderId) {
  return await OrderDetail.find({ order_id: orderId }).populate(
    "product_id",
    "product_name image_url"
  );
}

async function getOrderById(orderId) {
  const order = await Order.findById(orderId)
    .populate("user_id", "fullname email phone")
    .populate("payment_id");

  if (!order) throw new Error("Không tìm thấy đơn hàng");

  const items = await OrderDetail.find({ order_id: orderId }).populate(
    "product_id"
  );

  return { order, items };
}

async function cancelOrder(userId, orderId) {
  const order = await Order.findOne({ _id: orderId, user_id: userId });

  if (!order) {
    throw new Error(
      "Không tìm thấy đơn hàng hoặc bạn không có quyền hủy đơn này."
    );
  }

  if (order.order_status !== "pending") {
    throw new Error("Chỉ có thể hủy đơn hàng khi đang ở trạng thái Chờ xử lý.");
  }

  order.order_status = "cancelled";
  await order.save();

  const orderDetails = await OrderDetail.find({ order_id: order._id });
  for (const item of orderDetails) {
    await Product.findByIdAndUpdate(item.product_id, {
      $inc: { quantity: item.quantity },
    });
  }

  return order;
}

module.exports = {
  createOrder,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
  getOrderItems,
  getOrderById,
  cancelOrder,
};