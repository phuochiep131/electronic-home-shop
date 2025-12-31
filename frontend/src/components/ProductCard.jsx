import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, ShoppingCart, Star, Check } from "lucide-react";
// 1. Import Context
import { useCart } from "../context/CartContext";

// Helper format tiền tệ
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const ProductCard = ({ product }) => {
  // 2. Lấy hàm addToCart từ Context
  const { addToCart } = useCart();

  // State để hiển thị hiệu ứng loading/thành công nhỏ trên nút
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Tính toán giá
  const hasDiscount = product.discount && product.discount > 0;
  const originalPrice = product.price;
  const currentPrice = hasDiscount
    ? originalPrice * (1 - product.discount / 100)
    : originalPrice;

  const ratingMock = product.rating || 4.5;
  const reviewsMock = product.reviews || Math.floor(Math.random() * 50) + 10;

  // 3. Hàm xử lý thêm vào giỏ hàng
  const handleAddToCart = async (e) => {
    // Ngăn chặn sự kiện click lan ra ngoài (để không bị nhảy vào trang chi tiết khi bấm nút Mua)
    e.preventDefault();
    e.stopPropagation();

    if (isAdding) return;

    setIsAdding(true);

    // Gọi hàm thêm vào giỏ (số lượng mặc định là 1)
    const success = await addToCart(product._id, 1);

    setIsAdding(false);
    if (success) {
      setIsAdded(true);
      // Sau 2 giây thì reset lại trạng thái nút
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  return (
    <div className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* --- Image Area --- */}
      <div className="relative aspect-square bg-gray-50 p-6 flex items-center justify-center overflow-hidden">
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10">
            -{product.discount}%
          </span>
        )}

        <Link
          to={`/product/${product._id}`}
          className="w-full h-full flex items-center justify-center"
        >
          <img
            src={
              product.image_url || "https://placehold.co/400x400?text=Product"
            }
            alt={product.product_name}
            className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
          />
        </Link>

        {/* Action Buttons */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 z-20">
          <button className="bg-white p-2 rounded-full shadow-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
            <Heart size={18} />
          </button>
          <button className="bg-white p-2 rounded-full shadow-md text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors">
            <Eye size={18} />
          </button>
        </div>
      </div>

      {/* --- Content Area --- */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < Math.floor(ratingMock) ? "currentColor" : "none"}
                className={i < Math.floor(ratingMock) ? "" : "text-gray-300"}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400 ml-1">({reviewsMock})</span>
        </div>

        <Link to={`/product/${product._id}`}>
          <h3 className="text-gray-800 font-medium text-sm md:text-base line-clamp-2 mb-2 h-10 md:h-12 leading-tight group-hover:text-blue-600 transition-colors">
            {product.product_name}
          </h3>
        </Link>

        <div className="mt-auto pt-2 border-t border-gray-50">
          <div className="flex flex-col mb-3">
            <div className="flex items-center gap-2">
              <span className="text-red-600 font-bold text-lg">
                {formatCurrency(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-gray-400 text-xs line-through">
                  {formatCurrency(originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* 4. Gắn sự kiện onClick vào nút */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`w-full py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer
                            ${
                              isAdded
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
          >
            {isAdding ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : isAdded ? (
              <>
                {" "}
                <Check size={16} /> Đã thêm{" "}
              </>
            ) : (
              <>
                {" "}
                <ShoppingCart size={16} /> Thêm vào giỏ{" "}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
