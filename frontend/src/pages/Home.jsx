import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios để gọi API
import {
    ChevronRight,
    Star,
    ShoppingCart,
    Heart,
    Zap,
    Clock,
    Snowflake,
    Tv,
    Utensils,
    Wind,
    Smartphone,
    Monitor,
    Speaker
} from 'lucide-react';

// --- CẤU HÌNH API ---
const API_URL = 'http://localhost:5000/api'; // Đổi port nếu backend của bạn khác

// --- HELPER: MAP ICON VỚI TÊN DANH MỤC ---
// Vì DB chỉ lưu tên (ví dụ "Tủ lạnh"), ta cần hàm này để chọn Icon hiển thị
const getCategoryStyle = (name) => {
    const lowerName = name ? name.toLowerCase() : '';
    
    if (lowerName.includes('tủ lạnh')) return { icon: <Snowflake size={24} />, color: "bg-blue-100 text-blue-600" };
    if (lowerName.includes('máy giặt')) return { icon: <Wind size={24} />, color: "bg-green-100 text-green-600" };
    if (lowerName.includes('tivi') || lowerName.includes('tv')) return { icon: <Tv size={24} />, color: "bg-purple-100 text-purple-600" };
    if (lowerName.includes('bếp') || lowerName.includes('gia dụng')) return { icon: <Utensils size={24} />, color: "bg-orange-100 text-orange-600" };
    if (lowerName.includes('điện thoại')) return { icon: <Smartphone size={24} />, color: "bg-pink-100 text-pink-600" };
    if (lowerName.includes('điều hòa')) return { icon: <Snowflake size={24} />, color: "bg-cyan-100 text-cyan-600" };
    if (lowerName.includes('laptop') || lowerName.includes('máy tính')) return { icon: <Monitor size={24} />, color: "bg-gray-100 text-gray-600" };
    
    return { icon: <Zap size={24} />, color: "bg-gray-100 text-gray-600" };
};

