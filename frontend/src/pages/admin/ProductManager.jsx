import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Package,
  Image as ImageIcon,
  Save,
  X,
  Loader2,
  RefreshCcw,
  Filter,
  UploadCloud,
} from "lucide-react";

// --- CẤU HÌNH ---
const API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000/api";
const CATEGORY_API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000/api";

const CLOUD_NAME = "detransaw";
const UPLOAD_PRESET = "web_upload";

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // UI States
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- STATE ẢNH ---
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  // Form State
  const initialFormState = {
    product_name: "",
    price: "",
    quantity: "",
    category_id: "",
    description: "",
    image_url: "", // Lưu link ảnh string
    discount: 0,
    size: "",
    color: "",
    material: "",
    origin: "",
    warranty: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- 1. FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resProducts, resCategories] = await Promise.all([
        fetch(`${API_URL}/products`, { credentials: "include" }),
        fetch(`${CATEGORY_API_URL}/categories`, { credentials: "include" }),
      ]);

      const dataProducts = await resProducts.json();
      const dataCategories = await resCategories.json();

      if (resProducts.ok)
        setProducts(Array.isArray(dataProducts) ? dataProducts : []);
      if (resCategories.ok)
        setCategories(Array.isArray(dataCategories) ? dataCategories : []);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. UPLOAD CLOUDINARY ---
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
      return data.secure_url;
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
      throw new Error("Không thể upload ảnh lên Cloudinary.");
    }
  };

  // --- 3. HANDLERS ---
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setSelectedImageFile(null);
    setImagePreview("");
    setFormData((prev) => ({ ...prev, image_url: "" }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setSelectedImageFile(null);
    setImagePreview("");
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product._id);
    setFormData({
      product_name: product.product_name || "",
      price: product.price || "",
      quantity: product.quantity || "",
      category_id: product.category_id
        ? typeof product.category_id === "object"
          ? product.category_id._id
          : product.category_id
        : "",
      description: product.description || "",
      image_url: product.image_url || "",
      discount: product.discount || 0,
      size: product.size || "",
      color: product.color || "",
      material: product.material || "",
      origin: product.origin || "",
      warranty: product.warranty || "",
    });
    setImagePreview(product.image_url || "");
    setSelectedImageFile(null);
    setIsModalOpen(true);
  };

  // --- 4. SAVE ---
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.category_id) {
      alert("Vui lòng chọn danh mục!");
      setIsSubmitting(false);
      return;
    }

    try {
      let finalImageUrl = formData.image_url;

      // Nếu có chọn ảnh mới -> Upload
      if (selectedImageFile) {
        finalImageUrl = await uploadToCloudinary(selectedImageFile);
      }

      const payload = { ...formData, image_url: finalImageUrl };

      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}/products/${editingId}` : `${API_URL}/products`;

      const res = await fetch(url, {
        method: method,
        credentials: "include",
        headers: { "Content-Type": "application/json" }, // Gửi JSON
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Có lỗi xảy ra");

      alert(editingId ? "Cập nhật thành công!" : "Thêm mới thành công!");
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert("Lỗi: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 5. DELETE ---
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        const res = await fetch(`${API_URL}/products/${id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (res.ok) {
          setProducts((prev) => prev.filter((p) => p._id !== id));
        } else {
          const data = await res.json();
          alert("Xóa thất bại: " + data.error);
        }
      } catch (error) {
        alert("Lỗi kết nối khi xóa");
      }
    }
  };

  const filteredProducts = products.filter((p) =>
    (p.product_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen pb-10 font-sans text-gray-800">
      {/* Header & Filter giữ nguyên */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
            <Package className="text-blue-600" /> Quản lý Sản phẩm
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {loading
              ? "Đang đồng bộ..."
              : `Tổng số: ${products.length} sản phẩm`}
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all active:scale-95"
        >
          <Plus size={18} /> Thêm sản phẩm
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 border border-gray-100 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>
        <button
          onClick={fetchData}
          className="p-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors"
        >
          <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold">
              <tr>
                <th className="py-4 px-6 w-20 text-center">Ảnh</th>
                <th className="py-4 px-6 w-1/4">Thông tin sản phẩm</th>
                <th className="py-4 px-6">Danh mục</th>
                <th className="py-4 px-6 text-right">Giá bán</th>
                <th className="py-4 px-6 text-center">Tồn kho</th>
                <th className="py-4 px-6 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((p) => (
                <tr
                  key={p._id}
                  className="hover:bg-gray-50/80 transition-colors group"
                >
                  <td className="py-4 px-6">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden relative">
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon size={20} className="text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-gray-800 text-base mb-0.5">
                      {p.product_name}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-1 max-w-[250px]">
                      {p.description}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      {p.category_id?.name || "Chưa phân loại"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="font-bold text-gray-800">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(p.price)}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {p.quantity > 0 ? (
                      <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded-md text-xs">
                        {p.quantity} sẵn hàng
                      </span>
                    ) : (
                      <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded-md text-xs">
                        Hết hàng
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-2 bg-white border border-gray-200 text-blue-600 rounded-lg hover:bg-blue-50 hover:border-blue-200 shadow-sm transition-all"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-2 bg-white border border-gray-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-200 shadow-sm transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10 backdrop-blur-md">
              <h3 className="text-xl font-bold text-gray-800">
                {editingId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Tên sản phẩm *
                  </label>
                  <input
                    required
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Danh mục *
                  </label>
                  <select
                    required
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white transition-all"
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Giá (VNĐ) *
                    </label>
                    <input
                      required
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Kho *
                    </label>
                    <input
                      required
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* UPLOAD ẢNH */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Hình ảnh sản phẩm
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageFileChange}
                    className="hidden"
                  />

                  {imagePreview ? (
                    <div className="relative w-full h-40 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current.click()}
                          className="bg-white text-blue-600 px-3 py-1 rounded text-xs font-medium"
                        >
                          Thay đổi
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="bg-white text-red-600 px-3 py-1 rounded text-xs font-medium"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current.click()}
                      className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-colors"
                    >
                      <UploadCloud className="text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Tải ảnh lên</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Mô tả chi tiết
                  </label>
                  <textarea
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                  ></textarea>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Size
                    </label>
                    <input
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Màu sắc
                    </label>
                    <input
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Chất liệu
                    </label>
                    <input
                      name="material"
                      value={formData.material}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Xuất xứ
                    </label>
                    <input
                      name="origin"
                      value={formData.origin}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                >
                  Hủy bỏ
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

export default ProductManager;
