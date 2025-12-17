import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Package,
  Calendar,
  MapPin,
  ChevronRight,
  Loader2,
  Search,
  Filter,
  ShoppingBag,
} from "lucide-react";

const API_BASE = "http://localhost:5000/api";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  // 1. Fetch Data
  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        // Gọi API lấy lịch sử đơn hàng
        const res = await axios.get(`${API_BASE}/orders/my-orders`, {
          withCredentials: true,
        });
        setOrders(res.data);
      } catch (error) {
        console.error("Lỗi tải đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, []);

  // 2. Formatters
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
      case "shipped":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
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
      processing: "Đang chuẩn bị",
      shipped: "Đang giao",
      delivered: "Đã giao",
      cancelled: "Đã hủy",
    };
    return map[status] || status;
  };

  // 3. Filter Logic
  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.order_status === filterStatus);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-sans">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="text-blue-600" /> Đơn hàng của tôi
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Theo dõi và quản lý lịch sử mua sắm
            </p>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm overflow-x-auto max-w-full">
            {["all", "pending", "shipped", "delivered"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                  filterStatus === status
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {status === "all" ? "Tất cả" : getStatusText(status)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4 bg-gray-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-blue-600 font-bold text-lg shadow-sm">
                      #{order._id.slice(-4).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <Calendar size={14} />
                        {formatDate(order.order_date || order.createdAt)}
                      </div>
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          order.order_status
                        )}`}
                      >
                        {getStatusText(order.order_status)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">Tổng tiền</div>
                    <div className="text-xl font-bold text-blue-600">
                      {formatCurrency(order.total_amount)}
                    </div>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-4 md:p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <MapPin
                      className="text-gray-400 mt-1 flex-shrink-0"
                      size={18}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Địa chỉ nhận hàng
                      </p>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                        {order.shipping_address}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Link
                      to={`/order/${order._id}`} // Nếu bạn muốn làm trang chi tiết đơn
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Xem chi tiết
                    </Link>
                    {order.order_status === "pending" && (
                      <button className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                        Hủy đơn hàng
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Chưa có đơn hàng nào
              </h3>
              <p className="text-gray-500 mb-6">
                Bạn chưa mua sắm sản phẩm nào.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Mua sắm ngay <ChevronRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
