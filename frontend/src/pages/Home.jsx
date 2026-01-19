import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  ChevronRight,
  Zap,
  Clock,
  Snowflake,
  Tv,
  Utensils,
  Wind,
  Smartphone,
  Monitor,
  ChevronDown,
} from "lucide-react";

// Import Components
import Banner from "../components/Banner";
import ProductCard from "../components/ProductCard";

// --- CẤU HÌNH API ---
const API_URL = "http://localhost:5000/api";

// --- HELPER ---
const getCategoryStyle = (name) => {
  const lowerName = name ? name.toLowerCase() : "";
  if (lowerName.includes("tủ lạnh"))
    return {
      icon: <Snowflake size={24} />,
      color: "bg-blue-100 text-blue-600",
    };
  if (lowerName.includes("máy giặt"))
    return { icon: <Wind size={24} />, color: "bg-green-100 text-green-600" };
  if (lowerName.includes("tivi") || lowerName.includes("tv"))
    return { icon: <Tv size={24} />, color: "bg-purple-100 text-purple-600" };
  if (lowerName.includes("bếp") || lowerName.includes("gia dụng"))
    return {
      icon: <Utensils size={24} />,
      color: "bg-orange-100 text-orange-600",
    };
  if (lowerName.includes("điện thoại"))
    return {
      icon: <Smartphone size={24} />,
      color: "bg-pink-100 text-pink-600",
    };
  if (lowerName.includes("laptop"))
    return { icon: <Monitor size={24} />, color: "bg-gray-100 text-gray-600" };
  return { icon: <Zap size={24} />, color: "bg-gray-100 text-gray-600" };
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  
  // State Flash Sale
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [flashSaleEndTime, setFlashSaleEndTime] = useState(null); // Thời gian kết thúc thực tế
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);

  // --- 1. FETCH DATA (Categories, Products, FlashSale) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi song song 3 API để tiết kiệm thời gian
        const [categoryRes, productRes, flashSaleRes] = await Promise.all([
          axios.get(`${API_URL}/categories`),
          axios.get(`${API_URL}/products`),
          // Đảm bảo bạn đã tạo route này ở Backend như hướng dẫn trước
          axios.get(`${API_URL}/flash-sale`).catch(() => ({ data: [] })) // Fallback nếu chưa có API
        ]);

        setCategories(categoryRes.data);
        setProducts(productRes.data);

        // Xử lý dữ liệu Flash Sale
        const salesData = flashSaleRes.data;
        if (salesData && salesData.length > 0) {
            setFlashSaleProducts(salesData);
            // Lấy thời gian kết thúc của deal đầu tiên làm mốc countdown chung
            setFlashSaleEndTime(new Date(salesData[0].end_date));
        }

      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