// Helper: Format tiền tệ VNĐ
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const Home = () => {
    // --- STATE QUẢN LÝ DỮ LIỆU ---
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]); // Sản phẩm hiển thị ở mục Gợi ý
    const [flashSaleProducts, setFlashSaleProducts] = useState([]); // Sản phẩm có giảm giá
    const [loading, setLoading] = useState(true);

    // State countdown (Giữ nguyên giả lập)
    const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 12 });

    // --- CALL API ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Gọi song song cả 2 API để tiết kiệm thời gian
                const [categoryRes, productRes] = await Promise.all([
                    axios.get(`${API_URL}/categories`),
                    axios.get(`${API_URL}/products`) // productService.getAllProducts
                ]);

                // 1. Set Danh mục
                setCategories(categoryRes.data);

                // 2. Xử lý Sản phẩm
                const allProducts = productRes.data;
                
                // Lọc sản phẩm có giảm giá > 0 để đưa vào Flash Sale
                const saleItems = allProducts.filter(p => p.discount && p.discount > 0);
                
                setProducts(allProducts); // Hiển thị tất cả ở mục Gợi ý
                setFlashSaleProducts(saleItems.slice(0, 4)); // Lấy 4 sản phẩm sale đầu tiên

            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Countdown Timer logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center space-x-2">
                <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce delay-200"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-12 font-sans">

            {/* --- 1. HERO SECTION (Giữ nguyên banner tĩnh) --- */}
            <section className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-[400px]">
                    <div className="md:col-span-8 relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
                        <img
                            src="https://placehold.co/800x400/2563eb/ffffff?text=BIG+SALE+50%25"
                            alt="Main Banner"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex flex-col justify-center p-8 text-white">
                            <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">KHUYẾN MÃI HOT</span>
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">Lễ Hội Điện Lạnh</h2>
                            <p className="mb-6 text-lg text-gray-200">Giảm giá cực sốc hôm nay</p>
                            <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold hover:bg-blue-50 transition w-fit">
                                Mua ngay
                            </button>
                        </div>
                    </div>
                    <div className="md:col-span-4 flex flex-col gap-4 h-full">
                        <div className="flex-1 rounded-2xl overflow-hidden shadow-md relative cursor-pointer group">
                            <img src="https://placehold.co/400x200/db2777/ffffff?text=Gia+Dung+Bep" alt="Sub 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="flex-1 rounded-2xl overflow-hidden shadow-md relative cursor-pointer group">
                            <img src="https://placehold.co/400x200/16a34a/ffffff?text=Smart+Home" alt="Sub 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 2. CATEGORIES (DỮ LIỆU TỪ DB) --- */}
            <section className="container mx-auto px-4 py-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    Danh mục nổi bật
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {categories.map((cat) => {
                        const style = getCategoryStyle(cat.category_name);
                        return (
                            <Link to={`/category/${cat._id}`} key={cat._id} className="group">
                                <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-transparent hover:border-blue-200 flex flex-col items-center gap-3 cursor-pointer h-full">
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:-translate-y-1 ${style.color}`}>
                                        {style.icon}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 text-center line-clamp-1">
                                        {cat.category_name}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* --- 3. FLASH SALE SECTION (DỮ LIỆU TỪ DB) --- */}
            {flashSaleProducts.length > 0 && (
                <section className="bg-white py-8 border-y border-gray-200 mb-8">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                            <div className="flex items-center gap-4">
                                <h2 className="text-2xl md:text-3xl font-extrabold text-orange-600 italic flex items-center gap-2">
                                    <Zap className="fill-current" /> FLASH SALE
                                </h2>
                                <div className="flex items-center gap-2 text-white bg-gray-800 px-4 py-1.5 rounded-lg text-sm font-bold shadow-inner">
                                    <Clock size={16} />
                                    <span>{String(timeLeft.hours).padStart(2, '0')}</span> :
                                    <span>{String(timeLeft.minutes).padStart(2, '0')}</span> :
                                    <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                                </div>
                            </div>
                            <Link to="/flash-sale" className="text-blue-600 font-semibold flex items-center hover:underline">
                                Xem tất cả <ChevronRight size={18} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {flashSaleProducts.map((product) => {
                                // Tính giá: Giả sử DB lưu Price là giá Gốc.
                                const originalPrice = product.price;
                                const currentPrice = originalPrice * (1 - product.discount / 100);
                                // Giả lập số lượng đã bán (vì DB chưa có field này)
                                // const soldMock = Math.floor(Math.random() * 200) + 10;
                                const soldMock = Math.floor(200) + 10;

                                return (
                                    <div key={product._id} className="border border-orange-200 rounded-lg p-3 hover:shadow-lg transition-shadow relative bg-white">
                                        <div className="absolute top-2 right-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">
                                            -{product.discount}%
                                        </div>
                                        <img 
                                            src={product.image_url || "https://placehold.co/300x300?text=No+Image"} 
                                            alt={product.product_name} 
                                            className="w-full h-40 object-contain mb-3 rounded" 
                                        />
                                        <h4 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 h-10">
                                            {product.product_name}
                                        </h4>
                                        <div className="flex flex-col">
                                            <span className="text-red-600 font-bold text-lg">
                                                {formatCurrency(currentPrice)}
                                            </span>
                                            <span className="text-gray-400 text-xs line-through">
                                                {formatCurrency(originalPrice)}
                                            </span>
                                        </div>
                                        {/* Progress Bar Giả lập */}
                                        <div className="mt-3 relative h-4 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                                                style={{ width: `${(soldMock / 250) * 100}%` }}
                                            ></div>
                                            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold drop-shadow-md z-10">
                                                Đã bán {soldMock}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* --- 4. FEATURED PRODUCTS (DỮ LIỆU TỪ DB) --- */}
            <section className="container mx-auto px-4 mb-12">
                {/* Tabs / Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 border-b border-gray-200 pb-4">
                    <h3 className="text-2xl font-bold text-gray-800 uppercase border-l-4 border-blue-600 pl-3">
                        Sản phẩm gợi ý
                    </h3>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        {['Nổi bật', 'Bán chạy nhất', 'Giá tốt', 'Mới về'].map((tab, idx) => (
                            <button
                                key={idx}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${idx === 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product) => {
                         // Tính toán giá
                         const hasDiscount = product.discount && product.discount > 0;
                         const originalPrice = product.price;
                         const currentPrice = hasDiscount ? originalPrice * (1 - product.discount / 100) : originalPrice;
                         
                         // Giả lập rating/reviews vì DB chưa có
                         const ratingMock = 4.5;
                         const reviewsMock = Math.floor(Math.random() * 100);

                         return (
                            <Link to={`/product/${product._id}`} key={product._id}>
                                <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                                    {/* Image Area */}
                                    <div className="relative p-4 bg-gray-50 h-56 flex items-center justify-center">
                                        <img 
                                            src={product.image_url || "https://placehold.co/400x400?text=Product"} 
                                            alt={product.product_name} 
                                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" 
                                        />

                                        {hasDiscount && (
                                            <span className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                                                -{product.discount}%
                                            </span>
                                        )}

                                        {/* Hover Actions */}
                                        <div className="absolute right-2 top-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-300">
                                            <button className="bg-white p-2 rounded-full shadow hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors">
                                                <Heart size={18} />
                                            </button>
                                        </div>

                                        
                                    </div>

                                    {/* Info Area */}
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h3 className="text-gray-800 font-medium text-sm md:text-base line-clamp-2 mb-2 h-10 md:h-12 leading-tight group-hover:text-blue-600 transition-colors">
                                            {product.product_name}
                                        </h3>

                                        <div className="flex items-center gap-1 mb-2">
                                            <div className="flex text-yellow-400 text-xs">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={12} fill={i < Math.floor(ratingMock) ? "currentColor" : "none"} className={i < Math.floor(ratingMock) ? "" : "text-gray-300"} />
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-400">({reviewsMock})</span>
                                        </div>

                                        <div className="mt-auto">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-red-600 font-bold text-lg md:text-xl">
                                                    {formatCurrency(currentPrice)}
                                                </span>
                                                {hasDiscount && (
                                                    <div className="bg-red-50 text-red-600 text-xs font-bold px-1.5 py-0.5 rounded">
                                                        -{product.discount}%
                                                    </div>
                                                )}
                                            </div>
                                            {hasDiscount && (
                                                <div className="text-gray-400 text-xs line-through mt-0.5">
                                                    {formatCurrency(originalPrice)}
                                                </div>
                                            )}
                                            
                                        </div>
                                        
                                    </div>
                                    <button className=" m-3 left-0 right-0 bg-blue-600 text-white py-3 font-semibold flex items-center justify-center gap-2 cursor-pointer hover:shadow-xl transition-all duration-300 rounded-xl">
                                            <ShoppingCart size={18} /> Thêm vào giỏ
                                        </button>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-8 text-center">
                    <button className="bg-white border border-blue-600 text-blue-600 px-8 py-2.5 rounded-full font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
                        Xem thêm sản phẩm <ChevronRight size={18} />
                    </button>
                </div>
            </section>

            {/* --- 5. BOTTOM PROMO BANNER (Giữ nguyên) --- */}
            <section className="container mx-auto px-4 mb-8">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-400 opacity-10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="z-10 mb-6 md:mb-0 text-center md:text-left max-w-lg">
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">Đăng ký thành viên ElectroShop</h2>
                        <p className="text-blue-100">Nhận ngay voucher <span className="font-bold text-yellow-300">200.000đ</span> cho đơn hàng đầu tiên và tích điểm đổi quà.</p>
                    </div>

                    <div className="z-10 flex gap-4">
                        <button className="bg-white text-indigo-700 px-6 py-3 rounded-full font-bold shadow hover:bg-gray-100 transition-colors">
                            Đăng ký ngay
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;