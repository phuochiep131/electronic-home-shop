import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MessageSquare,
  Search,
  Star,
  Trash2,
  Filter,
  User,
  Package,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000/api";

const ReviewManager = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterRating, setFilterRating] = useState(""); // "" = All, 1-5
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce search (Optional optimization)
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // --- FETCH DATA ---
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/reviews/admin/all`, {
        params: {
          page,
          limit: 10,
          rating: filterRating,
          search: debouncedSearch,
        },
        withCredentials: true,
      });

      setReviews(res.data.reviews);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Lỗi tải đánh giá:", error);
      toast.error("Không thể tải danh sách đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page, filterRating, debouncedSearch]);

  // --- DELETE REVIEW ---
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không thể hoàn tác.",
      )
    )
      return;

    try {
      await axios.delete(`${API_BASE}/reviews/admin/${id}`, {
        withCredentials: true,
      });
      toast.success("Đã xóa đánh giá thành công");
      fetchReviews(); // Reload list
    } catch (error) {
      toast.error("Lỗi khi xóa đánh giá");
    }
  };

  // --- HELPER RENDER STARS ---
  const renderStars = (rating) => (
    <div className="flex text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          fill={i < rating ? "currentColor" : "none"}
          className={i >= rating ? "text-gray-300" : ""}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="text-blue-600" /> Quản lý Đánh giá
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Xem và kiểm duyệt ý kiến khách hàng
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Tìm kiếm nội dung đánh giá..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 min-w-[200px]">
          <Filter size={18} className="text-slate-500" />
          <select
            value={filterRating}
            onChange={(e) => {
              setFilterRating(e.target.value);
              setPage(1);
            }}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả sao</option>
            <option value="5">5 Sao (Tuyệt vời)</option>
            <option value="4">4 Sao (Tốt)</option>
            <option value="3">3 Sao (Bình thường)</option>
            <option value="2">2 Sao (Tệ)</option>
            <option value="1">1 Sao (Rất tệ)</option>
          </select>
        </div>
      </div>

      {/* Table List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="animate-spin mx-auto text-blue-600" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            Không tìm thấy đánh giá nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold">
                <tr>
                  <th className="p-4">Sản phẩm</th>
                  <th className="p-4">Khách hàng</th>
                  <th className="p-4">Đánh giá</th>
                  <th className="p-4 w-1/3">Nội dung</th>
                  <th className="p-4 text-center">Ngày tạo</th>
                  <th className="p-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {reviews.map((review) => (
                  <tr
                    key={review._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    {/* Product Column */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex-shrink-0 overflow-hidden">
                          {review.product_id?.image_url ? (
                            <img
                              src={review.product_id.image_url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package
                              className="m-auto mt-2 text-slate-400"
                              size={16}
                            />
                          )}
                        </div>
                        <span
                          className="font-medium text-slate-700 line-clamp-2 max-w-[150px]"
                          title={review.product_id?.product_name}
                        >
                          {review.product_id?.product_name || "Sản phẩm đã xóa"}
                        </span>
                      </div>
                    </td>

                    {/* User Column */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 overflow-hidden">
                          {review.user_id?.avatar ? (
                            <img
                              src={review.user_id.avatar}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User size={16} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">
                            {review.user_id?.fullname || "Ẩn danh"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {review.user_id?.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Rating Column */}
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-slate-700">
                          {review.rating}
                        </span>
                        {renderStars(review.rating)}
                      </div>
                    </td>

                    {/* Comment Column */}
                    <td className="p-4">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-600 italic text-xs leading-relaxed max-h-24 overflow-y-auto custom-scrollbar">
                        "{review.comment}"
                      </div>
                    </td>

                    {/* Date Column */}
                    <td className="p-4 text-center text-slate-500 text-xs">
                      {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                      <br />
                      {new Date(review.createdAt).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    {/* Action Column */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa đánh giá"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
          <span className="text-sm text-slate-500">
            Trang {page} / {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewManager;
