import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  MapPin,
  Phone,
  CreditCard,
  Banknote,
  Loader2,
  Package,
} from "lucide-react";

const API_BASE = "http://localhost:5000/api";

const Checkout = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const { currentUser } = state;

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    fullname: currentUser?.fullname || "",
    phone: currentUser?.phone_number || "",
    address: currentUser?.address || "",
    note: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD"); // Mặc định COD

  // 1. Lấy dữ liệu giỏ hàng để tính tổng tiền
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(`${API_BASE}/cart`, {
          withCredentials: true,
        });
        const items = res.data.items.map((item) => ({
          ...item,
          total: item.quantity * item.product_id.price,
        }));
        setCartItems(items);

        // Nếu giỏ hàng trống thì đá về trang chủ
        if (items.length === 0) {
          alert("Giỏ hàng trống!");
          navigate("/");
        }
      } catch (error) {
        console.error("Lỗi tải giỏ hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [navigate]);

  // Tính toán tiền nong
  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const shippingFee = subtotal > 5000000 ? 0 : 30000;
  const finalTotal = subtotal + shippingFee;

  // Handle Input Change
  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  // 2. Xử lý Đặt hàng
  const handlePlaceOrder = async () => {
    // Validate cơ bản
    if (!shippingInfo.address || !shippingInfo.phone) {
      alert("Vui lòng nhập địa chỉ và số điện thoại giao hàng!");
      return;
    }

    setIsSubmitting(true);
    try {
      // Payload gửi xuống Backend (khớp với orderController)
      const orderData = {
        shipping_address: `${shippingInfo.fullname} - ${shippingInfo.phone} - ${shippingInfo.address}`,
        note: shippingInfo.note,
        payment_method: paymentMethod, // Backend đã update để nhận cái này
      };

      const res = await axios.post(`${API_BASE}/orders/create`, orderData, {
        withCredentials: true,
      });

      if (res.status === 201) {
        // Đặt hàng thành công -> Chuyển sang trang thông báo
        // Truyền state để trang Success hiển thị thông tin
        navigate("/order-success", {
          state: { orderId: res.data.order._id },
        });
      }
    } catch (error) {
      console.error(error);
      alert(
        "Đặt hàng thất bại: " + (error.response?.data?.error || "Lỗi hệ thống")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Thanh toán & Đặt hàng
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* --- CỘT TRÁI: THÔNG TIN GIAO HÀNG --- */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* 1. Thông tin người nhận */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-blue-600" /> Thông tin giao
                hàng
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ tên người nhận
                  </label>
                  <input
                    name="fullname"
                    value={shippingInfo.fullname}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ nhận hàng
                  </label>
                  <input
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Số nhà, đường, phường/xã, quận/huyện..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú đơn hàng (Tùy chọn)
                  </label>
                  <textarea
                    name="note"
                    rows="2"
                    value={shippingInfo.note}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                  />
                </div>
              </div>
            </div>

            {/* 2. Phương thức thanh toán */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-blue-600" /> Phương thức
                thanh toán
              </h2>
              <div className="space-y-3">
                <label
                  className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                    paymentMethod === "COD"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium flex items-center gap-2">
                      <Banknote size={18} className="text-green-600" /> Thanh
                      toán khi nhận hàng (COD)
                    </div>
                    <div className="text-xs text-gray-500">
                      Bạn chỉ phải thanh toán khi nhận được hàng.
                    </div>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                    paymentMethod === "BANKING"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="BANKING"
                    checked={paymentMethod === "BANKING"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium flex items-center gap-2">
                      <CreditCard size={18} className="text-purple-600" />{" "}
                      Chuyển khoản ngân hàng (QR Code)
                    </div>
                    <div className="text-xs text-gray-500">
                      Chuyển khoản qua App ngân hàng hoặc Ví điện tử.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* --- CỘT PHẢI: TỔNG KẾT ĐƠN HÀNG --- */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Package size={20} className="text-blue-600" /> Đơn hàng (
                {cartItems.length})
              </h2>

              {/* List items nhỏ gọn */}
              <div className="max-h-60 overflow-y-auto space-y-3 mb-4 pr-1 scrollbar-thin">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="w-12 h-12 bg-gray-100 rounded border flex-shrink-0 overflow-hidden">
                      <img
                        src={item.product_id.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium line-clamp-2">
                        {item.product_id.product_name}
                      </p>
                      <p className="text-gray-500">x{item.quantity}</p>
                    </div>
                    <div className="font-medium text-gray-700">
                      {new Intl.NumberFormat("vi-VN").format(item.total)}đ
                    </div>
                  </div>
                ))}
              </div>

              <hr className="my-4 border-gray-100" />

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>
                    {new Intl.NumberFormat("vi-VN").format(subtotal)}đ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>
                    {shippingFee === 0
                      ? "Miễn phí"
                      : `${new Intl.NumberFormat("vi-VN").format(
                          shippingFee
                        )}đ`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold text-blue-600 mt-2 pt-2 border-t border-gray-100">
                  <span>Tổng thanh toán</span>
                  <span>
                    {new Intl.NumberFormat("vi-VN").format(finalTotal)}đ
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "ĐẶT HÀNG NGAY"
                )}
              </button>
              <p className="text-xs text-center text-gray-400 mt-3">
                Nhấn "Đặt hàng ngay" đồng nghĩa với việc bạn đồng ý với điều
                khoản của chúng tôi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
