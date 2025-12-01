import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingCart, Star } from 'lucide-react';

// Helper format tiền tệ (nếu bạn chưa có file utils riêng)
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const ProductCard = ({ product }) => {
    // Tính toán giá
    const hasDiscount = product.discount && product.discount > 0;
    const originalPrice = product.price;
    const currentPrice = hasDiscount ? originalPrice * (1 - product.discount / 100) : originalPrice;
    
    // Giả lập rating (vì DB chưa có)
    //const ratingMock = 4.8;
    //const reviewsMock = Math.floor(Math.random() * 50) + 10;

    return (
        <div className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
            
            {/* --- Image Area --- */}
            <div className="relative aspect-square bg-gray-50 p-6 overflow-hidden">
                {/* Badge Giảm giá */}
                {hasDiscount && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md z-10">
                        -{product.discount}%
                    </span>
                )}

                {/* Ảnh sản phẩm - Link tới chi tiết */}
                <Link to={`/product/${product._id}`}>
                    <img 
                        src={product.image_url || "https://placehold.co/400x400?text=Product"} 
                        alt={product.product_name} 
                        className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" 
                    />
                </Link>

                {/* Action Buttons (Hiện bên phải khi hover) */}
                <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 z-20">
                    <button className="bg-white p-2 rounded-full shadow-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Yêu thích">
                        <Heart size={18} />
                    </button>
                    <button className="bg-white p-2 rounded-full shadow-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors" title="Xem nhanh">
                        <Eye size={18} />
                    </button>
                </div>
                
                {/* Quick Add Button (Trượt lên từ dưới) */}
                <div className="absolute inset-x-4 bottom-4 translate-y-full group-hover: duration-300 z-10">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg flex items-center justify-center gap-2 text-sm backdrop-blur-sm">
                        <ShoppingCart size={16} /> Thêm vào giỏ
                    </button>
                </div>
            </div>

            {/* --- Content Area --- */}
            <div className="p-4 flex-1 flex flex-col">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-yellow-400">
                        <Star size={12} fill="currentColor" />
                    </div>
                    <span className="text-xs text-gray-500 font-medium">5 (5 đánh giá)</span>
                </div>

                {/* Tên sản phẩm */}
                <Link to={`/product/${product._id}`}>
                    <h3 className="text-gray-800 font-semibold text-sm md:text-base line-clamp-2 mb-2 h-10 md:h-12 leading-tight group-hover:text-blue-600 transition-colors">
                        {product.product_name}
                    </h3>
                </Link>

                {/* Giá */}
                <div className="mt-auto pt-2 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-gray-400 text-xs line-through h-4 block">
                            {hasDiscount ? formatCurrency(originalPrice) : ''}
                        </span>
                        <span className="text-red-600 font-bold text-lg md:text-xl">
                            {formatCurrency(currentPrice)}
                        </span>
                    </div>
                    {/* Nút giỏ hàng nhỏ cho mobile */}
                    <button className="md:hidden bg-blue-100 p-2 rounded-full text-blue-600">
                        <ShoppingCart size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;