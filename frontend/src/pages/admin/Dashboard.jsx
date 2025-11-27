import React from "react";
import { DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react";

const Dashboard = () => {
  // Mock data thống kê
  const stats = [
    {
      label: "Tổng doanh thu",
      value: "125.000.000đ",
      icon: <DollarSign size={24} />,
      color: "bg-green-500",
    },
    {
      label: "Đơn hàng mới",
      value: "1,245",
      icon: <ShoppingBag size={24} />,
      color: "bg-blue-500",
    },
    {
      label: "Khách hàng",
      value: "3,500",
      icon: <Users size={24} />,
      color: "bg-purple-500",
    },
    {
      label: "Tăng trưởng",
      value: "+15%",
      icon: <TrendingUp size={24} />,
      color: "bg-orange-500",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Tổng quan báo cáo</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"
          >
            <div
              className={`p-4 rounded-full text-white ${stat.color} shadow-md`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Placeholder */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4">Đơn hàng gần đây</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-500 border-b border-gray-200">
                <th className="py-3 px-4">Mã đơn</th>
                <th className="py-3 px-4">Khách hàng</th>
                <th className="py-3 px-4">Ngày đặt</th>
                <th className="py-3 px-4">Tổng tiền</th>
                <th className="py-3 px-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">#ORD-001</td>
                <td className="py-3 px-4">Nguyễn Văn A</td>
                <td className="py-3 px-4">27/11/2025</td>
                <td className="py-3 px-4">1.500.000đ</td>
                <td className="py-3 px-4">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                    Hoàn thành
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">#ORD-002</td>
                <td className="py-3 px-4">Trần Thị B</td>
                <td className="py-3 px-4">27/11/2025</td>
                <td className="py-3 px-4">500.000đ</td>
                <td className="py-3 px-4">
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                    Chờ xử lý
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
