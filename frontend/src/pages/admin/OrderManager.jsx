import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Package,
  Search,
  Eye,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  CreditCard,
  Loader2,
  Truck,
  X,
  Banknote, // Icon mới cho phương thức thanh toán
  RefreshCw, // Icon update
} from "lucide-react";

const API_BASE = "http://localhost:5000/api";

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- UI States (Filters) ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // Trạng thái đơn hàng
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all"); // MỚI: Trạng thái thanh toán
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all"); // MỚI: Phương thức thanh toán

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

  // --- ACTIONS: CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG ---
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Optimistic Update (Cập nhật giao diện trước khi gọi API để mượt mà)
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, order_status: newStatus } : o,
        ),
      );

      await axios.put(
        `${API_BASE}/orders/admin/status/${orderId}`,
        { status: newStatus },
        { withCredentials: true },
      );
    } catch (error) {
      alert("Lỗi cập nhật trạng thái đơn: " + error.response?.data?.message);
      fetchOrders(); // Revert lại nếu lỗi
    }
  };

  // --- ACTIONS (MỚI): CẬP NHẬT TRẠNG THÁI THANH TOÁN ---
  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    try {
      // Optimistic Update
      setOrders((prev) =>
        prev.map((o) => {
          if (o._id === orderId) {
            return {
              ...o,
              payment_id: {
                ...o.payment_id,
                payment_status: newPaymentStatus,
              },
            };
          }
          return o;
        }),
      );

      // Gọi API (Giả định bạn đã có route này, nếu chưa hãy xem phần Backend bên dưới)
      await axios.put(
        `${API_BASE}/orders/admin/payment-status/${orderId}`,
        { payment_status: newPaymentStatus },
        { withCredentials: true },
      );

      alert("Cập nhật thanh toán thành công!");
    } catch (error) {
      console.error(error);
      alert(
        "Lỗi cập nhật thanh toán: " +
          (error.response?.data?.message || "Lỗi server"),
      );
      fetchOrders(); // Revert
    }
  };

  const handleViewDetails = async (order) => {
    setSelectedOrder(order);
    setLoadingItems(true);
    try {
      const res = await axios.get(
        `${API_BASE}/orders/admin/${order._id}/items`,
        { withCredentials: true },
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

  // Badge cho Order Status
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
        className={`px-3 py-1 rounded text-xs font-bold border flex items-center gap-1 ${styles[status] || styles.pending}`}
      >
        {labels[status] || status}
      </span>
    );
  };

  // Config cho Payment Status (Màu sắc & Icon)
  const getPaymentStatusConfig = (status) => {
    switch (status) {
      case "completed":
        return {
          text: "Đã thanh toán",
          color: "text-emerald-700 bg-emerald-50 border-emerald-200",
          icon: CheckCircle2,
        };
      case "failed":
        return {
          text: "Thất bại",
          color: "text-rose-700 bg-rose-50 border-rose-200",
          icon: AlertCircle,
        };
      case "pending":
      default:
        return {
          text: "Chờ thanh toán",
          color: "text-amber-700 bg-amber-50 border-amber-200",
          icon: Clock,
        };
    }
  };

  // --- FILTER LOGIC (CẬP NHẬT) ---
  const filteredOrders = orders.filter((order) => {
    // 1. Search Text
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_id?.fullname?.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Order Status
    const matchesStatus =
      statusFilter === "all" || order.order_status === statusFilter;

    // 3. Payment Status (Kiểm tra null safety)
    const currentPaymentStatus = order.payment_id?.payment_status || "pending";
    const matchesPaymentStatus =
      paymentStatusFilter === "all" ||
      currentPaymentStatus === paymentStatusFilter;

    // 4. Payment Method
    const currentMethod =
      order.payment_method || order.payment_id?.payment_method || "COD";
    const matchesPaymentMethod =
      paymentMethodFilter === "all" || currentMethod === paymentMethodFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPaymentStatus &&
      matchesPaymentMethod
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-10 font-sans p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
            <Package className="text-blue-600" /> Quản lý Đơn hàng
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Tổng số: <span className="font-bold">{filteredOrders.length}</span>{" "}
            / {orders.length} đơn hàng
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="p-2 bg-white border rounded hover:bg-slate-50 text-slate-600 shadow-sm"
          title="Làm mới"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Toolbar Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col xl:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Tìm mã đơn, tên khách..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </div>

        {/* Filter Group */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Filter Order Status */}
          <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-2 bg-slate-50">
            <Filter size={16} className="text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent py-2 text-sm outline-none text-slate-700 font-medium cursor-pointer min-w-[140px]"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="processing">Đang chuẩn bị</option>
              <option value="shipped">Đang giao hàng</option>
              <option value="delivered">Đã giao hàng</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          {/* Filter Payment Status (MỚI) */}
          <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-2 bg-slate-50">
            <CreditCard size={16} className="text-slate-500" />
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="bg-transparent py-2 text-sm outline-none text-slate-700 font-medium cursor-pointer min-w-[140px]"
            >
              <option value="all">Tất cả thanh toán</option>
              <option value="pending">Chờ thanh toán</option>
              <option value="completed">Đã thanh toán</option>
              <option value="failed">Thất bại</option>
            </select>
          </div>

          {/* Filter Payment Method (MỚI) */}
          <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-2 bg-slate-50">
            <Banknote size={16} className="text-slate-500" />
            <select
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              className="bg-transparent py-2 text-sm outline-none text-slate-700 font-medium cursor-pointer min-w-[130px]"
            >
              <option value="all">Mọi phương thức</option>
              <option value="COD">COD (Tiền mặt)</option>
              <option value="VNPAY">VNPAY</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs uppercase font-bold border-b border-slate-200">
                <th className="py-4 px-6">Mã đơn</th>
                <th className="py-4 px-6">Khách hàng</th>
                <th className="py-4 px-6">Ngày đặt</th>
                <th className="py-4 px-6">Thanh toán (Update)</th>
                <th className="py-4 px-6 text-right">Tổng tiền</th>
                <th className="py-4 px-6">Trạng thái đơn</th>
                <th className="py-4 px-6 text-center">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-600 divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <Loader2
                      className="animate-spin mx-auto text-blue-500"
                      size={32}
                    />
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const paymentStatus =
                    order.payment_id?.payment_status || "pending";
                  const paymentMethod =
                    order.payment_method ||
                    order.payment_id?.payment_method ||
                    "COD";
                  const pConfig = getPaymentStatusConfig(paymentStatus);
                  const PIcon = pConfig.icon;

                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="py-4 px-6 font-mono font-medium text-blue-600">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-700">
                          {order.user_id?.fullname || "Khách lẻ"}
                        </div>
                        <div className="text-xs text-slate-400">
                          {order.user_id?.phone_number || "---"}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {formatDate(order.order_date)}
                      </td>

                      {/* CỘT THANH TOÁN (Đã sửa để cho phép cập nhật) */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1.5">
                          <span className="font-bold text-slate-700 text-xs flex items-center gap-1">
                            <Banknote size={12} /> {paymentMethod}
                          </span>

                          {/* Dropdown Update Payment Status */}
                          <div
                            className={`relative w-fit flex items-center gap-1 px-2 py-1 rounded border text-[11px] font-bold uppercase cursor-pointer transition-colors ${pConfig.color}`}
                          >
                            <PIcon size={12} />
                            <select
                              className="bg-transparent outline-none appearance-none cursor-pointer pr-4 w-full"
                              value={paymentStatus}
                              onChange={(e) =>
                                handlePaymentStatusChange(
                                  order._id,
                                  e.target.value,
                                )
                              }
                            >
                              <option
                                value="pending"
                                className="bg-white text-slate-700"
                              >
                                Chờ Thanh toán
                              </option>
                              <option
                                value="completed"
                                className="bg-white text-slate-700"
                              >
                                Đã Thanh toán
                              </option>
                              <option
                                value="failed"
                                className="bg-white text-slate-700"
                              >
                                Thất bại
                              </option>
                            </select>
                            {/* Mũi tên giả */}
                            <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                              ▼
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right font-bold text-slate-800 text-base">
                        {formatCurrency(order.total_amount)}
                      </td>

                      {/* Cột Trạng Thái Đơn */}
                      <td className="py-4 px-6">
                        <div className="relative w-fit cursor-pointer hover:brightness-95 transition-all">
                          {getStatusBadge(order.order_status)}
                          <select
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
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
                          className="p-2 bg-white border border-slate-200 text-slate-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="py-16 text-center text-slate-400 italic"
                  >
                    Không tìm thấy đơn hàng nào phù hợp bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL CHI TIẾT (Giữ nguyên hoặc chỉnh sửa nhỏ) --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  Đơn hàng #{selectedOrder._id.slice(-6).toUpperCase()}
                </h3>
                <p className="text-xs text-slate-500">
                  Ngày tạo: {formatDate(selectedOrder.order_date)}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {/* Nội dung Modal (Tôi đã giữ nguyên cấu trúc cũ nhưng clean lại class một chút) */}
              {/* ... (Phần nội dung modal giống code cũ của bạn) ... */}
              {/* Để tiết kiệm không gian hiển thị, phần render items modal giữ nguyên như cũ vì logic không đổi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                    <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-2">
                      <Package size={16} /> Thông tin giao hàng
                    </h4>
                    <p className="text-sm">
                      <strong>Người nhận:</strong>{" "}
                      {selectedOrder.user_id?.fullname}
                    </p>
                    <p className="text-sm">
                      <strong>SĐT:</strong>{" "}
                      {selectedOrder.user_id?.phone_number}
                    </p>
                    <p className="text-sm mt-1 bg-white p-2 rounded border border-blue-100">
                      {selectedOrder.shipping_address}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                    <h4 className="font-bold text-emerald-800 flex items-center gap-2 mb-2">
                      <CreditCard size={16} /> Thông tin thanh toán
                    </h4>
                    <p className="text-sm">
                      <strong>Phương thức:</strong>{" "}
                      {selectedOrder.payment_method || "COD"}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <strong>Trạng thái:</strong>
                      <span
                        className={`text-xs px-2 py-0.5 rounded border uppercase font-bold ${getPaymentStatusConfig(selectedOrder.payment_id?.payment_status).color}`}
                      >
                        {
                          getPaymentStatusConfig(
                            selectedOrder.payment_id?.payment_status,
                          ).text
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-100 text-slate-600 font-bold">
                    <tr>
                      <th className="p-3">Sản phẩm</th>
                      <th className="p-3 text-right">Giá</th>
                      <th className="p-3 text-center">SL</th>
                      <th className="p-3 text-right">Tổng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loadingItems ? (
                      <tr>
                        <td colSpan="4" className="text-center p-4">
                          <Loader2 className="animate-spin mx-auto" />
                        </td>
                      </tr>
                    ) : (
                      orderItems.map((item, i) => (
                        <tr key={i}>
                          <td className="p-3 max-w-[200px] truncate">
                            {item.product_id?.product_name}
                          </td>
                          <td className="p-3 text-right">
                            {formatCurrency(item.unit_price)}
                          </td>
                          <td className="p-3 text-center">x{item.quantity}</td>
                          <td className="p-3 text-right font-bold">
                            {formatCurrency(item.subtotal)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t flex justify-end">
              <div className="text-xl font-bold text-slate-800">
                Tổng cộng:{" "}
                <span className="text-blue-600">
                  {formatCurrency(selectedOrder.total_amount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManager;
