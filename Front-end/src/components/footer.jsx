import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerTitleStyles =
    "text-[1.2em] mb-5 text-white font-semibold relative pb-2.5 " +
    "after:content-[''] after:absolute after:bottom-0 after:h-[2px] after:w-[50px] after:bg-[#3498db] " +
    "after:left-1/2 after:-translate-x-1/2 md:after:left-0 md:after:translate-x-0";

  const linkStyles =
    "text-[#bdc3c7] no-underline mb-3 inline-block transition-all duration-300 ease-in-out hover:text-white hover:pl-[5px]";

  const iconStyles = "mr-3 text-[#3498db] w-5 text-center";

  const socialIconStyles =
    "text-[#bdc3c7] mr-[15px] text-[1.4em] transition-colors duration-300 ease-in-out hover:text-[#3498db]";

  return (
    <footer className="bg-[#2c3e50] text-[#bdc3c7] pt-[50px] text-[0.9em]">
      <div className="flex flex-col md:flex-row justify-between flex-wrap gap-5 w-[90%] max-w-[1200px] mx-auto text-center md:text-left items-center md:items-start">
        {/* Cột 1: Về chúng tôi */}
        <div className="flex-1 min-w-[250px] mb-[30px]">
          <h3 className={footerTitleStyles}>Về ELECTRONIC-HOME-SHOP</h3>
          <p className="leading-relaxed">
            {" "}
            {/* line-height: 1.8 */}
            Chúng tôi chuyên cung cấp các sản phẩm điện gia dụng chính hãng,
            chất lượng cao với giá cả cạnh tranh. Mang lại sự tiện nghi và hiện
            đại cho ngôi nhà của bạn là sứ mệnh của chúng tôi.
          </p>
        </div>

        {/* Cột 2: Hỗ trợ */}
        <div className="flex-1 min-w-[250px] mb-[30px]">
          <h3 className={footerTitleStyles}>Hỗ trợ khách hàng</h3>
          <ul className="list-none p-0">
            <li>
              <Link to="/faq" className={linkStyles}>
                Câu hỏi thường gặp
              </Link>
            </li>
            <li>
              <Link to="/shipping" className={linkStyles}>
                Chính sách giao hàng
              </Link>
            </li>
            <li>
              <Link to="/warranty" className={linkStyles}>
                Chính sách bảo hành
              </Link>
            </li>
            <li>
              <Link to="/returns" className={linkStyles}>
                Chính sách đổi trả
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 3: Liên hệ */}
        <div className="flex-1 min-w-[250px] mb-[30px]">
          <h3 className={footerTitleStyles}>Thông tin liên hệ</h3>
          <p className="mb-[15px]">
            <i className={`fas fa-map-marker-alt ${iconStyles}`}></i> 123 Đường
            ABC, Quận 1, TP. HCM
          </p>
          <p className="mb-[15px]">
            <i className={`fas fa-phone ${iconStyles}`}></i> Hotline: (028) 3812
            3456
          </p>
          <p className="mb-[15px]">
            <i className={`fas fa-envelope ${iconStyles}`}></i> Email:
            support@electronichomeshop.com
          </p>
          <div className="mt-5">
            <a href="#" aria-label="Facebook" className={socialIconStyles}>
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" aria-label="Instagram" className={socialIconStyles}>
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" aria-label="YouTube" className={socialIconStyles}>
              <i className="fab fa-youtube"></i>
            </a>
            <a href="#" aria-label="Tiktok" className={socialIconStyles}>
              <i className="fab fa-tiktok"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="text-center py-5 mt-[30px] border-t border-[#34495e]">
        <p>&copy; 2025 ELECTRONIC-HOME-SHOP. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
