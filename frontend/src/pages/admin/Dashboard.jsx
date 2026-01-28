import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Zap,
  Monitor,
  Users,
  TrendingUp,
  Cpu,
  ArrowRight,
  Activity,
  AlertTriangle,
  HardDrive,
  BatteryCharging,
  Smartphone,
  Trophy,
  Box, // Icon hộp hàng
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api/dashboard";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Format tiền VND
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  // Config màu sắc trạng thái đơn hàng (Tech/Minimalist style)
  const statusConfig = {
    pending: { label: "Chờ duyệt", color: "bg-amber-100 text-amber-700" },
    processing: { label: "Đang xử lí", color: "bg-blue-100 text-blue-700" },
    shipped: { label: "Đang giao", color: "bg-indigo-100 text-indigo-700" },
    delivered: {
      label: "Giao hoàn tất",
      color: "bg-emerald-100 text-emerald-700",
    },
    cancelled: { label: "Đã hủy", color: "bg-rose-100 text-rose-700" },
    default: { label: "N/A", color: "bg-gray-100 text-gray-600" },
  };

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.default;
    return (
      <span
        className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API_URL, { withCredentials: true });
        if (res.data.success) {
          setDashboardData(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi tải dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
      </div>
    );

  if (!dashboardData)
    return <div className="p-10 text-center">Không có dữ liệu.</div>;

  const { stats, chartData, topProducts, deadStockProducts, recentOrders } =
    dashboardData;

  // Xử lý data biểu đồ cho đủ 12 tháng
  const revenueChartData = Array.from({ length: 12 }, (_, i) => {
    const monthData = chartData.find((item) => item._id === i + 1);
    return { name: `T${i + 1}`, revenue: monthData ? monthData.revenue : 0 };
  });

  const cards = [
    {
      label: "Doanh thu tháng",
      val: formatCurrency(stats.revenueThisMonth),
      icon: <Zap size={20} className="text-white" />,
      bg: "bg-cyan-600",
    },
    {
      label: "Đơn hàng mới",
      val: stats.ordersThisMonth,
      icon: <Monitor size={20} className="text-white" />,
      bg: "bg-blue-600",
    },
    {
      label: "Khách hàng",
      val: stats.users,
      icon: <Users size={20} className="text-white" />,
      bg: "bg-indigo-600",
    },
    {
      label: "Tổng tồn kho",
      val: stats.productsInStock,
      icon: <HardDrive size={20} className="text-white" />,
      bg: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Cpu className="text-cyan-600" /> Tech Dashboard
          </h1>
          <p className="text-sm text-slate-500">Quản lý cửa hàng điện tử</p>
        </div>
        <div className="px-3 py-1 bg-white border border-slate-200 rounded text-sm text-slate-600">
          {new Date().toLocaleDateString("vi-VN")}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">
                  {c.label}
                </p>
                <h3 className="text-xl font-bold text-slate-800 mt-1">
                  {c.val}
                </h3>
              </div>
              <div className={`p-2 rounded-lg shadow-sm ${c.bg}`}>{c.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-cyan-600" /> Doanh thu năm nay
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  tickFormatter={(v) => `${v / 1000000}M`}
                />
                <Tooltip formatter={(v) => [formatCurrency(v), "Doanh thu"]} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products - Bán chạy */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Trophy size={18} className="text-yellow-500" /> Thiết bị bán chạy
          </h3>
          <div className="overflow-y-auto flex-1 pr-1 space-y-3 custom-scrollbar max-h-[300px]">
            {topProducts.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded transition"
              >
                <div className="w-10 h-10 rounded bg-slate-100 relative overflow-hidden flex-shrink-0 border border-slate-200">
                  {p.image ? (
                    <img
                      src={p.image}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  ) : (
                    <Smartphone
                      className="m-auto mt-2 text-slate-300"
                      size={16}
                    />
                  )}
                  <div className="absolute top-0 left-0 bg-cyan-600 text-white text-[8px] font-bold px-1.5 rounded-br">
                    #{i + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {p.name}
                  </p>
                  <div className="flex gap-2 text-[10px] text-slate-400 mt-0.5">
                    <span>Đã bán: {p.totalSold}</span>
                    {p.warranty && (
                      <span className="text-cyan-600 border border-cyan-100 px-1 rounded">
                        BH: {p.warranty}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-700">
                    {formatCurrency(p.revenue)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dead Stock - Hàng Ế (ĐÃ UPDATE GIAO DIỆN GIỐNG BÁN CHẠY) */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 border-l-4 border-l-red-500 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-500" /> Sản phẩm ế
            </h3>
            <span className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded border border-red-100 font-bold">
              Cần xả kho
            </span>
          </div>

          <div className="overflow-y-auto flex-1 pr-1 space-y-3 custom-scrollbar max-h-[300px]">
            {deadStockProducts && deadStockProducts.length > 0 ? (
              deadStockProducts.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 hover:bg-red-50 rounded transition group cursor-pointer"
                >
                  {/* Cột 1: Ảnh & Badge */}
                  <div className="w-10 h-10 rounded bg-slate-100 relative overflow-hidden flex-shrink-0 border border-slate-200">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                        alt=""
                      />
                    ) : (
                      <BatteryCharging
                        className="m-auto mt-2 text-slate-300"
                        size={16}
                      />
                    )}
                    {/* Badge thứ tự cảnh báo */}
                    <div className="absolute top-0 left-0 bg-red-500 text-white text-[8px] font-bold px-1.5 rounded-br">
                      #{i + 1}
                    </div>
                  </div>

                  {/* Cột 2: Tên & Số lượng tồn */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium text-slate-700 truncate group-hover:text-red-700 transition-colors"
                      title={p.product_name}
                    >
                      {p.product_name}
                    </p>
                    <div className="flex gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1 text-red-600 font-bold bg-red-50 px-1.5 rounded">
                        <Box size={10} /> Tồn: {p.quantity}
                      </span>
                    </div>
                  </div>

                  {/* Cột 3: Giá vốn */}
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-700">
                      {formatCurrency(p.price)}
                    </p>
                    <p className="text-[9px] text-slate-400">Giá vốn</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 py-10">
                <Box size={32} className="mb-2 opacity-50" />
                <p className="text-sm italic">Kho hàng đang vận hành tốt.</p>
                <p className="text-xs">Không có sản phẩm tồn quá hạn.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">Đơn hàng mới nhất</h3>
            <Link
              to="/admin/orders"
              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
            >
              Xem tất cả <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-400 uppercase bg-slate-50">
                <tr>
                  <th className="p-2 pl-3">Mã đơn</th>
                  <th className="p-2">Khách hàng</th>
                  <th className="p-2">Trạng thái</th>
                  <th className="p-2 text-right pr-3">Tổng</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr
                    key={o._id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-3 font-mono text-xs text-slate-500 font-medium">
                      #{o._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="p-3 font-medium text-slate-700 truncate max-w-[120px]">
                      {o.user_id?.fullname || "Khách vãng lai"}
                    </td>
                    <td className="p-3">{getStatusBadge(o.order_status)}</td>
                    <td className="p-3 text-right font-bold text-slate-700">
                      {formatCurrency(o.total_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
