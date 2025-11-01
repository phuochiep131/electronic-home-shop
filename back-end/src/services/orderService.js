const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

// Tạo đơn hàng mới từ giỏ hàng
async function createOrder(userId, orderData) {
    const { shipping_address, note } = orderData;
    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) throw new Error('Không tìm thấy giỏ hàng');

    const cartItems = await CartItem.find({ cart_id: cart._id }).populate('product_id');
    if (cartItems.length === 0) throw new Error('Giỏ hàng trống, không thể đặt hàng');

    let total_amount = 0;

    // Kiểm tra số lượng tồn kho và tính tổng tiền
    for (const item of cartItems) {
        if (item.product_id.quantity < item.quantity) {
            throw new Error(`Sản phẩm "${item.product_id.product_name}" không đủ số lượng tồn kho.`);
        }
        total_amount += item.quantity * item.price_at_time;
    }
    
    // Tạo bản ghi Order
    const newOrder = new Order({
        user_id: userId,
        total_amount,
        shipping_address,
        note,
    });
    await newOrder.save();

    // Tạo các bản ghi OrderDetail và cập nhật số lượng sản phẩm
    for (const item of cartItems) {
        const orderDetail = new OrderDetail({
            order_id: newOrder._id,
            product_id: item.product_id._id,
            quantity: item.quantity,
            unit_price: item.price_at_time,
            subtotal: item.quantity * item.price_at_time,
        });
        await orderDetail.save();

        // Giảm số lượng tồn kho của sản phẩm
        await Product.findByIdAndUpdate(item.product_id._id, {
            $inc: { quantity: -item.quantity }
        });
    }

    // Xóa tất cả các món hàng trong giỏ sau khi đã đặt hàng thành công
    await CartItem.deleteMany({ cart_id: cart._id });

    return newOrder;
}

// Lấy tất cả đơn hàng của một người dùng
async function getOrdersByUser(userId) {
    return await Order.find({ user_id: userId }).sort({ order_date: -1 });
}

module.exports = {
    createOrder,
    getOrdersByUser,
    //getAllOrders (admin), getOrderById, updateOrderStatus (admin)
};