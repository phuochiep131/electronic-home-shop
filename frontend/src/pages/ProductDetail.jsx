import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
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
  Share2,
  Zap,
  Clock,
  User,
  MessageSquare,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

const API_URL =
  import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000/api";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("description");

  // State dữ liệu
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // Format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Helper render sao (Icon)
  const renderStars = (rating, size = 16) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={size}
            fill={i < Math.round(rating) ? "currentColor" : "none"}
            className={i >= Math.round(rating) ? "text-gray-300" : ""}
          />
        ))}
      </div>
    );
  };

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const [productRes, reviewsRes] = await Promise.all([
          axios.get(`${API_URL}/products/${id}`),
          axios.get(`${API_URL}/reviews/product/${id}`),
        ]);

        const data = productRes.data;
        setProduct(data);
        setReviews(reviewsRes.data);

        const img =
          data.image_url || "https://placehold.co/600x600/png?text=No+Image";
        setMainImage(img);

        if (data.category_id && data.category_id._id) {
          const relatedRes = await axios.get(
            `${API_URL}/products?category=${data.category_id._id}`,
          );
          const related = relatedRes.data
            .filter((p) => p._id !== id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        toast.error("Không tìm thấy sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
      window.scrollTo(0, 0);
      setQuantity(1);
      setActiveTab("description");
    }
  }, [id]);

  // --- HANDLERS ---
  const handleBuyNow = async () => {
    setAddingToCart(true);
    const success = await addToCart(product._id, quantity);
    setAddingToCart(false);
    if (success) {
      toast.success("Đã thêm vào giỏ hàng!");
      navigate("/cart");
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    const success = await addToCart(product._id, quantity);
    setAddingToCart(false);
    if (success) {
      toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ!`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center space-x-2">
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce delay-100"></div>
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce delay-200"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Sản phẩm không tồn tại
      </div>
    );
  }

  // --- LOGIC FLASH SALE & GIÁ (GIỮ NGUYÊN LOGIC CŨ NHƯ YÊU CẦU) ---
  const originalPrice = product.price;
  const now = new Date();
  const flashSale = product.flash_sale;

  // Kiểm tra kỹ lưỡng thời gian
  const isFlashSaleActive =
    flashSale &&
    flashSale.status &&
    new Date(flashSale.start_date) <= now &&
    new Date(flashSale.end_date) >= now;

  let currentPrice, discountPercent;

  if (isFlashSaleActive) {
    // Ưu tiên tính giá Flash Sale
    if (flashSale.sale_price) {
      currentPrice = flashSale.sale_price;
      // Tính ngược lại % giảm giá nếu có giá sale cụ thể
      discountPercent = Math.round(
        ((originalPrice - currentPrice) / originalPrice) * 100,
      );
    } else {
      discountPercent = flashSale.discount_percent;
      currentPrice = originalPrice * (1 - discountPercent / 100);
    }
  } else {
    // Giá thường
    discountPercent = product.discount || 0;
    currentPrice = originalPrice * (1 - discountPercent / 100);
  }

  const averageRating = product.average_rating || 0;
  const totalReviews = reviews.length;
  const galleryImages = [
    product.image_url,
    product.image_url,
    product.image_url,
  ].filter(Boolean);

  const specsList = [
    { label: "Danh mục", value: product.category_id?.name },
    { label: "Kích thước", value: product.size },
    { label: "Màu sắc", value: product.color },
    { label: "Chất liệu", value: product.material },
    { label: "Bảo hành", value: product.warranty },
    { label: "Xuất xứ", value: product.origin },
  ].filter((item) => item.value);

  return (
    <div className="bg-gray-50 min-h-screen py-8 font-sans">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6 flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
          <Link to="/" className="hover:text-blue-600">
            Trang chủ
          </Link>
          <span>/</span>
          <Link to="#" className="hover:text-blue-600">
            {product.category_id?.name || "Sản phẩm"}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-[200px]">
            {product.product_name}
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* --- LEFT: IMAGES --- */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200 relative group">
                <img
                  src={mainImage}
                  alt={product.product_name}
                  className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />
                {discountPercent > 0 && (
                  <div
                    className={`absolute top-4 left-4 text-white text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1 ${isFlashSaleActive ? "bg-orange-600" : "bg-red-500"}`}
                  >
                    {isFlashSaleActive && <Zap size={12} fill="white" />} -
                    {discountPercent}%
                  </div>
                )}
                <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full text-gray-500 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Share2 size={20} />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className={`aspect-square rounded-lg border-2 cursor-pointer overflow-hidden transition-all ${mainImage === img ? "border-blue-600 ring-1 ring-blue-600" : "border-transparent hover:border-blue-300"}`}
                    onClick={() => setMainImage(img)}
                  >
                    <img
                      src={img}
                      alt={`Thumb ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* --- RIGHT: INFO --- */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                    {product.product_name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center text-yellow-400 gap-1">
                      <span className="font-bold text-gray-900 text-lg mr-1">
                        {averageRating.toFixed(1)}
                      </span>
                      {renderStars(averageRating)}
                    </div>
                    <span className="text-gray-300">|</span>
                    <span className="text-blue-600 hover:underline cursor-pointer">
                      {totalReviews} đánh giá
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-500">
                      Mã SP: {product._id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-50">
                  <Heart size={24} />
                </button>
              </div>

              {/* Price Box */}
              <div
                className={`p-4 rounded-xl mb-6 border ${isFlashSaleActive ? "bg-gradient-to-r from-orange-50 to-red-50 border-orange-200" : "bg-blue-50/50 border-blue-100"}`}
              >
                {isFlashSaleActive && (
                  <div className="flex items-center gap-2 mb-2 text-orange-600 font-bold uppercase text-sm">
                    <Zap size={18} fill="currentColor" />
                    <span>Flash Sale</span>
                    <span className="ml-auto flex items-center gap-1 text-gray-500 font-normal normal-case text-xs">
                      <Clock size={14} /> Kết thúc:{" "}
                      {new Date(flashSale.end_date).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                )}
                <div className="flex items-end gap-3 mb-1">
                  <span
                    className={`text-3xl font-bold ${isFlashSaleActive ? "text-red-600" : "text-blue-600"}`}
                  >
                    {formatCurrency(currentPrice)}
                  </span>
                  {discountPercent > 0 && (
                    <span className="text-gray-400 line-through text-lg mb-1">
                      {formatCurrency(originalPrice)}
                    </span>
                  )}
                </div>
                {discountPercent > 0 && (
                  <div
                    className={`text-sm flex items-center gap-1 font-medium ${isFlashSaleActive ? "text-red-700" : "text-blue-800"}`}
                  >
                    <Tag size={14} /> Tiết kiệm:{" "}
                    {formatCurrency(originalPrice - currentPrice)}
                  </div>
                )}
              </div>

              {/* Policies & Actions (Giữ nguyên) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <CheckCircle
                    size={20}
                    className="text-green-500 flex-shrink-0"
                  />{" "}
                  <span>Hàng chính hãng 100%</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <Truck size={20} className="text-green-500 flex-shrink-0" />{" "}
                  <span>Miễn phí vận chuyển</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <ShieldCheck
                    size={20}
                    className="text-green-500 flex-shrink-0"
                  />{" "}
                  <span>Bảo hành {product.warranty || "12 tháng"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <RotateCcw
                    size={20}
                    className="text-green-500 flex-shrink-0"
                  />{" "}
                  <span>Đổi trả trong 30 ngày</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                  <button
                    className="p-3.5 hover:bg-gray-100 text-gray-600 disabled:opacity-50 transition-colors"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-14 text-center font-bold text-lg">
                    {quantity}
                  </span>
                  <button
                    className="p-3.5 hover:bg-gray-100 text-gray-600 transition-colors"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <div className="flex-1 flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="flex-1 bg-blue-600 text-white py-3.5 px-6 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98] disabled:opacity-70"
                  >
                    {addingToCart ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart size={20} /> Thêm vào giỏ
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={addingToCart}
                    className="bg-orange-100 text-orange-600 py-3.5 px-4 rounded-xl font-bold hover:bg-orange-200 transition-colors disabled:opacity-70"
                  >
                    Mua ngay
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* --- TABS SECTION (Giữ nguyên) --- */}
          <div className="border-t border-gray-200">
            <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
              <button
                className={`px-8 py-4 font-bold text-sm uppercase tracking-wide whitespace-nowrap transition-colors border-b-2 ${activeTab === "description" ? "text-blue-600 border-blue-600 bg-blue-50/50" : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"}`}
                onClick={() => setActiveTab("description")}
              >
                Mô tả sản phẩm
              </button>
              <button
                className={`px-8 py-4 font-bold text-sm uppercase tracking-wide whitespace-nowrap transition-colors border-b-2 ${activeTab === "specs" ? "text-blue-600 border-blue-600 bg-blue-50/50" : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"}`}
                onClick={() => setActiveTab("specs")}
              >
                Thông số kỹ thuật
              </button>
              <button
                className={`px-8 py-4 font-bold text-sm uppercase tracking-wide whitespace-nowrap transition-colors border-b-2 ${activeTab === "reviews" ? "text-blue-600 border-blue-600 bg-blue-50/50" : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"}`}
                onClick={() => setActiveTab("reviews")}
              >
                Đánh giá ({totalReviews})
              </button>
            </div>

            <div className="p-6 md:p-10 min-h-[300px]">
              {activeTab === "description" && (
                <div className="prose max-w-none text-gray-700">
                  <p className="text-lg mb-4 leading-relaxed whitespace-pre-line">
                    {product.description ||
                      "Chưa có mô tả chi tiết cho sản phẩm này."}
                  </p>
                </div>
              )}
              {activeTab === "specs" && (
                <div className="max-w-3xl mx-auto">
                  <h3 className="font-bold text-xl mb-6 text-gray-900">
                    Thông số kỹ thuật chi tiết
                  </h3>
                  <div className="border rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-left text-gray-600">
                      <tbody>
                        {specsList.length > 0 ? (
                          specsList.map((spec, index) => (
                            <tr
                              key={index}
                              className={`border-b border-gray-100 last:border-none ${index % 2 === 0 ? "bg-gray-50/50" : "bg-white"}`}
                            >
                              <td className="py-4 px-6 font-medium text-gray-900 w-1/3">
                                {spec.label}
                              </td>
                              <td className="py-4 px-6">{spec.value}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              className="py-4 px-6 text-center text-gray-500"
                              colSpan="2"
                            >
                              Chưa có thông số kỹ thuật
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {activeTab === "reviews" && (
                <div className="max-w-4xl mx-auto">
                  <div className="mb-8 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">
                      Khách hàng nhận xét
                    </h3>
                    <div className="text-sm text-gray-500">
                      Hiển thị {reviews.length} đánh giá
                    </div>
                  </div>
                  {reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div
                          key={review._id}
                          className="border-b border-gray-100 last:border-0 pb-6 last:pb-0 animate-in fade-in slide-in-from-bottom-2"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0 text-gray-400 overflow-hidden">
                              {review.user_id?.avatar ? (
                                <img
                                  src={review.user_id.avatar}
                                  alt="User"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User size={20} />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-bold text-gray-900 text-sm">
                                    {review.user_id?.fullname ||
                                      "Người dùng ẩn danh"}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    {renderStars(review.rating, 14)}
                                  </div>
                                </div>
                                <span className="text-xs text-gray-400">
                                  {new Date(
                                    review.createdAt,
                                  ).toLocaleDateString("vi-VN")}
                                </span>
                              </div>
                              <p className="mt-3 text-gray-700 text-sm leading-relaxed">
                                {review.comment}
                              </p>
                              {review.is_purchased && (
                                <div className="mt-2 inline-flex items-center gap-1 text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded">
                                  <CheckCircle size={12} /> Đã mua hàng từ
                                  ElectroShop
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                        <MessageSquare size={32} />
                      </div>
                      <h4 className="text-lg font-medium text-gray-900">
                        Chưa có đánh giá nào
                      </h4>
                      <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
                        Hãy mua sản phẩm này để trở thành người đầu tiên chia sẻ
                        cảm nhận của bạn.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- RELATED PRODUCTS (Giữ nguyên) --- */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Sản phẩm tương tự
            </h2>
            <Link
              to="/products"
              className="text-blue-600 font-medium hover:underline flex items-center gap-1 text-sm"
            >
              Xem tất cả
            </Link>
          </div>
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((item) => {
                // Logic tính giá sale cho sản phẩm tương tự
                const itemFlashSale = item.flash_sale;
                const isItemFlashSale =
                  itemFlashSale &&
                  itemFlashSale.status &&
                  new Date(itemFlashSale.end_date) > new Date();
                const itemOriginalPrice = item.price;
                let itemCurrentPrice, itemDiscount;
                if (isItemFlashSale) {
                  if (itemFlashSale.sale_price) {
                    itemCurrentPrice = itemFlashSale.sale_price;
                    itemDiscount = Math.round(
                      ((itemOriginalPrice - itemCurrentPrice) /
                        itemOriginalPrice) *
                        100,
                    );
                  } else {
                    itemDiscount = itemFlashSale.discount_percent;
                    itemCurrentPrice =
                      itemOriginalPrice * (1 - itemDiscount / 100);
                  }
                } else {
                  itemDiscount = item.discount || 0;
                  itemCurrentPrice =
                    itemOriginalPrice * (1 - itemDiscount / 100);
                }

                return (
                  <Link
                    to={`/product/${item._id}`}
                    key={item._id}
                    className="group bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer block h-full flex flex-col"
                  >
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden relative flex-shrink-0">
                      <img
                        src={
                          item.image_url ||
                          "https://placehold.co/300x300/png?text=Product"
                        }
                        alt={item.product_name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                      {itemDiscount > 0 && (
                        <span
                          className={`absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm ${isItemFlashSale ? "bg-orange-600" : "bg-red-500"}`}
                        >
                          {isItemFlashSale && (
                            <Zap size={8} className="inline mr-1 fill-white" />
                          )}{" "}
                          -{itemDiscount}%
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mb-1">
                      {item.category_id?.name || "Sản phẩm"}
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors flex-1">
                      {item.product_name}
                    </h3>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span
                          className={`font-bold text-sm ${isItemFlashSale ? "text-red-600" : "text-blue-600"}`}
                        >
                          {formatCurrency(itemCurrentPrice)}
                        </span>
                        {itemDiscount > 0 && (
                          <span className="text-xs text-gray-400 line-through">
                            {formatCurrency(itemOriginalPrice)}
                          </span>
                        )}
                      </div>
                      <button className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-colors">
                        <ShoppingCart size={14} />
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Không có sản phẩm tương tự nào.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
