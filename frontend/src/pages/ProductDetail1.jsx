import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Star,
    Heart,
    Tag,
    CheckCircle,
    Truck,
    ShieldCheck,
    RotateCcw,
    Minus,
    Plus,
    ShoppingCart,
    Share2
} from 'lucide-react';

const ProductDetail = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('description');
    const [quantity, setQuantity] = useState(1);

    // Mock data chi tiết sản phẩm (Giả lập)
    const product = {
        id: id || 1, // Fallback ID nếu không có params
        name: "Robot Hút Bụi Lau Nhà Xiaomi Vacuum Mop 2 Pro - Bản Quốc Tế",
        price: 5990000,
        originalPrice: 7990000,
        rating: 4.8,
        reviews: 128,
        sku: "XIAOMI-MOP2-PRO",
        description: "Robot hút bụi lau nhà Xiaomi Vacuum Mop 2 Pro sở hữu lực hút 3000 Pa mạnh mẽ, định vị LDS chính xác, pin dung lượng lớn 5200mAh cho diện tích làm sạch lên đến 150m2. Chế độ lau rung sóng âm tần số cao giúp đánh bay vết bẩn cứng đầu.",
        images: [
            "https://placehold.co/600x600/png?text=Main+Product",
            "https://placehold.co/600x600/png?text=Side+View",
            "https://placehold.co/600x600/png?text=Top+View",
            "https://placehold.co/600x600/png?text=Usage+Context"
        ],
        specs: [
            { label: "Thương hiệu", value: "Xiaomi" },
            { label: "Lực hút", value: "3000 Pa" },
            { label: "Dung lượng pin", value: "5200 mAh" },
            { label: "Độ ồn", value: "65 dB" },
            { label: "Dung tích hộp bụi", value: "450 ml" },
            { label: "Dung tích hộp nước", value: "270 ml" },
        ]
    };

    const [mainImage, setMainImage] = useState(product.images[0]);

    // Cuộn lên đầu trang khi ID sản phẩm thay đổi
    // useEffect(() => {
    //     window.scrollTo(0, 0);
    //     setMainImage(product.images[0]); // Reset ảnh chính
    // }, [id]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8 font-sans">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <div className="text-sm text-gray-500 mb-6 flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
                    <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
                    <span>/</span>
                    <Link to="/products" className="hover:text-blue-600">Thiết bị gia đình</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">{product.name}</span>
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">

                        {/* --- LEFT SIDE: IMAGES GALLERY --- */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200 relative group">
                                <img
                                    src={mainImage}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                                    -25%
                                </div>
                                <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full text-gray-500 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Share2 size={20} />
                                </button>
                            </div>

                            {/* Thumbnails */}
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className={`aspect-square rounded-lg border-2 cursor-pointer overflow-hidden transition-all ${mainImage === img ? 'border-blue-600 ring-1 ring-blue-600' : 'border-transparent hover:border-blue-300'}`}
                                        onClick={() => setMainImage(img)}
                                    >
                                        <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* --- RIGHT SIDE: PRODUCT INFO --- */}
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h1>
                                    <div className="flex flex-wrap items-center gap-4 text-sm">
                                        <div className="flex items-center text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i >= Math.floor(product.rating) ? "text-gray-300" : ""} />
                                            ))}
                                            <span className="font-bold text-gray-900 ml-2">{product.rating}</span>
                                        </div>
                                        <span className="text-gray-300">|</span>
                                        <span className="text-blue-600 hover:underline cursor-pointer">{product.reviews} đánh giá</span>
                                        <span className="text-gray-300">|</span>
                                        <span className="text-gray-500">Mã SP: {product.sku}</span>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-50">
                                    <Heart size={24} />
                                </button>
                            </div>

                            <div className="bg-blue-50/50 p-4 rounded-xl mb-6 border border-blue-100">
                                <div className="flex items-end gap-3 mb-1">
                                    <span className="text-3xl font-bold text-blue-600">{formatCurrency(product.price)}</span>
                                    <span className="text-gray-400 line-through text-lg mb-1">{formatCurrency(product.originalPrice)}</span>
                                </div>
                                <div className="text-sm text-blue-800 flex items-center gap-1 font-medium">
                                    <Tag size={14} /> Tiết kiệm: {formatCurrency(product.originalPrice - product.price)}
                                </div>
                            </div>

                            {/* Policies */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                                <div className="flex items-center gap-3 text-sm text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                    <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                                    <span>Hàng chính hãng 100%</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                    <Truck size={20} className="text-green-500 flex-shrink-0" />
                                    <span>Miễn phí vận chuyển</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                    <ShieldCheck size={20} className="text-green-500 flex-shrink-0" />
                                    <span>Bảo hành 12 tháng</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                    <RotateCcw size={20} className="text-green-500 flex-shrink-0" />
                                    <span>Đổi trả trong 30 ngày</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
                                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                                    <button
                                        className="p-3.5 hover:bg-gray-100 text-gray-600 disabled:opacity-50 transition-colors"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="w-14 text-center font-bold text-lg">{quantity}</span>
                                    <button
                                        className="p-3.5 hover:bg-gray-100 text-gray-600 transition-colors"
                                        onClick={() => setQuantity(quantity + 1)}
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                                <div className="flex-1 flex gap-3">
                                    <button className="flex-1 bg-blue-600 text-white py-3.5 px-6 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]">
                                        <ShoppingCart size={20} /> Thêm vào giỏ
                                    </button>
                                    <button className="bg-orange-100 text-orange-600 py-3.5 px-4 rounded-xl font-bold hover:bg-orange-200 transition-colors">
                                        Mua ngay
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- TABS: DESCRIPTION & SPECS --- */}
                    <div className="border-t border-gray-200">
                        <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
                            <button
                                className={`px-8 py-4 font-bold text-sm uppercase tracking-wide whitespace-nowrap transition-colors border-b-2 ${activeTab === 'description' ? 'text-blue-600 border-blue-600 bg-blue-50/50' : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'}`}
                                onClick={() => setActiveTab('description')}
                            >
                                Mô tả sản phẩm
                            </button>
                            <button
                                className={`px-8 py-4 font-bold text-sm uppercase tracking-wide whitespace-nowrap transition-colors border-b-2 ${activeTab === 'specs' ? 'text-blue-600 border-blue-600 bg-blue-50/50' : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'}`}
                                onClick={() => setActiveTab('specs')}
                            >
                                Thông số kỹ thuật
                            </button>
                            <button
                                className={`px-8 py-4 font-bold text-sm uppercase tracking-wide whitespace-nowrap transition-colors border-b-2 ${activeTab === 'reviews' ? 'text-blue-600 border-blue-600 bg-blue-50/50' : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'}`}
                                onClick={() => setActiveTab('reviews')}
                            >
                                Đánh giá (128)
                            </button>
                        </div>

                        <div className="p-6 md:p-10 min-h-[300px]">
                            {activeTab === 'description' && (
                                <div className="prose max-w-none text-gray-700">
                                    <p className="text-lg mb-4 leading-relaxed">{product.description}</p>
                                    <p className="mb-4">Sản phẩm được trang bị hệ thống định vị laser LDS thế hệ mới, giúp lập bản đồ ngôi nhà nhanh chóng và chính xác. Khả năng vượt chướng ngại vật lên đến 2cm giúp robot dễ dàng di chuyển qua các gờ cửa.</p>
                                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                                <CheckCircle size={18} className="text-blue-600" /> Đặc điểm nổi bật
                                            </h3>
                                            <ul className="space-y-2">
                                                <li className="flex items-start gap-2 text-sm"><span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></span>Công nghệ lau rung mô phỏng thao tác lau thủ công.</li>
                                                <li className="flex items-start gap-2 text-sm"><span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></span>Kết nối App Mi Home điều khiển từ xa thông minh.</li>
                                                <li className="flex items-start gap-2 text-sm"><span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></span>Tự động quay về dock sạc khi pin yếu.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'specs' && (
                                <div className="max-w-3xl mx-auto">
                                    <h3 className="font-bold text-xl mb-6 text-gray-900">Thông số kỹ thuật chi tiết</h3>
                                    <div className="border rounded-xl overflow-hidden">
                                        <table className="w-full text-sm text-left text-gray-600">
                                            <tbody>
                                                {product.specs.map((spec, index) => (
                                                    <tr key={index} className={`border-b border-gray-100 last:border-none ${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}>
                                                        <td className="py-4 px-6 font-medium text-gray-900 w-1/3">{spec.label}</td>
                                                        <td className="py-4 px-6">{spec.value}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                                        <Star size={32} className="text-gray-400" />
                                    </div>
                                    <p className="text-lg font-medium">Chưa có đánh giá nào</p>
                                    <p className="text-sm mt-1">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
                                    <button className="mt-6 px-6 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
                                        Viết đánh giá
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- RELATED PRODUCTS --- */}
                <div className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Sản phẩm tương tự</h2>
                        <Link to="/product" className="text-blue-600 font-medium hover:underline flex items-center gap-1 text-sm">
                            Xem tất cả

                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {[1, 2, 3, 4].map((item) => (
                            <Link to={`/product/${item}`} key={item} className="group bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer">
                                <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden relative">
                                    <img src={`https://placehold.co/300x300/png?text=Product+${item}`} alt="Related" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="text-xs text-gray-500 mb-1">Xiaomi</div>
                                <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">Robot Hút Bụi Lau Nhà Dreame D9 Max - Bản Quốc Tế</h3>
                                <div className="flex items-center justify-between mt-2">
                                    <p className="text-blue-600 font-bold text-sm">5.490.000₫</p>
                                    <button className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-colors">
                                        <ShoppingCart size={14} />
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;