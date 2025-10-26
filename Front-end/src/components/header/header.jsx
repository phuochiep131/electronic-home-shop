import React, { useState, useEffect, useRef } from "react";
import "./header.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import defaultAvatar from '../../assets/default_avt.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const popupRef = useRef(null);

  const { state, dispatch } = useAuth();
  const { currentUser, loading } = state;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsPopupOpen(false);
      }
    };
    if (isPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupOpen]);

  const handleLoginClick = () => {
    navigate("/login", { state: { from: location } });
  };

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:5000/api/auth/logout', {
        withCredentials: true,
      });
      dispatch({ type: 'AUTH_FAILURE' }); 
      setIsPopupOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
};

if (loading) {
    return null;
  }
  return (
    <header className="site-header">
      <div className="container">
        <div className="logo">
          <Link to="/">E-HOME</Link>
        </div>

        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </button>

        <nav className={`main-nav ${isMenuOpen ? "active" : ""}`}>
          <ul>
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/products">Sản phẩm</Link></li>
            <li><Link to="/deals">Khuyến mãi</Link></li>
            <li><Link to="/contact">Liên hệ</Link></li>
          </ul>
        </nav>

        <div className="header-actions">
          {currentUser ? (
            // --- GIAO DIỆN KHI ĐÃ ĐĂNG NHẬP ---
            <div className="user-section">
              <Link to="/cart" className="cart-icon">
                <i className="fas fa-shopping-cart"></i>
              </Link>
              <div className="user-avatar">
                <img
                  src={currentUser && currentUser.avatar ? currentUser.avatar : defaultAvatar} // Thêm 1 avatar mặc định
                  alt="User Avatar"
                  onClick={() => setIsPopupOpen(!isPopupOpen)}
                />
                {isPopupOpen && (
                  <div className="user-popup" ref={popupRef}>
                    <div className="popup-user-info">
                      <strong>{currentUser.fullname}</strong>
                      <span>{currentUser.email}</span>
                    </div>
                    <hr />
                    {/* Phân quyền cho Admin */}
                    {currentUser.role === 'Admin' && (
                      <Link to="/admin/dashboard" onClick={() => setIsPopupOpen(false)}>
                        <i className="fas fa-tachometer-alt"></i> Quản trị
                      </Link>
                    )}
                    <Link to="/profile" onClick={() => setIsPopupOpen(false)}>
                      <i className="fas fa-user"></i> Tài khoản của tôi
                    </Link>
                    <Link to="/orders" onClick={() => setIsPopupOpen(false)}>
                      <i className="fas fa-box"></i> Đơn hàng
                    </Link>
                    <div className="popup-logout" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt"></i> Đăng xuất
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // --- GIAO DIỆN KHI CHƯA ĐĂNG NHẬP ---
            <>
              <button className="btn btn-login" onClick={handleLoginClick}>
                Đăng nhập
              </button>
              <button className="btn btn-signup" onClick={() => navigate("/register")}>
                Đăng ký
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;