import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  FolderTree,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Save,
  X,
  Loader2,
  RefreshCcw,
} from "lucide-react";

// URL API Backend
const API_URL = "http://localhost:5000/api/categories";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // UI States
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const initialFormState = {
    name: "",
    description: "", // Đã có trường description
    image: "",
    is_active: true,
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- 1. FETCH DATA ---
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setCategories(Array.isArray(data) ? data : []);
      } else {
        console.error("Backend báo lỗi:", data);
        setCategories([]);
      }
    } catch (error) {
      console.error("Lỗi kết nối mạng:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- 2. HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingId(cat._id);
    setFormData({
      name: cat.name || "",
      description: cat.description || "",
      image: cat.image || "",
      is_active: cat.is_active,
    });
    setIsModalOpen(true);
  };

  // --- 3. SAVE (CREATE / UPDATE) ---
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      const res = await fetch(url, {
        method: method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Có lỗi xảy ra");

      alert(editingId ? "Cập nhật thành công!" : "Thêm mới thành công!");
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      alert("Lỗi: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 4. DELETE ---
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        const res = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) {
          setCategories((prev) => prev.filter((c) => c._id !== id));
        } else {
          const data = await res.json();
          alert("Xóa thất bại: " + (data.error || data.message));
        }
      } catch (error) {
        alert("Lỗi kết nối khi xóa");
      }
    }
  };

  const filteredCategories = categories.filter((c) =>
    (c.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FolderTree className="text-blue-600" /> Quản lý Danh mục
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {loading ? "Đang tải..." : `Tổng số: ${categories.length} danh mục`}
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-sm transition-all"
        >
          <Plus size={18} /> Thêm danh mục
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-100 flex gap-2">
        <div className="relative w-full md:w-1/2">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <button
          onClick={fetchCategories}
          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
          title="Tải lại"
        >
          <RefreshCcw size={20} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 overflow-x-auto min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p>Đang đồng bộ dữ liệu...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold">
              <tr>
                <th className="py-4 px-6 w-20">Ảnh</th>
                <th className="py-4 px-6 w-1/4">Tên danh mục</th>
                {/* THÊM CỘT MÔ TẢ Ở ĐÂY */}
                <th className="py-4 px-6">Mô tả</th>
                <th className="py-4 px-6">Trạng thái</th>
                <th className="py-4 px-6 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <tr
                    key={cat._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "";
                            }}
                          />
                        ) : (
                          <ImageIcon size={20} className="text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-800 text-base">
                        {cat.name}
                      </div>
                      <div className="text-xs text-blue-500 mt-1">
                        /{cat.slug || "chua-co-slug"}
                      </div>
                    </td>

                    {/* HIỂN THỊ MÔ TẢ */}
                    <td className="py-4 px-6">
                      <p
                        className="text-gray-500 line-clamp-2 max-w-xs"
                        title={cat.description}
                      >
                        {cat.description || "---"}
                      </p>
                    </td>

                    <td className="py-4 px-6">
                      {cat.is_active ? (
                        <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded-full text-xs font-medium border border-green-200">
                          <CheckCircle size={12} /> Hiển thị
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-1 rounded-full text-xs font-medium border border-gray-200">
                          <XCircle size={12} /> Đang ẩn
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-2 bg-white border border-gray-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-all shadow-sm"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="p-2 bg-white border border-gray-200 text-red-600 rounded-lg hover:bg-red-50 transition-all shadow-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <FolderTree size={48} className="text-gray-300 mb-2" />
                      <p>Chưa có danh mục nào.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
              <h3 className="text-xl font-bold text-gray-800">
                {editingId ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="VD: Điện thoại"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link Ảnh đại diện
                </label>
                <input
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="https://..."
                />
              </div>

              {/* Description - ĐÃ ĐƯỢC THÊM VÀO FORM */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Mô tả ngắn về danh mục..."
                ></textarea>
              </div>

              {/* Status Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                />
                <label
                  htmlFor="is_active"
                  className="text-sm font-medium text-gray-700 select-none cursor-pointer"
                >
                  Kích hoạt (Hiển thị)
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Save size={18} />
                  )}
                  Lưu lại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
