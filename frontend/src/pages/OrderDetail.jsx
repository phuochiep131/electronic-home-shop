import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  CreditCard,
  User,
  Phone,
  Package,
  Loader2,
  AlertCircle,
  Star,
  Send,
  X,
  MessageSquarePlus,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000/api";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- STATE DỮ LIỆU ĐƠN HÀNG ---
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- STATE CHO FORM ĐÁNH GIÁ ---
  const [reviewingProductId, setReviewingProductId] = useState(null); // Lưu ID sản phẩm đang mở form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // 1. FETCH DATA KHI LOAD TRANG
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const res = await axios.get(`${API_BASE}/orders/detail/${id}`, {
          withCredentials: true,
        });
        setOrder(res.data.order);
        // Backend cần trả về field 'is_reviewed' trong từng item để biết đã đánh giá chưa
        setItems(res.data.items);
      } catch (err) {
        console.error("Lỗi tải chi tiết đơn hàng:", err);
        setError("Không tìm thấy đơn hàng hoặc bạn không có quyền truy cập.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [id]);

  // 2. XỬ LÝ FORM ĐÁNH GIÁ
  // Mở form
  const handleOpenReview = (productId) => {
    if (reviewingProductId === productId) {
      handleCancelReview(); // Nếu đang mở thì đóng lại
    } else {
      setReviewingProductId(productId);
      setRating(5);
      setComment("");
    }
  };

  // Đóng form
  const handleCancelReview = () => {
    setReviewingProductId(null);
    setRating(5);
    setComment("");
  };

  // Gửi đánh giá
  const handleSubmitReview = async (productId) => {
    if (!comment.trim()) {
      toast.warning("Vui lòng nhập nội dung đánh giá!");
      return;
    }

    setIsSubmittingReview(true);
    try {
      await axios.post(
        `${API_BASE}/reviews`,
        {
          product_id: productId,
          rating: rating,
          comment: comment,
        },
        { withCredentials: true },
      );

      toast.success("Đánh giá sản phẩm thành công!");

      // --- CẬP NHẬT UI NGAY LẬP TỨC (QUAN TRỌNG) ---
      // Tìm item vừa đánh giá trong mảng items và set is_reviewed = true
      setItems((prevItems) =>
        prevItems.map((item) => {
          if (item.product_id && item.product_id._id === productId) {
            return { ...item, is_reviewed: true };
          }
          return item;
        }),
      );

      handleCancelReview(); // Đóng form sau khi thành công
    } catch (error) {
      toast.error(error.response?.data?.error || "Không thể gửi đánh giá.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // 3. XỬ LÝ HỦY ĐƠN HÀNG
  const handleCancelOrder = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;
    try {
      await axios.put(
        `${API_BASE}/orders/cancel/${id}`,
        {},
        { withCredentials: true },
      );
      toast.success("Đã hủy đơn hàng thành công!");
      // Reload lại dữ liệu để cập nhật trạng thái
      setLoading(true);
      const res = await axios.get(`${API_BASE}/orders/detail/${id}`, {
        withCredentials: true,
      });
      setOrder(res.data.order);
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Lỗi khi hủy đơn hàng");
    }
  };

  // --- HELPER FORMATTERS ---
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusColor = (status) => {
    if (status === "delivered")
      return "bg-green-100 text-green-700 border-green-200";
    if (status === "cancelled") return "bg-red-100 text-red-700 border-red-200";
    if (status === "pending")
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  const getStatusText = (status) => {
    const map = {
      pending: "Chờ xử lý",
      processing: "Đang đóng gói",
      shipping: "Đang giao hàng",
      delivered: "Đã giao thành công",
      cancelled: "Đã hủy",
    };
    return map[status] || status;
  };

  // --- RENDER ---
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  if (error)
    return <div className="text-center py-20 text-gray-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-sans">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Nút Back */}
        <Link
          to="/my-orders"
          className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors font-medium"
        >
          <ArrowLeft size={18} className="mr-2" /> Quay lại danh sách
        </Link>

        {/* 1. HEADER ĐƠN HÀNG */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg font-bold text-gray-900">
                  Đơn hàng #{order._id.slice(-6).toUpperCase()}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.order_status)}`}
                >
                  {getStatusText(order.order_status).toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Calendar size={14} /> Ngày đặt:{" "}
                {formatDate(order.order_date || order.createdAt)}
              </p>
            </div>
            {order.order_status === "pending" && (
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors shadow-sm"
              >
                Hủy đơn hàng
              </button>
            )}
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Địa chỉ */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                <MapPin size={16} className="text-blue-600" /> Địa chỉ nhận hàng
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User size={16} className="text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-700 font-medium">
                    {order.user_id?.fullname || "Người dùng"}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-700">
                    {order.user_id?.phone_number || "---"}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-600 leading-relaxed">
                    {order.shipping_address}
                  </span>
                </div>
              </div>
            </div>
            {/* Thanh toán */}
            <div className="md:border-l md:border-gray-100 md:pl-8">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                <CreditCard size={16} className="text-blue-600" /> Thanh toán
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phương thức:</span>
                  <span className="font-medium text-gray-900">
                    {order.payment_id?.payment_method || "COD"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tình trạng:</span>
                  <span
                    className={`font-medium ${order.payment_id?.payment_status === "completed" ? "text-green-600" : "text-orange-600"}`}
                  >
                    {order.payment_id?.payment_status === "completed"
                      ? "Đã thanh toán"
                      : "Chưa thanh toán"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. DANH SÁCH SẢN PHẨM & FORM ĐÁNH GIÁ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Package size={18} className="text-blue-600" /> Sản phẩm đã mua
            </h3>
          </div>

          <div className="divide-y divide-gray-100">
            {items.map((item) => {
              const isReviewing = reviewingProductId === item.product_id?._id;
              // Biến này xác định xem sản phẩm đã được đánh giá chưa (từ backend hoặc sau khi update state)
              const isReviewed = item.is_reviewed;

              return (
                <div key={item._id} className="group">
                  {/* --- SẢN PHẨM INFO --- */}
                  <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        {item.product_id?.image_url ? (
                          <img
                            src={item.product_id.image_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package size={24} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.product_id?._id}`}
                          className="font-medium text-gray-900 truncate hover:text-blue-600 transition-colors block mb-1"
                        >
                          {item.product_id?.product_name ||
                            "Sản phẩm không tồn tại"}
                        </Link>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Đơn giá: {formatCurrency(item.unit_price)}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Số lượng: x{item.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:min-w-[200px]">
                      <span className="block text-sm sm:text-base font-bold text-blue-600">
                        {formatCurrency(item.subtotal)}
                      </span>

                      {/* --- LOGIC NÚT ĐÁNH GIÁ --- */}
                      {/* Chỉ hiện nút khi đơn hàng ĐÃ GIAO và sản phẩm còn tồn tại */}
                      {order.order_status === "delivered" &&
                        item.product_id && (
                          <>
                            {isReviewed ? (
                              // Nếu ĐÃ đánh giá
                              <span className="px-3 py-1.5 text-xs font-bold text-green-600 bg-green-50 border border-green-200 rounded-lg flex items-center gap-1 cursor-default select-none">
                                <CheckCircle size={14} /> Đã đánh giá
                              </span>
                            ) : (
                              // Nếu CHƯA đánh giá
                              <button
                                onClick={() =>
                                  handleOpenReview(item.product_id._id)
                                }
                                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 border
                                        ${
                                          isReviewing
                                            ? "bg-gray-100 text-gray-600 border-gray-300"
                                            : "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100"
                                        }`}
                              >
                                {isReviewing ? (
                                  <X size={14} />
                                ) : (
                                  <MessageSquarePlus size={14} />
                                )}
                                {isReviewing ? "Đóng" : "Viết đánh giá"}
                              </button>
                            )}
                          </>
                        )}
                    </div>
                  </div>

                  {/* --- FORM ĐÁNH GIÁ (INLINE) --- */}
                  {/* Chỉ hiển thị nếu đang review đúng sản phẩm này VÀ chưa review xong */}
                  {isReviewing && !isReviewed && (
                    <div className="px-4 pb-6 sm:px-6 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 relative">
                        {/* Mũi tên trang trí */}
                        <div className="absolute -top-2 right-12 w-4 h-4 bg-gray-50 border-t border-l border-gray-200 transform rotate-45"></div>

                        <h4 className="text-sm font-bold text-gray-700 mb-3">
                          Đánh giá sản phẩm này
                        </h4>

                        {/* 1. Chọn Sao */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                className="focus:outline-none transition-transform hover:scale-110"
                              >
                                <Star
                                  size={24}
                                  fill={
                                    star <= (hoverRating || rating)
                                      ? "#FACC15"
                                      : "none"
                                  }
                                  className={
                                    star <= (hoverRating || rating)
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }
                                />
                              </button>
                            ))}
                          </div>
                          <span className="text-sm font-medium text-yellow-600">
                            {rating === 5 && "Tuyệt vời"}
                            {rating === 4 && "Hài lòng"}
                            {rating === 3 && "Bình thường"}
                            {rating === 2 && "Không hài lòng"}
                            {rating === 1 && "Tệ"}
                          </span>
                        </div>

                        {/* 2. Nhập nội dung */}
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Chia sẻ cảm nhận của bạn về chất lượng sản phẩm..."
                          className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none h-24 bg-white"
                        ></textarea>

                        {/* 3. Nút Gửi */}
                        <div className="flex justify-end gap-3 mt-3">
                          <button
                            onClick={handleCancelReview}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            Hủy bỏ
                          </button>
                          <button
                            onClick={() =>
                              handleSubmitReview(item.product_id._id)
                            }
                            disabled={isSubmittingReview}
                            className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
                          >
                            {isSubmittingReview ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : (
                              <Send size={16} />
                            )}
                            Gửi đánh giá
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Tổng tiền */}
          <div className="bg-gray-50 p-6 border-t border-gray-100 text-right">
            <div className="text-sm text-gray-500 mb-1">Tổng cộng</div>
            <div className="font-bold text-xl text-blue-600">
              {formatCurrency(order.total_amount)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
