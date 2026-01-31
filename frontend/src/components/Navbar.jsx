import React, { useState, useEffect, useRef } from "react";
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

const API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000/api";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  // --- STATE TÌM KIẾM ---
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // --- STATE SCROLL ---
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const lastScrollY = useRef(0);

  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const { state, dispatch } = useAuth();
  const { currentUser } = state;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  // Logic Search & Click Outside (Giữ nguyên)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (keyword.trim().length > 1) {
        try {
          const res = await axios.get(
            `${API_URL}/products?keyword=${encodeURIComponent(keyword.trim())}`
          );
          setSuggestions(res.data.slice(0, 5));
          setShowSuggestions(true);
        } catch (error) {
          console.error(error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [keyword]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- XỬ LÝ SCROLL (Optimized) ---
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Threshold: 10px để tránh rung lắc
      if (Math.abs(currentScrollY - lastScrollY.current) < 10) return;

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsScrollingDown(true); // Cuộn xuống -> Ẩn
      } else {
        setIsScrollingDown(false); // Cuộn lên -> Hiện
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Các hàm xử lý sự kiện (Giữ nguyên)
  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
      setShowSuggestions(false);
      setIsMobileMenuOpen(false);
    }
  };

  const handleSuggestionClick = (productId) => {
    navigate(`/product/${productId}`);
    setShowSuggestions(false);
    setKeyword("");
  };

  const handleLoginClick = () => {
    navigate("/login", { state: { from: location } });
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${API_URL}/auth/logout`, { withCredentials: true });
      dispatch({ type: "AUTH_FAILURE" });
      navigate("/");
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActiveCategory = (catId) =>
    location.pathname === `/category/${catId}`;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    // QUAN TRỌNG: Dùng fixed để tách khỏi dòng chảy layout -> Không bị giật
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md transition-all duration-300">
      {/* --- 1. TOP BAR --- */}
      {/* Sử dụng style inline để transition height mượt mà như CouponTicker */}
      <div
        className="bg-blue-600 text-white text-xs overflow-hidden transition-all duration-500 ease-in-out"
        style={{
          height: isScrollingDown ? "0px" : "32px", // 32px ~ h-8
          opacity: isScrollingDown ? 0 : 1,
        }}
      >
        <div className="container mx-auto px-4 h-full flex justify-between items-center">
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

      {/* --- 2. MAIN HEADER (SEARCH) - Luôn hiển thị --- */}
      <div className="container mx-auto px-4 py-4 bg-white relative z-50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Toggle */}
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

          {/* Search Input */}
          <div className="relative w-full md:max-w-xl" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Bạn cần tìm gì hôm nay?..."
                className="w-full py-2 pl-4 pr-12 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Search size={20} />
              </button>
            </form>
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white shadow-xl rounded-xl mt-2 border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                <ul>
                  {suggestions.map((product) => {
                    const price =
                      product.price * (1 - (product.discount || 0) / 100);
                    return (
                      <li
                        key={product._id}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-none flex items-center gap-3 transition-colors"
                        onClick={() => handleSuggestionClick(product._id)}
                      >
                        <img
                          src={
                            product.image_url || "https://placehold.co/50x50"
                          }
                          alt={product.product_name}
                          className="w-10 h-10 object-contain rounded border border-gray-200"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-800 line-clamp-1">
                            {product.product_name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-red-600">
                              {formatCurrency(price)}
                            </span>
                            {product.discount > 0 && (
                              <span className="text-[10px] text-gray-400 line-through">
                                -{product.discount}%
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                  <li
                    className="p-2 text-center text-blue-600 text-sm font-medium hover:bg-blue-50 cursor-pointer"
                    onClick={(e) => handleSearch(e)}
                  >
                    Xem tất cả kết quả cho "{keyword}"
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-6">
            <div className="relative group z-20">
              <div className="flex flex-col items-center cursor-pointer pb-2 md:pb-0">
                {currentUser ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                    <img
                      src={currentUser.avatar || defaultAvatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
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
              {/* Dropdown User (Giữ nguyên nội dung) */}
              <div className="absolute right-0 top-full mt-0 w-60 bg-white rounded-lg shadow-xl border border-gray-100 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200">
                {currentUser ? (
                  <div className="py-2">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {currentUser.fullname}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {currentUser.email}
                      </p>
                    </div>
                    <div className="p-1">
                      {(currentUser.role === "Admin" ||
                        currentUser.role === "admin") && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
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
                        to="/my-orders"
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
      {/* Thay vì dùng class, dùng style inline để control height tuyệt đối */}
      <nav
        className={`bg-gray-50 border-gray-200 transition-all duration-500 ease-in-out origin-top overflow-hidden ${
          isMobileMenuOpen ? "block h-auto" : "hidden md:block"
        }`}
        style={{
          // Nếu mobile menu mở thì để auto, nếu không thì transition theo scroll
          height: isMobileMenuOpen ? "auto" : isScrollingDown ? "0px" : "48px", // 48px là chiều cao ước lượng của nav
          opacity: isMobileMenuOpen ? 1 : isScrollingDown ? 0 : 1,
          borderTopWidth: isScrollingDown ? "0px" : "1px",
        }}
      >
        <div className="container mx-auto px-4">
          <ul className="flex flex-col md:flex-row md:items-center md:gap-8 py-2 md:py-0">
            {/* Mobile Auth (Hidden on Desktop) */}
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
                  <button
                    onClick={handleLogout}
                    className="w-full text-center py-2 bg-red-100 text-red-600 rounded-md font-medium text-sm"
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

            {categories.map((cat) => (
              <li
                key={cat._id}
                className="py-2 md:py-3 border-b md:border-none"
              >
                <Link
                  to={`/category/${cat._id}`}
                  className={`block transition-colors ${
                    isActiveCategory(cat._id)
                      ? "text-blue-600 font-bold border-b-2 border-blue-600 md:pb-[10px]"
                      : "text-gray-700 font-medium hover:text-blue-600"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
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
