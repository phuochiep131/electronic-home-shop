import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Headphones, 
  CreditCard 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 font-sans">
      {/* --- 1. SERVICE BENEFITS (Dải cam kết dịch vụ) --- */}
      <div className="bg-blue-600 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="bg-white/20 p-3 rounded-full text-white">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-white uppercase text-sm">Hàng chính hãng</h4>
                <p className="text-blue-100 text-xs">Cam kết 100% chính hãng</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="bg-white/20 p-3 rounded-full text-white">
                <Truck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-white uppercase text-sm">Miễn phí vận chuyển</h4>
                <p className="text-blue-100 text-xs">Cho đơn hàng trên 5 triệu</p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="bg-white/20 p-3 rounded-full text-white">
                <RefreshCw size={24} />
              </div>
              <div>
                <h4 className="font-bold text-white uppercase text-sm">Đổi trả dễ dàng</h4>
                <p className="text-blue-100 text-xs">Trong vòng 15 ngày</p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="bg-white/20 p-3 rounded-full text-white">
                <Headphones size={24} />
              </div>
              <div>
                <h4 className="font-bold text-white uppercase text-sm">Hỗ trợ 24/7</h4>
                <p className="text-blue-100 text-xs">Hotline: 1900 1234</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 2. MAIN FOOTER CONTENT --- */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Contact */}
          <div>
            <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
              Electro<span className="text-orange-500">Shop</span>
            </Link>
            <p className="text-sm leading-6 mb-4">
              Hệ thống bán lẻ điện gia dụng hàng đầu Việt Nam. Chuyên cung cấp các sản phẩm tủ lạnh, máy giặt, điều hòa chính hãng với giá tốt nhất.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-500 mt-1 shrink-0" />
                <span className="text-sm">123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-blue-500 shrink-0" />
                <span className="text-sm">1900 1234 (8:00 - 21:00)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-blue-500 shrink-0" />
                <span className="text-sm">support@electroshop.vn</span>
              </li>
            </ul>
          </div>

          {/* Column 2: Customer Support (Rất quan trọng cho đồ điện tử) */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 relative inline-block">
              Hỗ trợ khách hàng
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-blue-500"></span>
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/policy/warranty" className="hover:text-blue-400 transition-colors">Chính sách bảo hành</Link></li>
              <li><Link to="/policy/return" className="hover:text-blue-400 transition-colors">Chính sách đổi trả</Link></li>
              <li><Link to="/policy/shipping" className="hover:text-blue-400 transition-colors">Giao hàng & Lắp đặt</Link></li>
              <li><Link to="/guide/payment" className="hover:text-blue-400 transition-colors">Hướng dẫn thanh toán</Link></li>
              <li><Link to="/guide/installment" className="hover:text-blue-400 transition-colors">Mua trả góp 0%</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Trung tâm bảo hành</Link></li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 relative inline-block">
              Danh mục sản phẩm
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-blue-500"></span>
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/category/tu-lanh" className="hover:text-blue-400 transition-colors">Tủ lạnh Inverter</Link></li>
              <li><Link to="/category/may-giat" className="hover:text-blue-400 transition-colors">Máy giặt lồng ngang</Link></li>
              <li><Link to="/category/dieu-hoa" className="hover:text-blue-400 transition-colors">Điều hòa không khí</Link></li>
              <li><Link to="/category/gia-dung" className="hover:text-blue-400 transition-colors">Gia dụng nhà bếp</Link></li>
              <li><Link to="/category/smart-home" className="hover:text-blue-400 transition-colors">Thiết bị Smart Home</Link></li>
              <li><Link to="/promotions" className="text-orange-500 font-semibold hover:text-orange-400 transition-colors">Săn Sale Giá Sốc</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Payment */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Đăng ký nhận tin</h3>
            <p className="text-sm mb-4">Nhận thông tin khuyến mãi và mã giảm giá sớm nhất.</p>
            <form className="flex mb-6">
              <input 
                type="email" 
                placeholder="Email của bạn..." 
                className="bg-gray-800 text-white px-4 py-2 w-full rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-700"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors font-semibold">
                Gửi
              </button>
            </form>

            <h4 className="text-white font-bold text-sm mb-3">Chấp nhận thanh toán</h4>
            <div className="flex gap-2 flex-wrap">
               {/* Mô phỏng icon các phương thức thanh toán */}
               <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-blue-800 text-[10px] font-bold">VISA</div>
               <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-red-600 text-[10px] font-bold">MC</div>
               <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-pink-600 text-[10px] font-bold">MOMO</div>
               <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-green-600 text-[10px] font-bold">COD</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 3. BOTTOM FOOTER (Copyright & Certifications) --- */}
      <div className="border-t border-gray-800 bg-gray-950 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-xs text-gray-500">© 2024 Công ty Cổ phần ElectroShop. Bảo lưu mọi quyền.</p>
            <p className="text-xs text-gray-600 mt-1">Giấy CNĐKDN: 0101234567 - Ngày cấp: 20/10/2020, được sửa đổi lần thứ 9 ngày 01/01/2024.</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Social Icons */}
            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
              <Facebook size={16} />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all">
              <Instagram size={16} />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
              <Youtube size={16} />
            </a>
            
            {/* Fake Bộ Công Thương Badge */}
            <div className="ml-4 border border-red-600 px-2 py-1 rounded">
                <span className="text-[10px] text-red-500 font-bold">Đã thông báo BCT</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;