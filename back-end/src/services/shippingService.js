const Shipping = require('../models/Shipping');
const Order = require('../models/Order');

// Tạo thông tin vận chuyển cho một đơn hàng
async function createShipping(data) {
    const { order_id, carrier, tracking_number } = data;

    const order = await Order.findById(order_id);
    if (!order) throw new Error('Không tìm thấy đơn hàng để tạo thông tin vận chuyển');

    const existingShipping = await Shipping.findOne({ order_id });
    if (existingShipping) throw new Error('Đơn hàng này đã có thông tin vận chuyển');

    const newShipping = new Shipping({
        order_id,
        carrier,
        tracking_number,
        status: 'pending', // Mặc định là đang chờ vận chuyển
    });

    // Cập nhật shipping_id trong bản ghi Order
    order.shipping_id = newShipping._id;
    await order.save();
    
    await newShipping.save();
    return newShipping;
}

// Cập nhật thông tin và trạng thái vận chuyển
async function updateShipping(shippingId, data) {
    const { status, delivery_date, shipped_date, tracking_number, carrier } = data;
    
    const allowedStatus = ['pending', 'shipped', 'delivered', 'cancelled'];
    if (status && !allowedStatus.includes(status)) {
        throw new Error('Trạng thái vận chuyển không hợp lệ');
    }

    const shipping = await Shipping.findByIdAndUpdate(shippingId, data, { new: true });
    if (!shipping) throw new Error('Không tìm thấy thông tin vận chuyển');

    // Đồng bộ trạng thái của Order với Shipping
    await Order.findByIdAndUpdate(shipping.order_id, { order_status: status });

    return shipping;
}

// Lấy thông tin vận chuyển theo ID đơn hàng
async function getShippingByOrderId(orderId) {
    const shipping = await Shipping.findOne({ order_id: orderId });
    if (!shipping) throw new Error('Không tìm thấy thông tin vận chuyển cho đơn hàng này');
    return shipping;
}

module.exports = {
    createShipping,
    updateShipping,
    getShippingByOrderId,
};