import React, { useEffect } from 'react'; // Bỏ useState
import { useParams, Link } from 'react-router-dom';
import { 
    ChevronRight, 
    Home, 
    Filter, 
    ArrowUpDown, 
    Star, 
    ShoppingCart, 
    Heart 
} from 'lucide-react';

// --- MOCK DATA ---
const CATEGORIES = [
    { id: 1, name: "Tủ lạnh" },
    { id: 2, name: "Máy giặt" },
    { id: 3, name: "Tivi" },
    { id: 4, name: "Gia dụng bếp" },
    { id: 5, name: "Điện thoại" },
    { id: 6, name: "Điều hòa" },
];

const ALL_PRODUCTS = [
    { id: 1, categoryId: 1, name: "Tủ lạnh Samsung Inverter 236L", price: 6490000, originalPrice: 8900000, rating: 4.8, reviews: 128, image: "https://placehold.co/400x400/e2e8f0/1e293b?text=Samsung+Fridge" },
    { id: 11, categoryId: 1, name: "Tủ lạnh Panasonic Inverter 300L", price: 8500000, originalPrice: 10500000, rating: 4.5, reviews: 50, image: "https://placehold.co/400x400/e2e8f0/1e293b?text=Panasonic+Fridge" },
    { id: 2, categoryId: 2, name: "Máy giặt LG AI DD 9kg", price: 8990000, originalPrice: 11990000, rating: 4.9, reviews: 85, image: "https://placehold.co/400x400/e2e8f0/1e293b?text=LG+Washer" },
    { id: 6, categoryId: 4, name: "Nồi cơm điện tử Sharp 1.8L", price: 1850000, originalPrice: 2500000, rating: 4.5, reviews: 99, image: "https://placehold.co/400x400/e2e8f0/1e293b?text=Sharp+Cooker" },
    { id: 101, categoryId: 4, name: "Nồi chiên không dầu Philips 5L", price: 1590000, originalPrice: 2500000, rating: 4.7, reviews: 200, image: "https://placehold.co/300x300/e2e8f0/1e293b?text=Air+Fryer" },
];

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const CategoryPage = () => {
    const { id } = useParams();
    
    // --- SỬA LỖI Ở ĐÂY ---
    // Không dùng useState/useEffect để tính toán dữ liệu nữa.
    // Tính trực tiếp mỗi lần render. React xử lý việc này rất nhanh.
    
    const categoryId = parseInt(id); // Chuyển id URL thành số
    
    // 1. Tìm tên danh mục trực tiếp
    const currentCategory = CATEGORIES.find(cat => cat.id === categoryId);
    const categoryName = currentCategory ? currentCategory.name : "Sản phẩm";

    // 2. Lọc sản phẩm trực tiếp
    const products = ALL_PRODUCTS.filter(p => p.categoryId === categoryId);

    // useEffect bây giờ chỉ dùng để scroll lên đầu trang (Side effect)
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    return (
        <div className="bg-gray-50 min-h-screen pb-12 font-sans">
            
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-3 flex items-center text-sm text-gray-500">
                    <Link to="/" className="hover:text-blue-600 flex items-center gap-1">
                        <Home size={14} /> Trang chủ
                    </Link>
                    <ChevronRight size={14} className="mx-2" />
                    <span className="text-gray-900 font-medium">{categoryName}</span>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                
                {/* Header & Filter Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 uppercase border-l-4 border-blue-600 pl-3">
                        {categoryName} <span className="text-gray-400 text-lg font-normal lowercase">({products.length} sản phẩm)</span>
                    </h1>

                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                            <Filter size={16} /> Bộ lọc
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                            <ArrowUpDown size={16} /> Sắp xếp
                        </button>
                    </div>
                </div>

                {/* Product Grid */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {products.map((product) => (
                            <Link to={`/product/${product.id}`} key={product.id}>
                                <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                                    <div className="relative p-4 bg-gray-50 h-56 flex items-center justify-center">
                                        <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
                                        <button className="absolute right-2 top-2 bg-white p-2 rounded-full shadow hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors opacity-0 group-hover:opacity-100">
                                            <Heart size={18} />
                                        </button>
                                        <button className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white py-3 font-semibold translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2">
                                            <ShoppingCart size={18} /> Thêm vào giỏ
                                        </button>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h3 className="text-gray-800 font-medium text-sm md:text-base line-clamp-2 mb-2 h-10 md:h-12 leading-tight group-hover:text-blue-600 transition-colors">
                                            {product.name}
                                        </h3>
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
                                                <span className="text-red-600 font-bold text-lg">{formatCurrency(product.price)}</span>
                                                <span className="bg-red-50 text-red-600 text-xs font-bold px-1.5 py-0.5 rounded">-{Math.round((1 - product.price / product.originalPrice) * 100)}%</span>
                                            </div>
                                            <div className="text-gray-400 text-xs line-through mt-0.5">{formatCurrency(product.originalPrice)}</div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500 text-lg">Chưa có sản phẩm nào trong danh mục này.</p>
                        <Link to="/" className="text-blue-600 font-medium hover:underline mt-2 inline-block">Quay lại trang chủ</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;