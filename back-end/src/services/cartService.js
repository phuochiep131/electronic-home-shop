const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");

// Lấy giỏ hàng của người dùng (bao gồm các sản phẩm chi tiết)
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

  if (cartItem) {
    cartItem.quantity += quantity;
  } else {
    const price = product.price || 0;
    const discount = product.discount || 0;
    const priceAtTime = price * (1 - discount / 100);

    cartItem = new CartItem({
      cart_id: cart._id,
      product_id: productId,
      quantity: quantity,
      price_at_time: priceAtTime,
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
