import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, ShoppingCart, Star, Check, Zap } from "lucide-react";
import { useCart } from "../context/CartContext";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // --- XỬ LÝ LOGIC FLASH SALE ---
  const now = new Date();
  const flashSale = product.flash_sale;
  const isFlashSaleActive =
    flashSale &&
    flashSale.status &&
    new Date(flashSale.start_date) <= now &&
    new Date(flashSale.end_date) >= now;

  // Xác định giá và % giảm
  let currentPrice, originalPrice, discountPercent;

  originalPrice = product.price;

  if (isFlashSaleActive) {
    if (flashSale.sale_price) {
      currentPrice = flashSale.sale_price;
    } else {
      currentPrice = originalPrice * (1 - flashSale.discount_percent / 100);
    }
    discountPercent = flashSale.discount_percent;
  } else {
    discountPercent = product.discount || 0;
    currentPrice = originalPrice * (1 - discountPercent / 100);
  }

  // Tính toán thanh tiến độ "Đã bán" cho Flash Sale
  const soldPercent = isFlashSaleActive
    ? Math.min((flashSale.sold / flashSale.quantity) * 100, 100)
    : 0;

  // --- SỬA Ở ĐÂY: DÙNG DỮ LIỆU THẬT TỪ DB ---
  // Backend trả về: average_rating (vd: 4.5) và review_count (vd: 10)
  const ratingReal = product.average_rating || 0;
  const reviewsCount = product.review_count || 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding) return;
    setIsAdding(true);

    const success = await addToCart(product._id, 1);
    setIsAdding(false);
    if (success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  return (
    <div className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* --- Image Area --- */}
      <div className="relative aspect-square bg-gray-50 p-6 flex items-center justify-center overflow-hidden">
        {/* Badge Giảm giá */}
        {discountPercent > 0 && (
          <span
            className={`absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10 flex items-center gap-1
            ${isFlashSaleActive ? "bg-orange-600" : "bg-red-600"}`}
          >
            {isFlashSaleActive && <Zap size={10} fill="white" />} -
            {discountPercent}%
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
        {/* Rating: Hiển thị sao thật */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                // Logic tô màu sao dựa trên ratingReal
                fill={i < Math.round(ratingReal) ? "currentColor" : "none"}
                className={i >= Math.round(ratingReal) ? "text-gray-300" : ""}
              />
            ))}
          </div>
          {/* Hiển thị số lượng đánh giá thật */}
          <span className="text-xs text-gray-400 ml-1">({reviewsCount})</span>
        </div>

        {/* Name */}
        <Link to={`/product/${product._id}`}>
          <h3 className="text-gray-800 font-medium text-sm md:text-base line-clamp-2 mb-2 h-10 md:h-12 leading-tight group-hover:text-blue-600 transition-colors">
            {product.product_name}
          </h3>
        </Link>

        <div className="mt-auto pt-0 border-t border-gray-50">
          {/* Price */}
          <div className="flex flex-col mb-3">
            <div className="flex items-center gap-2">
              <span className="text-red-600 font-bold text-lg">
                {formatCurrency(currentPrice)}
              </span>
              {discountPercent > 0 && (
                <span className="text-gray-400 text-xs line-through">
                  {formatCurrency(originalPrice)}
                </span>
              )}
            </div>

            {/* Flash Sale Progress Bar */}
            {isFlashSaleActive && (
              <div className="mt-2 relative w-full h-4 bg-orange-100 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-red-500"
                  style={{ width: `${soldPercent}%` }}
                ></div>
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-[10px] text-white font-bold uppercase drop-shadow-md">
                  Đã bán {flashSale.sold}
                </div>
                <div className="absolute top-0 left-1 h-full flex items-center">
                  <Zap size={10} className="text-white fill-white" />
                </div>
              </div>
            )}
          </div>

          {/* Button */}
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
                <Check size={16} /> Đã thêm
              </>
            ) : (
              <>
                <ShoppingCart size={16} /> Thêm vào giỏ
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
