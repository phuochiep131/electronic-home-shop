import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  LogOut,
  Settings,
} from "lucide-react";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  // Hàm đăng xuất dành riêng cho Admin
  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/api/auth/logout", {
        withCredentials: true,
      });
      dispatch({ type: "AUTH_FAILURE" });
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  // Danh sách menu
  const menuItems = [
    {
      path: "/admin/dashboard",
      name: "Tổng quan",
      icon: <LayoutDashboard size={20} />,
    },
    { path: "/admin/products", name: "Sản phẩm", icon: <Package size={20} /> },
    {
      path: "/admin/orders",
      name: "Đơn hàng",
      icon: <ShoppingCart size={20} />,
    },
    { path: "/admin/users", name: "Người dùng", icon: <Users size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-blue-400">
            Admin<span className="text-white">Panel</span>
          </h1>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-slate-300 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm py-4 px-8 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Quản trị hệ thống</h2>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
              A
            </div>
            <span className="text-sm font-medium">Administrator</span>
          </div>
        </header>

        <div className="p-8">
          {/* Nội dung thay đổi sẽ hiện ở đây */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
