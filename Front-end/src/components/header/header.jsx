import React, { useState } from "react";
import "./header.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

// import logo from '../../assets/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    const stateData = {
      action: "redirect",
      url: location.pathname,
    };

    navigate("/login", { state: stateData });
  };

  return (
    <header className="site-header">
      <div className="container">
        <div className="logo">
          {/* <img src={logo} alt="Electronic Home Shop" /> */}
          <a href="/">E-HOME</a>
        </div>

        {/* Nút Hamburger cho di động */}
        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </button>

        <nav className={`main-nav ${isMenuOpen ? "active" : ""}`}>
          <ul>
            <li>
              <a href="/">Trang chủ</a>
            </li>
            <li>
              <a href="/products">Sản phẩm</a>
            </li>
            <li>
              <a href="/deals">Khuyến mãi</a>
            </li>
            <li>
              <a href="/contact">Liên hệ</a>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <button className="btn btn-login" onClick={() => handleLoginClick()}>
            Đăng nhập
          </button>
          <button
            className="btn btn-signup"
            onClick={() => navigate("/register")}
          >
            Đăng ký
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
