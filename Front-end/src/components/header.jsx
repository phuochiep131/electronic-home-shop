import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginClick = () => {
    const stateData = {
      action: "redirect",
      url: location.pathname,
    };
    navigate("/login", { state: stateData });
  };

  // Lớp CSS dùng chung cho các <Link> điều hướng
  const navLinkStyles =
    "no-underline text-[#34495e] font-semibold pb-[5px] relative transition-colors duration-300 ease-in-out hover:text-[#3498db] " +
    "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#3498db] " +
    "after:transition-all after:duration-300 after:ease-in-out hover:after:w-full";

  // Lớp CSS dùng chung cho các button
  const btnBaseStyles =
    "px-[22px] py-[10px] rounded-[5px] cursor-pointer font-bold transition-all duration-300 ease-in-out text-[0.9em]";

  return (
    <header className="bg-white py-[15px] shadow-md sticky top-0 z-[1000] w-full">
      <div className="flex justify-between items-center w-[90%] max-w-[1200px] mx-auto">
        <div className="logo">
          {/* <img src={logo} alt="Electronic Home Shop" /> */}
          <Link
            to="/"
            className="no-underline text-2xl font-bold text-[#2c3e50] tracking-[-1px]"
          >
            E-HOME
          </Link>
        </div>

        {/* Nút Hamburger cho di động */}
        <button
          className="block lg:hidden bg-transparent border-none text-2xl cursor-pointer text-gray-800 z-[1100]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </button>

        {/* Menu điều hướng */}
        <nav
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } flex-col absolute top-[70px] left-0 w-full bg-white shadow-lg py-5 text-center 
             lg:flex lg:flex-row lg:static lg:w-auto lg:bg-transparent lg:shadow-none lg:py-0`}
        >
          <ul className="m-0 p-0 list-none flex flex-col lg:flex-row lg:space-x-[30px]">
            <li className="my-[15px] lg:my-0">
              <Link to="/" className={navLinkStyles}>
                Trang chủ
              </Link>
            </li>
            <li className="my-[15px] lg:my-0">
              <Link to="/products" className={navLinkStyles}>
                Sản phẩm
              </Link>
            </li>
            <li className="my-[15px] lg:my-0">
              <Link to="/deals" className={navLinkStyles}>
                Khuyến mãi
              </Link>
            </li>
            <li className="my-[15px] lg:my-0">
              <Link to="/contact" className={navLinkStyles}>
                Liên hệ
              </Link>
            </li>
          </ul>
        </nav>

        {/* Nút Đăng nhập / Đăng ký */}
        <div className="hidden lg:flex items-center">
          <button
            className={`${btnBaseStyles} bg-transparent text-[#3498db] border-2 border-[#3498db] mr-2.5 hover:bg-[#3498db] hover:text-white`}
            onClick={() => handleLoginClick()}
          >
            Đăng nhập
          </button>
          <button
            className={`${btnBaseStyles} bg-[#3498db] text-white border-2 border-[#3498db] hover:bg-[#2980b9] hover:border-[#2980b9]`}
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
