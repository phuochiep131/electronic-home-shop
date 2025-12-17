import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  CreditCard,
  Tag,
  Truck,
  ShieldCheck,
  Loader2, // Added loader
} from "lucide-react";
import { useCart } from "../context/CartContext";

const Cart = () => {
  // --- STATE ---
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const { fetchCartCount } = useCart(); // To update the navbar badge

  // --- FETCH CART DATA ---
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/cart", {
        withCredentials: true,
      });

      // Transform API data to match UI needs
      // API returns { cart: {...}, items: [ { product_id: {...}, quantity: 1, ... } ] }
      const items = res.data.items.map((item) => ({
        id: item._id, // CartItem ID
        productId: item.product_id._id,
        name: item.product_id.product_name,
        price: item.product_id.price,
        originalPrice:
          item.product_id.price / (1 - (item.product_id.discount || 0) / 100), // Approximate original
        image:
          item.product_id.image_url ||
          "https://placehold.co/200x200/png?text=Product",
        quantity: item.quantity,
        category: item.product_id.category_id?.name || "Sản phẩm",
        maxStock: item.product_id.quantity,
      }));

      setCartItems(items);
    } catch (error) {
      console.error("Lỗi tải giỏ hàng:", error);
      // Handle 401 (Unauthorized) or empty cart scenarios gracefully
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // --- CALCULATIONS ---
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = subtotal > 5000000 ? 0 : 30000;
  const total = subtotal + shippingFee - discount;

  // --- HANDLERS ---

  // Update Quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    // Optimistic UI update
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );

    try {
      await axios.put(
        `http://localhost:5000/api/cart/update/${itemId}`,
        { quantity: newQuantity },
        { withCredentials: true }
      );
      fetchCartCount(); // Update navbar count
    } catch (error) {
      console.error("Lỗi cập nhật số lượng:", error);
      alert("Lỗi cập nhật số lượng!");
      // Revert on error could be implemented here
      fetchCart(); // Re-fetch to ensure sync
    }
  };

  // Remove Item
  const removeItem = async (itemId) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?"))
      return;

    try {
      // Optimistic UI update
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));

      await axios.delete(`http://localhost:5000/api/cart/remove/${itemId}`, {
        withCredentials: true,
      });
      fetchCartCount(); // Update navbar count
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
      alert("Không thể xóa sản phẩm!");
      fetchCart();
    }
  };

  // Apply Coupon
  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "ELECTRO100") {
      setDiscount(100000);
      alert("Áp dụng mã giảm giá thành công: -100.000đ");
    } else {
      alert("Mã giảm giá không hợp lệ hoặc đã hết hạn!");
      setDiscount(0);
    }
  };

  // Format Currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // --- RENDER LOADING ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  // --- RENDER EMPTY STATE ---
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
          <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={48} className="text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Giỏ hàng của bạn đang trống
          </h2>
          <p className="text-gray-500 mb-8">
            Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá các
            sản phẩm tuyệt vời của chúng tôi nhé!
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
          >
            <ArrowLeft size={20} /> Quay lại mua sắm
          </Link>
        </div>
      </div>
    );
  }

  // --- RENDER MAIN CART ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      {/* Header đơn giản */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold flex items-center gap-1">
            Electro<span className="text-orange-400">Shop</span>
          </Link>
          <div className="text-gray-500 text-sm hidden sm:block">
            <span className="text-blue-600 font-medium">Giỏ hàng</span> / Thanh
            toán
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          Giỏ hàng{" "}
          <span className="text-lg font-normal text-gray-500">
            ({cartItems.length} sản phẩm)
          </span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- LEFT COLUMN: CART ITEMS --- */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 text-sm font-medium text-gray-500 border-b border-gray-200">
                <div className="col-span-6">Sản phẩm</div>
                <div className="col-span-2 text-center">Đơn giá</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-2 text-right">Thành tiền</div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-4 items-center group hover:bg-blue-50/30 transition-colors"
                  >
                    {/* Product Info */}
                    <div className="col-span-1 md:col-span-6 flex items-start gap-4">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-blue-600 mb-1 font-medium">
                          {item.category}
                        </div>
                        <h3 className="text-base font-medium text-gray-900 line-clamp-2 mb-2">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-sm text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 size={14} /> Xóa
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="hidden md:block col-span-2 text-center text-gray-600 font-medium">
                      {formatCurrency(item.price)}
                    </div>

                    {/* Quantity Control */}
                    <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-center">
                      <span className="md:hidden text-sm font-medium text-gray-500">
                        Số lượng:
                      </span>
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-2 hover:bg-gray-100 text-gray-600 rounded-l-lg transition-colors disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-sm font-medium text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-2 hover:bg-gray-100 text-gray-600 rounded-r-lg transition-colors disabled:opacity-50"
                          disabled={item.quantity >= item.maxStock}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end">
                      <span className="md:hidden text-sm font-medium text-gray-500">
                        Tổng:
                      </span>
                      <div className="text-right">
                        <div className="text-blue-600 font-bold">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                        <div className="md:hidden text-xs text-gray-400">
                          {formatCurrency(item.price)}/sp
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Policies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start gap-3">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <Truck size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Miễn phí vận chuyển
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Cho đơn hàng trên 5.000.000₫
                  </p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Bảo hành chính hãng
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    100% sản phẩm có nguồn gốc rõ ràng
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 md:hidden">
              <Link
                to="/"
                className="text-blue-600 font-medium flex items-center gap-2 hover:underline"
              >
                <ArrowLeft size={16} /> Tiếp tục mua sắm
              </Link>
            </div>
          </div>

          {/* --- RIGHT COLUMN: ORDER SUMMARY --- */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Cộng giỏ hàng
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span className="font-medium">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  {shippingFee === 0 ? (
                    <span className="text-green-600 font-medium">Miễn phí</span>
                  ) : (
                    <span className="font-medium">
                      {formatCurrency(shippingFee)}
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span className="font-medium">
                      -{formatCurrency(discount)}
                    </span>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-end">
                    <span className="text-base font-bold text-gray-900">
                      Tổng cộng
                    </span>
                    <div className="text-right">
                      <span className="block text-2xl font-bold text-blue-600">
                        {formatCurrency(total)}
                      </span>
                      <span className="text-xs text-gray-400 font-normal">
                        (Đã bao gồm VAT)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coupon Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Tag size={16} /> Mã giảm giá
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập mã (VD: ELECTRO100)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>

              <button
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 mb-4"
                onClick={() => {
                  setIsCheckingOut(true);
                  setTimeout(() => {
                    alert("Chuyển đến trang thanh toán...");
                    setIsCheckingOut(false);
                  }, 1000);
                }}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <span className="animate-pulse">Đang xử lý...</span>
                ) : (
                  <>
                    Tiến hành thanh toán <CreditCard size={20} />
                  </>
                )}
              </button>

              <div className="text-center">
                <Link
                  to="/"
                  className="text-sm text-gray-500 hover:text-blue-600 hover:underline"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>

              {/* Payment Methods */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-xs text-center text-gray-400 mb-3">
                  Chấp nhận thanh toán
                </p>
                <div className="flex justify-center gap-3 opacity-60 grayscale hover:grayscale-0 transition-all">
                  <div className="w-8 h-5 bg-blue-900 rounded"></div>
                  <div className="w-8 h-5 bg-red-600 rounded"></div>
                  <div className="w-8 h-5 bg-blue-400 rounded"></div>
                  <div className="w-8 h-5 bg-pink-600 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
