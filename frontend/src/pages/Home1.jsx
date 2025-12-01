import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ChevronRight,
    Star,
    ShoppingCart,
    Heart,
    Zap,
    Clock,
    Flame,
    Snowflake,
    Tv,
    Utensils,
    Wind,
    Smartphone
} from 'lucide-react';

// --- MOCK DATA (Dữ liệu giả lập) ---

// 1. Danh mục
const CATEGORIES = [
    { id: 1, name: "Tủ lạnh", icon: <Snowflake size={24} />, color: "bg-blue-100 text-blue-600" },
    { id: 2, name: "Máy giặt", icon: <Wind size={24} />, color: "bg-green-100 text-green-600" },
    { id: 3, name: "Tivi", icon: <Tv size={24} />, color: "bg-purple-100 text-purple-600" },
    { id: 4, name: "Gia dụng bếp", icon: <Utensils size={24} />, color: "bg-orange-100 text-orange-600" },
    { id: 5, name: "Điện thoại", icon: <Smartphone size={24} />, color: "bg-pink-100 text-pink-600" },
    { id: 6, name: "Điều hòa", icon: <Snowflake size={24} />, color: "bg-cyan-100 text-cyan-600" },
];

// 2. Sản phẩm Flash Sale
const FLASH_SALE_PRODUCTS = [
    {
        id: 101,
        name: "Nồi chiên không dầu Philips 5L",
        price: 1590000,
        originalPrice: 2500000,
        discount: 36,
        sold: 85,
        image: "https://placehold.co/300x300/e2e8f0/1e293b?text=Air+Fryer"
    },
    {
        id: 102,
        name: "Máy xay sinh tố Sunhouse",
        price: 450000,
        originalPrice: 890000,
        discount: 49,
        sold: 120,
        image: "https://placehold.co/300x300/e2e8f0/1e293b?text=Blender"
    },
    {
        id: 103,
        name: "Bàn ủi hơi nước Panasonic",
        price: 690000,
        originalPrice: 1200000,
        discount: 42,
        sold: 45,
        image: "https://placehold.co/300x300/e2e8f0/1e293b?text=Iron"
    },
    {
        id: 104,
        name: "Ấm siêu tốc Delites 1.8L",
        price: 199000,
        originalPrice: 400000,
        discount: 50,
        sold: 200,
        image: "https://placehold.co/300x300/e2e8f0/1e293b?text=Kettle"
    }
];

// 3. Sản phẩm nổi bật
const FEATURED_PRODUCTS = [
    {
        id: 1,
        name: "Tủ lạnh Samsung Inverter 236L",
        price: 6490000,
        originalPrice: 8900000,
        rating: 4.8,
        reviews: 128,
        tag: "Trả góp 0%",
        image: "https://placehold.co/400x400/e2e8f0/1e293b?text=Samsung+Fridge"
    },
    {
        id: 2,
        name: "Máy giặt LG AI DD 9kg",
        price: 8990000,
        originalPrice: 11990000,
        rating: 4.9,
        reviews: 85,
        tag: "Bán chạy",
        image: "https://placehold.co/400x400/e2e8f0/1e293b?text=LG+Washer"
    },
    {
        id: 3,
        name: "Smart Tivi Sony 4K 55 inch",
        price: 14500000,
        originalPrice: 18900000,
        rating: 4.7,
        reviews: 42,
        tag: "Mới",
        image: "https://placehold.co/400x400/e2e8f0/1e293b?text=Sony+TV"
    },
    {
        id: 4,
        name: "Điều hòa Daikin Inverter 1HP",
        price: 9800000,
        originalPrice: 12500000,
        rating: 4.8,
        reviews: 210,
        tag: "Free ship",
        image: "https://placehold.co/400x400/e2e8f0/1e293b?text=Daikin+AC"
    },
    {
        id: 5,
        name: "Robot hút bụi Xiaomi Vacuum E10",
        price: 3990000,
        originalPrice: 5990000,
        rating: 4.6,
        reviews: 56,
        tag: "-33%",
        image: "https://placehold.co/400x400/e2e8f0/1e293b?text=Xiaomi+Robot"
    },
    {
        id: 6,
        name: "Nồi cơm điện tử Sharp 1.8L",
        price: 1850000,
        originalPrice: 2500000,
        rating: 4.5,
        reviews: 99,
        tag: null,
        image: "https://placehold.co/400x400/e2e8f0/1e293b?text=Sharp+Cooker"
    },
    {
        id: 7,
        name: "Lò vi sóng Electrolux 23L",
        price: 2100000,
        originalPrice: 2800000,
        rating: 4.4,
        reviews: 30,
        tag: "Quà tặng",
        image: "https://placehold.co/400x400/e2e8f0/1e293b?text=Microwave"
    },
    {
        id: 8,
        name: "Quạt điều hòa Sunhouse",
        price: 3200000,
        originalPrice: 4500000,
        rating: 4.3,
        reviews: 112,
        tag: "Mùa hè",
        image: "https://placehold.co/400x400/e2e8f0/1e293b?text=Air+Cooler"
    }
];

