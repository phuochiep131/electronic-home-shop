import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  User,
  Heart,
  Phone,
  LogIn,
  UserPlus,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Package,
  UserCircle,
} from "lucide-react";

// --- IMPORT CONTEXT ---
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import defaultAvatar from "../assets/react.svg";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();

  // Lấy state từ AuthContext
  const { state, dispatch } = useAuth();
  const { currentUser } = state;

  // Xử lý chuyển hướng đến trang login
  const handleLoginClick = () => {
    navigate("/login", { state: { from: location } });
    setIsMobileMenuOpen(false);
  };

  // Xử lý đăng xuất
  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/api/auth/logout", {
        withCredentials: true,
      });
      dispatch({ type: "AUTH_FAILURE" });
      navigate("/");
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const categories = [
    { name: "Tủ lạnh", path: "/category/tu-lanh" },
    { name: "Máy giặt", path: "/category/may-giat" },
    { name: "Nồi cơm điện", path: "/category/noi-com-dien" },
    { name: "Điều hòa", path: "/category/dieu-hoa" },
    { name: "Gia dụng bếp", path: "/category/gia-dung-bep" },
  ];

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50 font-sans">
      {/* --- 1. TOP BAR --- */}
      <div className="bg-blue-600 text-white text-xs py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <p className="hidden md:block">
            Chào mừng đến với ElectroShop - Hàng chính hãng 100%
          </p>
          <div className="flex items-center gap-4 mx-auto md:mx-0">
            <span className="flex items-center gap-1 hover:text-gray-200 cursor-pointer">
              <Phone size={14} /> Hotline: 1900 1234
            </span>
            <span className="hover:text-gray-200 cursor-pointer">
              Tra cứu đơn hàng
            </span>
          </div>
        </div>
      </div>

      {/* --- 2. MAIN HEADER --- */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Mobile Toggle */}
          <div className="flex justify-between items-center w-full md:w-auto">
            <Link
              to="/"
              className="text-2xl font-bold text-blue-700 flex items-center gap-2"
            >
              Electro<span className="text-orange-500">Shop</span>
            </Link>

            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:max-w-xl">
            <input
              type="text"
              placeholder="Bạn cần tìm gì hôm nay?..."
              className="w-full py-2 pl-4 pr-12 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition-colors">
              <Search size={20} />
            </button>
          </div>

          {/* User Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {/* --- USER ACCOUNT DROPDOWN --- */}
            <div className="relative group z-20">
              <div className="flex flex-col items-center cursor-pointer pb-2 md:pb-0">
                {currentUser ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                    <img
                      src={currentUser.avatar || defaultAvatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      // Fallback nếu ảnh lỗi
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/100x100?text=User";
                      }}
                    />
                  </div>
                ) : (
                  <User
                    size={24}
                    className="text-gray-600 group-hover:text-blue-600 transition-colors"
                  />
                )}

                <span className="text-xs text-gray-500 mt-1 group-hover:text-blue-600 flex items-center gap-0.5 max-w-[100px] truncate">
                  {currentUser ? currentUser.fullname : "Tài khoản"}{" "}
                  <ChevronDown size={10} />
                </span>
              </div>

              {/* Dropdown Menu Content */}
              <div className="absolute right-0 top-full mt-0 w-60 bg-white rounded-lg shadow-xl border border-gray-100 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200">
                {currentUser ? (
                  <div className="py-2">
                    {/* Header Dropdown */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {currentUser.fullname}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {currentUser.email}
                      </p>
                    </div>

                    <div className="p-1">
                      {/* --- KIỂM TRA QUYỀN ADMIN --- */}
                      {(currentUser.role === "Admin" ||
                        currentUser.role === "admin") && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors mb-1 font-semibold"
                        >
                          <LayoutDashboard size={16} /> Trang quản trị
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                      >
                        <UserCircle size={16} /> Hồ sơ cá nhân
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                      >
                        <Package size={16} /> Đơn mua
                      </Link>

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors text-left"
                      >
                        <LogOut size={16} /> Đăng xuất
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 space-y-2">
                    <button
                      onClick={handleLoginClick}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                    >
                      <LogIn size={16} /> Đăng nhập
                    </button>
                    <Link
                      to="/register"
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                    >
                      <UserPlus size={16} /> Đăng ký
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center cursor-pointer group">
              <Heart
                size={24}
                className="text-gray-600 group-hover:text-red-500 transition-colors"
              />
              <span className="text-xs text-gray-500 mt-1">Yêu thích</span>
            </div>

            <Link
              to="/cart"
              className="flex flex-col items-center cursor-pointer group relative"
            >
              <div className="relative">
                <ShoppingCart
                  size={24}
                  className="text-gray-600 group-hover:text-blue-600 transition-colors"
                />
                {/* Hiển thị số lượng thật */}
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500 mt-1">Giỏ hàng</span>
            </Link>
          </div>
        </div>
      </div>

      {/* --- 3. NAVIGATION MENU --- */}
      <nav
        className={`bg-gray-50 border-t border-gray-200 transition-all duration-300 ${
          isMobileMenuOpen ? "block" : "hidden md:block"
        }`}
      >
        <div className="container mx-auto px-4">
          <ul className="flex flex-col md:flex-row md:items-center md:gap-8 py-2 md:py-0">
            {/* --- MOBILE AUTH MENU --- */}
            <li className="md:hidden border-b border-gray-200 pb-2 mb-2">
              {currentUser ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                    <img
                      src={currentUser.avatar || defaultAvatar}
                      alt="avt"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-gray-800">
                        {currentUser.fullname}
                      </p>
                      <p className="text-xs text-gray-500">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/profile"
                      className="text-center py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
                    >
                      Hồ sơ
                    </Link>
                    {(currentUser.role === "Admin" ||
                      currentUser.role === "admin") && (
                      <Link
                        to="/admin/dashboard"
                        className="text-center py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm"
                      >
                        Trang Admin
                      </Link>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center py-2 bg-red-100 text-red-600 rounded-md font-medium text-sm hover:bg-red-200"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 space-y-2">
                  <button
                    onClick={handleLoginClick}
                    className="flex-1 text-center py-2 bg-blue-100 text-blue-700 rounded-md font-medium text-sm"
                  >
                    Đăng nhập
                  </button>
                  <Link
                    to="/register"
                    className="flex-1 text-center py-2 bg-blue-600 text-white rounded-md font-medium text-sm"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </li>

            <li className="py-2 md:py-3 border-b md:border-none">
              <Link
                to="/products"
                className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-2"
              >
                <Menu size={18} /> Tất cả danh mục
              </Link>
            </li>

            {categories.map((cat, index) => (
              <li key={index} className="py-2 md:py-3 border-b md:border-none">
                <Link
                  to={cat.path}
                  className="text-gray-700 font-medium hover:text-blue-600 transition-colors block"
                >
                  {cat.name}
                </Link>
              </li>
            ))}

            <li className="py-2 md:py-3 md:ml-auto text-red-500 font-semibold hover:text-red-600 cursor-pointer">
              🔥 Khuyến mãi hot
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
