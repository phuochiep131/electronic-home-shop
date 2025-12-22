import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  CreditCard,
  User,
  Phone,
  Package,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API_BASE = "http://localhost:5000/api";

const OrderDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch Data
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const res = await axios.get(`${API_BASE}/orders/detail/${id}`, {
          withCredentials: true,
        });
        // API trả về { order: {...}, items: [...] }
        setOrder(res.data.order);
        setItems(res.data.items);
      } catch (err) {
        console.error("Lỗi tải chi tiết đơn hàng:", err);
        setError("Không tìm thấy đơn hàng hoặc bạn không có quyền truy cập.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [id]);

  // 2. Logic Hủy Đơn (Copy từ MyOrder sang để tái sử dụng)
  const handleCancelOrder = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;

    try {
      await axios.put(
        `${API_BASE}/orders/cancel/${id}`,
        {},
        { withCredentials: true }
      );
      alert("Đã hủy đơn hàng thành công!");
      // Reload lại dữ liệu sau khi hủy
      setLoading(true);
      const res = await axios.get(`${API_BASE}/orders/detail/${id}`, {
        withCredentials: true,
      });
      setOrder(res.data.order);
      setLoading(false);
    } catch (error) {
      alert(error.response?.data?.error || "Lỗi khi hủy đơn hàng");
    }
  };

  // 3. Helper Functions (Format)
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "shipping":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    const map = {
      pending: "Chờ xử lý",
      processing: "Đang đóng gói",
      shipping: "Đang giao hàng",
      delivered: "Đã giao thành công",
      cancelled: "Đã hủy",
    };
    return map[status] || status;
  };

  // 4. Render Loading & Error
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Đã xảy ra lỗi</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link
          to="/my-orders"
          className="text-blue-600 hover:underline font-medium"
        >
          Quay lại danh sách đơn hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-sans">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Nút Back */}
        <Link
          to="/my-orders"
          className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors font-medium"
        >
          <ArrowLeft size={18} className="mr-2" /> Quay lại danh sách
        </Link>

        {/* 1. Thông tin chung (Header) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg font-bold text-gray-900">
                  Đơn hàng #{order._id.slice(-6).toUpperCase()}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                    order.order_status
                  )}`}
                >
                  {getStatusText(order.order_status).toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Calendar size={14} /> Ngày đặt:{" "}
                {formatDate(order.order_date || order.createdAt)}
              </p>
            </div>

            {/* Nút Hủy (Chỉ hiện khi Pending) */}
            {order.order_status === "pending" && (
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors shadow-sm"
              >
                Hủy đơn hàng
              </button>
            )}
          </div>

          {/* 2. Thông tin người nhận & Địa chỉ */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                <MapPin size={16} className="text-blue-600" /> Địa chỉ nhận hàng
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User size={16} className="text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-700 font-medium">
                    {order.user_id?.fullname || "Người dùng"}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-700">
                    {order.user_id?.phone || "Chưa cập nhật SĐT"}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-600 leading-relaxed">
                    {order.shipping_address}
                  </span>
                </div>
              </div>
            </div>

            <div className="md:border-l md:border-gray-100 md:pl-8">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                <CreditCard size={16} className="text-blue-600" /> Thanh toán
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phương thức:</span>
                  <span className="font-medium text-gray-900">
                    COD (Thanh toán khi nhận hàng)
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tình trạng:</span>
                  <span className="font-medium text-gray-900">
                    {order.order_status === "delivered"
                      ? "Đã thanh toán"
                      : "Chưa thanh toán"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Danh sách sản phẩm */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Package size={18} className="text-blue-600" /> Sản phẩm đã mua
            </h3>
          </div>

          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div
                key={item._id}
                className="p-4 sm:p-6 flex items-center gap-4"
              >
                {/* Ảnh sản phẩm (Placeholder nếu không có ảnh) */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  {item.product_id?.image_url ? (
                    <img
                      src={item.product_id.image_url}
                      alt={item.product_id.product_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Package size={24} />
                    </div>
                  )}
                </div>

                {/* Thông tin chi tiết */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                    {item.product_id?.product_name ||
                      "Sản phẩm không còn tồn tại"}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Đơn giá: {formatCurrency(item.unit_price)}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Số lượng: x{item.quantity}
                  </p>
                </div>

                {/* Thành tiền */}
                <div className="text-right">
                  <span className="block text-sm sm:text-base font-bold text-blue-600">
                    {formatCurrency(item.subtotal)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Tổng cộng */}
          <div className="bg-gray-50 p-6 border-t border-gray-100">
            <div className="flex flex-col gap-2 items-end">
              <div className="flex justify-between w-full sm:w-64 text-sm text-gray-600">
                <span>Tạm tính:</span>
                <span>{formatCurrency(order.total_amount)}</span>
              </div>
              <div className="flex justify-between w-full sm:w-64 text-sm text-gray-600 border-b border-gray-200 pb-2">
                <span>Phí vận chuyển:</span>
                <span>0 ₫</span>
              </div>
              <div className="flex justify-between w-full sm:w-64 text-lg font-bold text-gray-900 pt-2">
                <span>Tổng cộng:</span>
                <span className="text-blue-600">
                  {formatCurrency(order.total_amount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
