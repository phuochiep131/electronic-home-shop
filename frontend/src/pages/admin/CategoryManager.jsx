import React, { useState, useEffect, useRef } from "react";
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
  UploadCloud,
} from "lucide-react";

// --- CẤU HÌNH API ---
const API_URL = "http://localhost:5000/api/categories";

// --- CẤU HÌNH CLOUDINARY ---
const CLOUD_NAME = "detransaw";
const UPLOAD_PRESET = "web_upload";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // UI States
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- STATE ẢNH & UPLOAD ---
  const [selectedImageFile, setSelectedImageFile] = useState(null); // File ảnh mới chọn
  const [imagePreview, setImagePreview] = useState(""); // Link ảnh để xem trước
  const fileInputRef = useRef(null);

  // Form State
  const initialFormState = {
    name: "",
    description: "",
    image: "", // Lưu link ảnh (string)
    is_active: true,
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- 1. FETCH DATA ---
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, { credentials: "include" });
      const data = await res.json();
      if (res.ok) {
        setCategories(Array.isArray(data) ? data : []);
      } else {
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

  // --- 2. UPLOAD CLOUDINARY (CLIENT SIDE) ---
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      return data.secure_url; // Trả về link ảnh HTTPS
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
      throw new Error("Không thể upload ảnh lên Cloudinary.");
    }
  };

  // --- 3. HANDLERS ẢNH ---
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Tạo link ảo xem trước ngay
      e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setSelectedImageFile(null);
    setImagePreview("");
    setFormData((prev) => ({ ...prev, image: "" })); // Xóa link ảnh trong form data
  };

  // --- 4. FORM HANDLERS ---
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

    // Reset ảnh
    setSelectedImageFile(null);
    setImagePreview("");

    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingId(cat._id);
    setFormData({
      name: cat.name || "",
      description: cat.description || "",
      image: cat.image || "", // Giữ link ảnh cũ
      is_active: cat.is_active,
    });

    // QUAN TRỌNG: Hiển thị ảnh cũ lên khung preview
    setImagePreview(cat.image || "");
    setSelectedImageFile(null); // Reset file mới (vì chưa chọn gì)

    setIsModalOpen(true);
  };

  // --- 5. SAVE (CREATE / UPDATE) ---
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalImageUrl = formData.image; // Mặc định dùng link cũ (nếu đang sửa)

      // Nếu người dùng CÓ chọn ảnh mới -> Upload lên Cloudinary lấy link mới
      if (selectedImageFile) {
        finalImageUrl = await uploadToCloudinary(selectedImageFile);
      }

      const payload = {
        ...formData,
        image: finalImageUrl, // Cập nhật link ảnh mới nhất vào payload
      };

      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      const res = await fetch(url, {
        method: method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Có lỗi xảy ra");

      alert(editingId ? "Cập nhật thành công!" : "Thêm mới thành công!");
      setIsModalOpen(false);
      fetchCategories(); // Load lại danh sách
    } catch (error) {
      alert("Lỗi: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 6. DELETE ---
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
    <div className="relative min-h-screen pb-10 font-sans text-gray-800">
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
            <p>Đang tải...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold">
              <tr>
                <th className="py-4 px-6 w-20">Ảnh</th>
                <th className="py-4 px-6 w-1/4">Tên danh mục</th>
                <th className="py-4 px-6">Mô tả</th>
                <th className="py-4 px-6">Trạng thái</th>
                <th className="py-4 px-6 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {filteredCategories.map((cat) => (
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
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-gray-500 line-clamp-2 max-w-xs">
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
                        className="p-2 bg-white border border-gray-200 text-blue-600 rounded-lg hover:bg-blue-50"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="p-2 bg-white border border-gray-200 text-red-600 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-xl sticky top-0 z-10 backdrop-blur-md">
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

            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Tên danh mục */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="VD: Điện thoại"
                />
              </div>

              {/* UPLOAD ẢNH (Phần quan trọng bạn cần) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ảnh đại diện
                </label>

                {/* Input file ẩn */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  className="hidden"
                />

                {imagePreview ? (
                  // Trường hợp ĐÃ CÓ ẢNH (Do upload mới hoặc từ edit cũ)
                  <div className="relative w-full h-48 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />

                    {/* Nút thay đổi/xóa khi hover */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="bg-white text-blue-600 px-3 py-1.5 rounded-lg text-xs font-medium shadow-md hover:bg-blue-50"
                      >
                        Thay đổi
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="bg-white text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium shadow-md hover:bg-red-50"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ) : (
                  // Trường hợp CHƯA CÓ ẢNH -> Hiện khung upload
                  <div
                    onClick={() => fileInputRef.current.click()}
                    className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all group"
                  >
                    <div className="bg-blue-50 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                      <UploadCloud className="text-blue-500" size={24} />
                    </div>
                    <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">
                      Nhấn để tải ảnh lên
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      JPG, PNG (Max 5MB)
                    </span>
                  </div>
                )}

                {/* Input nhập link ảnh dự phòng (Optional, có thể bỏ nếu muốn bắt buộc upload) */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    Hoặc link:
                  </span>
                  <input
                    name="image"
                    value={formData.image}
                    onChange={(e) => {
                      handleInputChange(e);
                      // Nếu người dùng paste link vào thì cập nhật preview luôn (nếu chưa chọn file)
                      if (!selectedImageFile) setImagePreview(e.target.value);
                    }}
                    className="w-full border-b border-gray-200 text-xs py-1 focus:border-blue-500 outline-none text-gray-600"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                  placeholder="Mô tả ngắn về danh mục..."
                ></textarea>
              </div>

              {/* Status Checkbox */}
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="is_active"
                  className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                >
                  Kích hoạt (Hiển thị trên web)
                </label>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Save size={18} />
                  )}{" "}
                  {editingId ? "Lưu thay đổi" : "Thêm mới"}
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
