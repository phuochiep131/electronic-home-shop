import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
    ChevronRight, 
    Home, 
    Filter, 
    ArrowUpDown, 
    Star, 
    ShoppingCart, 
    Heart 
} from 'lucide-react';

// Cấu hình URL backend
const API_URL = 'http://localhost:5000/api';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const CategoryPage = () => {
    const { id } = useParams(); // Đây là _id của MongoDB (VD: 656a1b...)
    
    // --- STATE QUẢN LÝ DỮ LIỆU ---
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [loading, setLoading] = useState(true);

    // --- GỌI API ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Gọi song song 2 API để lấy thông tin danh mục và danh sách sản phẩm
                // Backend của bạn đã có sẵn router.get('/:id') cho category và filter ?category=... cho product
                const [categoryRes, productRes] = await Promise.all([
                    axios.get(`${API_URL}/categories/${id}`),
                    axios.get(`${API_URL}/products?category=${id}`)
                ]);

                // 1. Set tên danh mục
                if (categoryRes.data) {
                    setCategoryName(categoryRes.data.category_name);
                }

                // 2. Set danh sách sản phẩm
                setProducts(productRes.data);

            } catch (error) {
                console.error("Lỗi tải dữ liệu danh mục:", error);
                setCategoryName("Không tìm thấy danh mục");
            } finally {
                setLoading(false);
                // Cuộn lên đầu trang
                window.scrollTo(0, 0);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    // --- MÀN HÌNH LOADING ---
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
                        {products.map((product) => {
                            // Tính toán giá hiển thị (DB lưu price là giá gốc, discount là %)
                            const originalPrice = product.price;
                            const discount = product.discount || 0;
                            const currentPrice = originalPrice * (1 - discount / 100);
                            
                            // Mock rating/reviews vì DB chưa có trường này
                            const ratingMock = 4.5;
                            const reviewsMock = Math.floor(Math.random() * 100) + 1;

                            return (
                                <Link to={`/product/${product._id}`} key={product._id}>
                                    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                                        <div className="relative p-4 bg-gray-50 h-56 flex items-center justify-center">
                                            <img 
                                                src={product.image_url || "https://placehold.co/400x400?text=Product"} 
                                                alt={product.product_name} 
                                                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" 
                                            />
                                            
                                            {/* Nút Heart */}
                                            <button className="absolute right-2 top-2 bg-white p-2 rounded-full shadow hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors opacity-0 group-hover:opacity-100">
                                                <Heart size={18} />
                                            </button>

                                            {/* Nút Giỏ hàng */}
                                            <button className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white py-3 font-semibold translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2">
                                                <ShoppingCart size={18} /> Thêm vào giỏ
                                            </button>
                                        </div>

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
                                                    <span className="text-red-600 font-bold text-lg">{formatCurrency(currentPrice)}</span>
                                                    {discount > 0 && (
                                                        <span className="bg-red-50 text-red-600 text-xs font-bold px-1.5 py-0.5 rounded">-{discount}%</span>
                                                    )}
                                                </div>
                                                {discount > 0 && (
                                                    <div className="text-gray-400 text-xs line-through mt-0.5">{formatCurrency(originalPrice)}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    // Hiển thị khi không có sản phẩm nào
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