useEffect(() => {
    // Hàm gọi API cập nhật dữ liệu Flash Sale
    const fetchFlashSaleData = async () => {
        try {
            const res = await axios.get(`${API_URL}/flash-sale`);
            if (res.data && res.data.length > 0) {
                setFlashSaleProducts(res.data);
            }
        } catch (error) {
            console.error("Lỗi cập nhật flash sale:", error);
        }
    };

    // Gọi mỗi 10 giây 1 lần để cập nhật thanh tiến trình
    const intervalId = setInterval(fetchFlashSaleData, 10000);

    return () => clearInterval(intervalId);
}, []);

  // --- 2. LOGIC COUNTDOWN (Đếm ngược thật) ---
  useEffect(() => {
    if (!flashSaleEndTime) return;

    const calculateTimeLeft = () => {
    const now = new Date();
    const difference = flashSaleEndTime - now;

    if (difference > 0) {
        setTimeLeft({
            // Tính tổng số ngày
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            // Giờ vẫn lấy dư theo 24 để hiển thị lẻ
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        });
    } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setFlashSaleProducts([]);
    }
};

    // Chạy ngay lần đầu và set interval mỗi giây
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [flashSaleEndTime]);

  // --- HÀM XỬ LÝ XEM THÊM ---
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center space-x-2 bg-gray-50">
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce delay-100"></div>
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce delay-200"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
      <Banner />

      {/* --- CATEGORIES --- */}
      <section className="container mx-auto px-4 py-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Danh mục nổi bật
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const style = getCategoryStyle(cat.category_name || cat.name);
            return (
              <Link to={`/category/${cat._id}`} key={cat._id} className="group">
                <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-transparent hover:border-blue-200 flex flex-col items-center gap-3 cursor-pointer h-full">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:-translate-y-1 ${style.color}`}
                  >
                    {style.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 text-center line-clamp-1">
                    {cat.category_name || cat.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* --- FLASH SALE (REAL-TIME) --- */}
      {flashSaleProducts.length > 0 && (
        <section className="bg-white py-8 border-y border-gray-200 mb-8">
          <div className="container mx-auto px-4">
            {/* Header Flash Sale */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl md:text-3xl font-extrabold text-orange-600 italic flex items-center gap-2">
                  <Zap className="fill-current" /> FLASH SALE
                </h2>
                <div className="flex items-center gap-2 text-white bg-gray-800 px-4 py-1.5 rounded-lg text-sm font-bold shadow-inner">
  <Clock size={16} />
  
  {/* Nếu có ngày thì hiển thị, không thì ẩn cho gọn */}
  {timeLeft.days > 0 && (
    <>
      <span className="text-yellow-400">{timeLeft.days}d</span> :
    </>
  )}
  
  <span>{String(timeLeft.hours).padStart(2, "0")}</span> :
  <span>{String(timeLeft.minutes).padStart(2, "0")}</span> :
  <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
</div>
              </div>
              <Link
                to="/flash-sale"
                className="text-blue-600 font-semibold flex items-center hover:underline"
              >
                Xem tất cả <ChevronRight size={18} />
              </Link>
            </div>

            {/* Grid Flash Sale Items */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {flashSaleProducts.map((item) => {
                // item là object FlashSale, cần lấy product từ item.product_id
                const product = item.product_id;
                
                // Nếu dữ liệu lỗi hoặc sản phẩm đã bị xóa, bỏ qua
                if (!product) return null;

                // Tính toán giá và thanh progress
                const currentPrice = product.price * (1 - item.discount_percent / 100);
                const percentSold = item.quantity > 0 
                    ? Math.round((item.sold / item.quantity) * 100) 
                    : 100;

                return (
                  <Link
                    to={`/product/${product._id}`}
                    key={item._id}
                    className="border border-orange-200 rounded-lg p-3 hover:shadow-lg transition-shadow relative bg-white block group"
                  >
                    {/* Badge Giảm giá */}
                    <div className="absolute top-2 right-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">
                      -{item.discount_percent}%
                    </div>
                    
                    <img
                      src={product.image_url || "https://placehold.co/300x300"}
                      alt={product.product_name}
                      className="w-full h-40 object-contain mb-3 rounded group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    <h4 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 h-10">
                      {product.product_name}
                    </h4>
                    
                    <div className="flex flex-col">
                      <span className="text-red-600 font-bold text-lg">
                        {formatCurrency(currentPrice)}
                      </span>
                      <span className="text-gray-400 text-xs line-through">
                        {formatCurrency(product.price)}
                      </span>
                    </div>

                    {/* Thanh Progress Bar Real-time */}
                    <div className="mt-3 relative h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentSold}%` }}
                      ></div>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold drop-shadow-md z-10">
                        Đã bán {item.sold}
                      </span>
                      
                      {/* Hiệu ứng Fire khi sắp hết hàng (>90%) */}
                      {percentSold >= 90 && (
                        <div className="absolute right-1 top-0 bottom-0 flex items-center">
                            <Zap size={12} className="text-yellow-300 fill-current animate-pulse" />
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* --- FEATURED PRODUCTS --- */}
      <section className="container mx-auto px-4 mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 border-b border-gray-200 pb-4">
          <h3 className="text-2xl font-bold text-gray-800 uppercase border-l-4 border-blue-600 pl-3">
            Sản phẩm gợi ý
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {["Nổi bật", "Bán chạy nhất", "Giá tốt", "Mới về"].map(
              (tab, idx) => (
                <button
                  key={idx}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    idx === 0
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>
        </div>

        {/* --- GRID MỚI: CHỈ HIỂN THỊ SỐ LƯỢNG VISIBLECOUNT --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, visibleCount).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* --- NÚT XEM THÊM --- */}
        {visibleCount < products.length && (
          <div className="mt-8 text-center">
            <button
              onClick={handleLoadMore}
              className="bg-white border border-blue-600 text-blue-600 px-8 py-2.5 rounded-full font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
            >
              Xem thêm sản phẩm <ChevronDown size={18} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;