// Helper: Format tiền tệ
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const Home = () => {
    // State giả lập countdown
    const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 12 });

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

    return (
        <div className="bg-gray-50 min-h-screen pb-12 font-sans">

            {/* --- 1. HERO SECTION (Banner) --- */}
            <section className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-[400px]">
                    {/* Main Banner (2/3 width) */}
                    <div className="md:col-span-8 relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
                        <img
                            src="https://placehold.co/800x400/2563eb/ffffff?text=BIG+SALE+50%25+-+MUA+HE+XANH"
                            alt="Main Banner"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex flex-col justify-center p-8 text-white">
                            <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">KHUYẾN MÃI HOT</span>
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">Lễ Hội Điện Lạnh</h2>
                            <p className="mb-6 text-lg text-gray-200">Giảm giá đến 50% cho Tủ lạnh & Máy giặt</p>
                            <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold hover:bg-blue-50 transition w-fit">
                                Mua ngay
                            </button>
                        </div>
                    </div>

                    {/* Sub Banners (1/3 width) */}
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

            {/* --- 2. CATEGORIES (Danh mục) --- */}
            <section className="container mx-auto px-4 py-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    Danh mục nổi bật
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {CATEGORIES.map((cat) => (
                        <Link to={`/category/${cat.id}`} key={cat.id} className="group">
                            <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-transparent hover:border-blue-200 flex flex-col items-center gap-3 cursor-pointer h-full">
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:-translate-y-1 ${cat.color}`}>
                                    {cat.icon}
                                </div>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 text-center">{cat.name}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* --- 3. FLASH SALE SECTION --- */}
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
                        {FLASH_SALE_PRODUCTS.map((product) => (
                            <div key={product.id} className="border border-orange-200 rounded-lg p-3 hover:shadow-lg transition-shadow relative bg-white">
                                <div className="absolute top-2 right-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">-{product.discount}%</div>
                                <img src={product.image} alt={product.name} className="w-full h-40 object-contain mb-3 rounded" />
                                <h4 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 h-10">{product.name}</h4>
                                <div className="flex flex-col">
                                    <span className="text-red-600 font-bold text-lg">{formatCurrency(product.price)}</span>
                                    <span className="text-gray-400 text-xs line-through">{formatCurrency(product.originalPrice)}</span>
                                </div>
                                {/* Progress Bar */}
                                <div className="mt-3 relative h-4 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                                        style={{ width: `${(product.sold / 200) * 100}%` }}
                                    ></div>
                                    <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold drop-shadow-md z-10">
                                        Đã bán {product.sold}
                                    </span>
                                    {/* Text ảo nếu màu nền chưa phủ hết text */}
                                    <span className="absolute inset-0 flex items-center justify-center text-[10px] text-red-600 font-bold mix-blend-screen">
                                        Đã bán {product.sold}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- 4. FEATURED PRODUCTS (Sản phẩm nổi bật) --- */}
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
                    {FEATURED_PRODUCTS.map((product) => (
                        <Link to={`/product/${product.id}`}>
                            <div key={product.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
                                {/* Image Area */}
                                <div className="relative p-4 bg-gray-50 h-56 flex items-center justify-center">
                                    <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />

                                    {/* Badges */}
                                    {product.tag && (
                                        <span className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                                            {product.tag}
                                        </span>
                                    )}

                                    {/* Hover Actions */}
                                    <div className="absolute right-2 top-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-300">
                                        <button className="bg-white p-2 rounded-full shadow hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors">
                                            <Heart size={18} />
                                        </button>
                                    </div>

                                    {/* Add to Cart Button (Hover) */}
                                    <button className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white py-3 font-semibold translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2">
                                        <ShoppingCart size={18} /> Thêm vào giỏ
                                    </button>
                                </div>

                                {/* Info Area */}
                                <div className="p-4 flex-1 flex flex-col">
                                    <Link to={`/product/${product.id}`} className="hover:text-blue-600 transition-colors">
                                        <h3 className="text-gray-800 font-medium text-sm md:text-base line-clamp-2 mb-2 h-10 md:h-12 leading-tight">
                                            {product.name}
                                        </h3>
                                    </Link>

                                    <div className="flex items-center gap-1 mb-2">
                                        <div className="flex text-yellow-400 text-xs">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i < Math.floor(product.rating) ? "" : "text-gray-300"} />
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-400">({product.reviews})</span>
                                    </div>

                                    <div className="mt-auto">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-red-600 font-bold text-lg md:text-xl">{formatCurrency(product.price)}</span>
                                            {product.discount && (
                                                <span className="bg-red-50 text-red-600 text-xs font-bold px-1.5 py-0.5 rounded">-{Math.round((1 - product.price / product.originalPrice) * 100)}%</span>
                                            )}
                                        </div>
                                        <div className="text-gray-400 text-xs line-through mt-0.5">{formatCurrency(product.originalPrice)}</div>
                                    </div>
                                </div>
                            </div></Link>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <button className="bg-white border border-blue-600 text-blue-600 px-8 py-2.5 rounded-full font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
                        Xem thêm sản phẩm <ChevronRight size={18} />
                    </button>
                </div>
            </section>

            {/* --- 5. BOTTOM PROMO BANNER --- */}
            <section className="container mx-auto px-4 mb-8">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between text-white shadow-xl relative overflow-hidden">
                    {/* Background Circles */}
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