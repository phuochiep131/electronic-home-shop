const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
const FlashSale = require("../models/FlashSale");

// Lấy giỏ hàng của người dùng
async function getCart(userId) {
  let cart = await Cart.findOne({ user_id: userId });
  if (!cart) {
    cart = new Cart({ user_id: userId });
    await cart.save();
    return { cart, items: [] };
  }

  const items = await CartItem.find({ cart_id: cart._id }).populate(
    "product_id"
  );

  return { cart, items };
}

// Thêm sản phẩm vào giỏ hàng
async function addItemToCart(userId, productId, quantity) {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Không tìm thấy sản phẩm");
  if (product.quantity < quantity)
    throw new Error("Số lượng sản phẩm trong kho không đủ");

  let cart = await Cart.findOne({ user_id: userId });
  if (!cart) {
    cart = new Cart({ user_id: userId });
    await cart.save();
  }

  let cartItem = await CartItem.findOne({
    cart_id: cart._id,
    product_id: productId,
  });

  const price = product.price || 0;
  let finalDiscount = product.discount || 0; // Mặc định lấy giảm giá thường

  // Kiểm tra Flash Sale đang chạy
  const now = new Date();
  const activeFlashSale = await FlashSale.findOne({
      product_id: productId,
      status: true,
      start_date: { $lte: now },
      end_date: { $gte: now }
  });

  // Nếu có Flash Sale thì ưu tiên lấy % giảm của Flash Sale
  if (activeFlashSale) {
      finalDiscount = activeFlashSale.discount_percent;
  }

  // Tính giá cuối cùng
  const priceAtTime = price * (1 - finalDiscount / 100);

  if (cartItem) {
    cartItem.quantity += quantity;
    // Cập nhật giá mới nhất
    cartItem.price_at_time = priceAtTime; 
  } else {
    cartItem = new CartItem({
      cart_id: cart._id,
      product_id: productId,
      quantity: quantity,
      price_at_time: priceAtTime, // Lưu giá đã tính theo Flash Sale
    });
  }

  await cartItem.save();
  return cartItem;
}

// Cập nhật số lượng một món hàng
async function updateCartItem(cartItemId, quantity) {
  if (quantity <= 0) {
    return await CartItem.findByIdAndDelete(cartItemId);
  }

  const cartItem = await CartItem.findById(cartItemId).populate("product_id");
  if (!cartItem) throw new Error("Không tìm thấy món hàng trong giỏ");
  
  // Kiểm tra tồn kho sản phẩm gốc
  if (cartItem.product_id.quantity < quantity)
    throw new Error("Số lượng sản phẩm trong kho không đủ");

  cartItem.quantity = quantity;
  await cartItem.save();
  return cartItem;
}

// Xóa một món hàng khỏi giỏ
async function removeItemFromCart(cartItemId) {
  const result = await CartItem.findByIdAndDelete(cartItemId);
  if (!result) throw new Error("Không tìm thấy món hàng để xóa");
  return { message: "Xóa sản phẩm khỏi giỏ hàng thành công" };
}

module.exports = {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
};