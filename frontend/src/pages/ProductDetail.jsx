import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; // Added useNavigate
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
} from "lucide-react";
import { useCart } from "../context/CartContext";

// Cấu hình API URL
const API_URL = "http://localhost:5000/api";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize navigate
  const [activeTab, setActiveTab] = useState("description");

  // State dữ liệu
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false); // Loading state for button

  const handleBuyNow = async () => {
    setAddingToCart(true);
    // Gọi hàm từ Context
    const success = await addToCart(product._id, quantity);
    setAddingToCart(false);

    if (success) {
      // Có thể chuyển hướng đến trang giỏ hàng luôn nếu muốn
      navigate("/cart");
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    await addToCart(product._id, quantity);
    setAddingToCart(false);
  };

  // Format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Gọi API lấy chi tiết sản phẩm
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        // 1. Lấy chi tiết sản phẩm
        const res = await axios.get(`${API_URL}/products/${id}`);
        const data = res.data;
        setProduct(data);

        // Set ảnh mặc định (fallback nếu không có ảnh)
        const img =
          data.image_url || "https://placehold.co/600x600/png?text=No+Image";
        setMainImage(img);

        // 2. Lấy sản phẩm tương tự (cùng danh mục)
        if (data.category_id && data.category_id._id) {
          const catId = data.category_id._id;
          const relatedRes = await axios.get(
            `${API_URL}/products?category=${catId}`
          );
          // Lọc bỏ sản phẩm hiện tại & lấy 4 sản phẩm khác
          const related = relatedRes.data
            .filter((p) => p._id !== id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
      window.scrollTo(0, 0); // Cuộn lên đầu trang khi chuyển sản phẩm
      setQuantity(1); // Reset số lượng
    }
  }, [id]);

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

  // --- XỬ LÝ DỮ LIỆU HIỂN THỊ ---
  const originalPrice = product.price;
  const discount = product.discount || 0;
  const currentPrice = originalPrice * (1 - discount / 100);
  const ratingMock = 4.8; // DB chưa có rating, giả lập
  const reviewsMock = 128; // DB chưa có reviews, giả lập

  // Tạo danh sách ảnh giả lập (Vì DB chỉ có 1 ảnh, ta nhân bản lên để demo Gallery)
  const galleryImages = [
    product.image_url,
    product.image_url,
    product.image_url,
    product.image_url,
  ].filter(Boolean); // Lọc bỏ giá trị null/undefined

  // Tạo danh sách thông số kỹ thuật từ các trường có trong DB
  const specsList = [
    { label: "Danh mục", value: product.category_id?.name }, // Changed category_name to name based on your schema updates
    { label: "Kích thước / Dung tích", value: product.size },
    { label: "Màu sắc", value: product.color },
    { label: "Chất liệu", value: product.material },
    { label: "Bảo hành", value: product.warranty },
    { label: "Xuất xứ", value: product.origin },
  ].filter((item) => item.value); // Chỉ hiện thị các trường có dữ liệu

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
            {/* --- LEFT SIDE: IMAGES GALLERY --- */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200 relative group">
                <img
                  src={
                    mainImage ||
                    "https://placehold.co/600x600/png?text=No+Image"
                  }
                  alt={product.product_name}
                  className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />
                {discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                    -{discount}%
                  </div>
                )}
                <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full text-gray-500 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Share2 size={20} />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-4">
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className={`aspect-square rounded-lg border-2 cursor-pointer overflow-hidden transition-all ${
                      mainImage === img
                        ? "border-blue-600 ring-1 ring-blue-600"
                        : "border-transparent hover:border-blue-300"
                    }`}
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

            {/* --- RIGHT SIDE: PRODUCT INFO --- */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                    {product.product_name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={
                            i < Math.floor(ratingMock) ? "currentColor" : "none"
                          }
                          className={
                            i >= Math.floor(ratingMock) ? "text-gray-300" : ""
                          }
                        />
                      ))}
                      <span className="font-bold text-gray-900 ml-2">
                        {ratingMock}
                      </span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <span className="text-blue-600 hover:underline cursor-pointer">
                      {reviewsMock} đánh giá
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

              <div className="bg-blue-50/50 p-4 rounded-xl mb-6 border border-blue-100">
                <div className="flex items-end gap-3 mb-1">
                  <span className="text-3xl font-bold text-blue-600">
                    {formatCurrency(currentPrice)}
                  </span>
                  {discount > 0 && (
                    <span className="text-gray-400 line-through text-lg mb-1">
                      {formatCurrency(originalPrice)}
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <div className="text-sm text-blue-800 flex items-center gap-1 font-medium">
                    <Tag size={14} /> Tiết kiệm:{" "}
                    {formatCurrency(originalPrice - currentPrice)}
                  </div>
                )}
              </div>

              {/* Policies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <CheckCircle
                    size={20}
                    className="text-green-500 flex-shrink-0"
                  />
                  <span>Hàng chính hãng 100%</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <Truck size={20} className="text-green-500 flex-shrink-0" />
                  <span>Miễn phí vận chuyển</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <ShieldCheck
                    size={20}
                    className="text-green-500 flex-shrink-0"
                  />
                  <span>Bảo hành {product.warranty || "12 tháng"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <RotateCcw
                    size={20}
                    className="text-green-500 flex-shrink-0"
                  />
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

          {/* --- TABS: DESCRIPTION & SPECS --- */}
          <div className="border-t border-gray-200">
            <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
              <button
                className={`px-8 py-4 font-bold text-sm uppercase tracking-wide whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === "description"
                    ? "text-blue-600 border-blue-600 bg-blue-50/50"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("description")}
              >
                Mô tả sản phẩm
              </button>
              <button
                className={`px-8 py-4 font-bold text-sm uppercase tracking-wide whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === "specs"
                    ? "text-blue-600 border-blue-600 bg-blue-50/50"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("specs")}
              >
                Thông số kỹ thuật
              </button>
              <button
                className={`px-8 py-4 font-bold text-sm uppercase tracking-wide whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === "reviews"
                    ? "text-blue-600 border-blue-600 bg-blue-50/50"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("reviews")}
              >
                Đánh giá ({reviewsMock})
              </button>
            </div>

            <div className="p-6 md:p-10 min-h-[300px]">
              {activeTab === "description" && (
                <div className="prose max-w-none text-gray-700">
                  <p className="text-lg mb-4 leading-relaxed whitespace-pre-line">
                    {product.description ||
                      "Chưa có mô tả chi tiết cho sản phẩm này."}
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <CheckCircle size={18} className="text-blue-600" /> Đặc
                        điểm nổi bật
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></span>
                          Sản phẩm chính hãng chất lượng cao.
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></span>
                          Bảo hành dài hạn, hỗ trợ kỹ thuật 24/7.
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></span>
                          Thiết kế hiện đại, phù hợp mọi không gian.
                        </li>
                      </ul>
                    </div>
                  </div>
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
                              className={`border-b border-gray-100 last:border-none ${
                                index % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                              }`}
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
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <Star size={32} className="text-gray-400" />
                  </div>
                  <p className="text-lg font-medium">Chưa có đánh giá nào</p>
                  <p className="text-sm mt-1">
                    Hãy là người đầu tiên đánh giá sản phẩm này!
                  </p>
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
                const itemOriginalPrice = item.price;
                const itemDiscount = item.discount || 0;
                const itemCurrentPrice =
                  itemOriginalPrice * (1 - itemDiscount / 100);

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
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
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
                        <span className="text-blue-600 font-bold text-sm">
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
