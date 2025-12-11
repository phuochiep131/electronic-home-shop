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
  Globe, // Icon quả địa cầu cho nút Trang chủ
  Menu,
  Bell,
  ChevronDown,
  FolderTree, // Icon cho danh mục
} from "lucide-react";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  // Hàm đăng xuất
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
    {
      path: "/admin/categories",
      name: "Quản lý Danh mục",
      icon: <FolderTree size={20} />,
    },
    {
      path: "/admin/products",
      name: "Quản lý Sản phẩm",
      icon: <Package size={20} />,
    },
    {
      path: "/admin/orders",
      name: "Đơn hàng",
      icon: <ShoppingCart size={20} />,
    },
    {
      path: "/admin/users",
      name: "Khách hàng",
      icon: <Users size={20} />,
    },
  ];

  // Tìm tên trang hiện tại để hiển thị lên Header
  const currentPage = menuItems.find((item) => item.path === location.pathname);

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800">
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-[#1e293b] text-white flex flex-col shadow-xl transition-all duration-300 z-20">
        {/* Logo Area */}
        <div className="h-16 flex items-center px-8 border-b border-slate-700 bg-slate-900">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold tracking-wide">
              Admin<span className="text-blue-400">Panel</span>
            </span>
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Menu chính
          </p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 translate-x-1"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span
                  className={
                    isActive
                      ? "text-white"
                      : "text-slate-500 group-hover:text-white"
                  }
                >
                  {item.icon}
                </span>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-700 bg-slate-900/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* --- TOP HEADER (Sticky) --- */}
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex justify-between items-center px-8 sticky top-0 z-10">
          {/* Left: Page Title */}
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-gray-500 hover:text-gray-700">
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-800">
              {currentPage ? currentPage.name : "Trang quản trị"}
            </h2>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-6">
            {/* NÚT VỀ TRANG CHỦ (Yêu cầu của bạn) */}
            <Link
              to="/"
              target="_blank" // Mở tab mới nếu muốn, hoặc bỏ đi để chuyển trang ngay
              className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors bg-gray-100 hover:bg-blue-50 px-3 py-2 rounded-lg"
              title="Về trang chủ cửa hàng"
            >
              <Globe size={18} />
              Xem Website
            </Link>

            {/* Notification Icon (Demo) */}
            <button className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-gray-700">
                  Admin User
                </p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md cursor-pointer hover:shadow-lg transition-shadow">
                A
              </div>
            </div>
          </div>
        </header>

        {/* --- PAGE CONTENT --- */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Hiệu ứng Fade-in nhẹ cho nội dung */}
            <div className="animate-fade-in-up">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
