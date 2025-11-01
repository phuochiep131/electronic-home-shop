const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

// Lấy giỏ hàng của người dùng (bao gồm các sản phẩm chi tiết)
async function getCart(userId) {
    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
        // Nếu người dùng chưa có giỏ hàng, tạo một cái mới
        cart = new Cart({ user_id: userId });
        await cart.save();
        return { cart, items: [] }; // Trả về giỏ hàng rỗng
    }

    // Lấy các món hàng trong giỏ và populate thông tin sản phẩm
    const items = await CartItem.find({ cart_id: cart._id })
        .populate('product_id'); // Lấy chi tiết sản phẩm

    return { cart, items };
}

// Thêm sản phẩm vào giỏ hàng
async function addItemToCart(userId, productId, quantity) {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Không tìm thấy sản phẩm');
    if (product.quantity < quantity) throw new Error('Số lượng sản phẩm trong kho không đủ');

    let cart = await Cart.findOne({ user_id: userId });
    // Nếu chưa có giỏ hàng, tạo mới
    if (!cart) {
        cart = new Cart({ user_id: userId });
        await cart.save();
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    let cartItem = await CartItem.findOne({ cart_id: cart._id, product_id: productId });

    if (cartItem) {
        // Nếu đã có, cập nhật số lượng
        cartItem.quantity += quantity;
    } else {
        // Nếu chưa có, tạo mới
        cartItem = new CartItem({
            cart_id: cart._id,
            product_id: productId,
            quantity: quantity,
            price_at_time: product.price, // Lưu lại giá tại thời điểm thêm
        });
    }

    await cartItem.save();
    return cartItem;
}

// Cập nhật số lượng một món hàng
async function updateCartItem(cartItemId, quantity) {
    if (quantity <= 0) {
        // Nếu số lượng <= 0, xóa luôn món hàng
        return await CartItem.findByIdAndDelete(cartItemId);
    }

    const cartItem = await CartItem.findById(cartItemId).populate('product_id');
    if (!cartItem) throw new Error('Không tìm thấy món hàng trong giỏ');
    if (cartItem.product_id.quantity < quantity) throw new Error('Số lượng sản phẩm trong kho không đủ');

    cartItem.quantity = quantity;
    await cartItem.save();
    return cartItem;
}

// Xóa một món hàng khỏi giỏ
async function removeItemFromCart(cartItemId) {
    const result = await CartItem.findByIdAndDelete(cartItemId);
    if (!result) throw new Error('Không tìm thấy món hàng để xóa');
    return { message: 'Xóa sản phẩm khỏi giỏ hàng thành công' };
}

module.exports = {
    getCart,
    addItemToCart,
    updateCartItem,
    removeItemFromCart,
};