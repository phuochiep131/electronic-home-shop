import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Package,
  Search,
  Eye,
  Filter,
  CheckCircle2, // Icon mới
  AlertCircle, // Icon mới
  Clock, // Icon mới
  CreditCard, // Icon mới
  Loader2,
  Truck,
  X,
} from "lucide-react";

const API_BASE = "http://localhost:5000/api";

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal Details State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  // --- FETCH DATA ---
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/orders/admin/all`, {
        withCredentials: true,
      });
      setOrders(res.data);
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --- ACTIONS ---
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${API_BASE}/orders/admin/status/${orderId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      // Cập nhật UI ngay lập tức
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, order_status: newStatus } : o
        )
      );
      alert("Cập nhật trạng thái thành công!");
    } catch (error) {
      alert("Lỗi cập nhật: " + error.response?.data?.error);
    }
  };

  const handleViewDetails = async (order) => {
    setSelectedOrder(order);
    setLoadingItems(true);
    try {
      const res = await axios.get(
        `${API_BASE}/orders/admin/${order._id}/items`,
        {
          withCredentials: true,
        }
      );
      setOrderItems(res.data);
    } catch (error) {
      console.error("Lỗi tải chi tiết:", error);
    } finally {
      setLoadingItems(false);
    }
  };

  // --- HELPER FUNCTIONS ---
  const formatCurrency = (val) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      processing: "bg-blue-100 text-blue-700 border-blue-200",
      shipped: "bg-purple-100 text-purple-700 border-purple-200",
      delivered: "bg-green-100 text-green-700 border-green-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    };
    const labels = {
      pending: "Chờ xử lý",
      processing: "Đang chuẩn bị",
      shipped: "Đang giao",
      delivered: "Đã giao",
      cancelled: "Đã hủy",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold border ${
          styles[status] || styles.pending
        }`}
      >
        {labels[status] || status}
      </span>
    );
  };

  // --- LOGIC MỚI: TRẠNG THÁI THANH TOÁN (Giống bên User) ---
  const getPaymentStatusInfo = (status) => {
    switch (status) {
      case "completed":
        return {
          text: "Đã thanh toán",
          color: "text-green-700 bg-green-50 border-green-200",
          icon: CheckCircle2,
        };
      case "failed":
        return {
          text: "Thất bại",
          color: "text-red-700 bg-red-50 border-red-200",
          icon: AlertCircle,
        };
      case "pending":
      default:
        return {
          text: "Chờ thanh toán",
          color: "text-yellow-700 bg-yellow-50 border-yellow-200",
          icon: Clock,
        };
    }
  };

  // --- FILTER LOGIC ---
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_id?.fullname?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.order_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
            <Package className="text-blue-600" /> Quản lý Đơn hàng
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Tổng số: {orders.length} đơn hàng
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Tìm theo Mã đơn, Tên khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="processing">Đang chuẩn bị</option>
            <option value="shipped">Đang giao hàng</option>
            <option value="delivered">Đã giao thành công</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50 text-gray-700 text-xs uppercase font-bold border-b border-gray-200">
                <th className="py-4 px-6">Mã đơn</th>
                <th className="py-4 px-6">Khách hàng</th>
                <th className="py-4 px-6">Ngày đặt</th>
                <th className="py-4 px-6">Thanh toán</th> {/* Cột mới */}
                <th className="py-4 px-6">Tổng tiền</th>
                <th className="py-4 px-6">Trạng thái</th>
                <th className="py-4 px-6 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-600">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center">
                    <Loader2 className="animate-spin mx-auto text-blue-500" />
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  // Xử lý thông tin thanh toán cho từng dòng
                  const paymentStatus =
                    order.payment_id?.payment_status || "pending";
                  const paymentMethod =
                    order.payment_method ||
                    order.payment_id?.payment_method ||
                    "COD";
                  const paymentInfo = getPaymentStatusInfo(paymentStatus);
                  const PaymentIcon = paymentInfo.icon;

                  return (
                    <tr
                      key={order._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6 font-mono font-medium text-blue-600">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-800">
                          {order.user_id?.fullname || "Khách lẻ"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {order.user_id?.phone_number || "---"}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {formatDate(order.order_date)}
                      </td>

                      {/* Ô Thanh Toán */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-gray-700 text-xs">
                            {paymentMethod}
                          </span>
                          <span
                            className={`flex items-center gap-1 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border w-fit ${paymentInfo.color}`}
                          >
                            <PaymentIcon size={10} />
                            {paymentInfo.text}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6 font-bold text-gray-800">
                        {formatCurrency(order.total_amount)}
                      </td>
                      <td className="py-4 px-6">
                        {/* Select đổi trạng thái trực tiếp */}
                        <div className="relative group w-fit">
                          {getStatusBadge(order.order_status)}
                          <select
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            value={order.order_status}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                          >
                            <option value="pending">Chờ xử lý</option>
                            <option value="processing">Đang chuẩn bị</option>
                            <option value="shipped">Đang giao</option>
                            <option value="delivered">Đã giao</option>
                            <option value="cancelled">Hủy đơn</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="p-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-500">
                    Không tìm thấy đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL CHI TIẾT ĐƠN HÀNG --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Chi tiết đơn hàng #{selectedOrder._id.slice(-6).toUpperCase()}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Ngày đặt: {formatDate(selectedOrder.order_date)}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Lưới thông tin 3 cột */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* 1. Người nhận */}
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Package size={18} className="text-blue-600" /> Người nhận
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Tên:</span>{" "}
                    {selectedOrder.user_id?.fullname}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">SĐT:</span>{" "}
                    {selectedOrder.user_id?.phone_number || "---"}
                  </p>
                  <div className="text-sm text-gray-600 mt-2">
                    <span className="font-semibold">Địa chỉ:</span>
                    <p className="bg-white p-2 rounded border border-blue-100 mt-1 text-gray-700 leading-snug">
                      {selectedOrder.shipping_address}
                    </p>
                  </div>
                </div>

                {/* 2. Thanh toán (MỚI) */}
                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <CreditCard size={18} className="text-green-600" /> Thanh
                    toán
                  </h4>
                  {(() => {
                    const status =
                      selectedOrder.payment_id?.payment_status || "pending";
                    const info = getPaymentStatusInfo(status);
                    const Icon = info.icon;
                    return (
                      <>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-semibold">Phương thức:</span>{" "}
                          {selectedOrder.payment_method ||
                            selectedOrder.payment_id?.payment_method ||
                            "COD"}
                        </p>
                        <div className="mt-2">
                          <span className="font-semibold text-sm text-gray-600">
                            Trạng thái:
                          </span>
                          <div
                            className={`flex items-center gap-2 mt-1 px-3 py-1.5 rounded-lg border w-fit font-medium text-sm ${info.color}`}
                          >
                            <Icon size={16} /> {info.text}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* 3. Đơn hàng & Ghi chú */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Truck size={18} className="text-gray-600" /> Vận chuyển
                  </h4>
                  <div className="mb-3">
                    <span className="font-semibold text-sm text-gray-600 block mb-1">
                      Trạng thái đơn:
                    </span>
                    {getStatusBadge(selectedOrder.order_status)}
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Ghi chú:</span> <br />
                    <span className="italic text-gray-500">
                      {selectedOrder.note || "Không có ghi chú"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <h4 className="font-bold text-gray-800 mb-4 border-b pb-2 flex justify-between items-center">
                <span>Danh sách sản phẩm</span>
                <span className="text-sm font-normal text-gray-500">
                  {orderItems.length} sản phẩm
                </span>
              </h4>

              {loadingItems ? (
                <div className="py-8 text-center">
                  <Loader2 className="animate-spin mx-auto text-blue-500" />
                </div>
              ) : (
                <div className="border rounded-xl overflow-hidden border-gray-200">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                      <tr>
                        <th className="p-3">Sản phẩm</th>
                        <th className="p-3 text-right">Đơn giá</th>
                        <th className="p-3 text-center">SL</th>
                        <th className="p-3 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orderItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                                {item.product_id?.image_url && (
                                  <img
                                    src={item.product_id.image_url}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <span className="text-sm font-medium text-gray-800 line-clamp-2">
                                {item.product_id?.product_name ||
                                  "Sản phẩm đã bị xóa"}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-right text-sm text-gray-600">
                            {formatCurrency(item.unit_price)}
                          </td>
                          <td className="p-3 text-center text-sm font-bold text-gray-800">
                            x{item.quantity}
                          </td>
                          <td className="p-3 text-right text-sm font-bold text-blue-600">
                            {formatCurrency(item.subtotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end items-center gap-4">
              <span className="text-gray-500 font-medium">Tổng thanh toán:</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatCurrency(selectedOrder.total_amount)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManager;