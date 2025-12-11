import React, { useState, useEffect } from "react";
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
} from "lucide-react";

// URL API
const API_URL = "http://localhost:5000/api/products";
const CATEGORY_API_URL = "http://localhost:5000/api/categories";

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // UI States
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const initialFormState = {
    product_name: "",
    price: "",
    quantity: "",
    category_id: "",
    description: "",
    image_url: "",
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
      // Gọi song song 2 API
      const [resProducts, resCategories] = await Promise.all([
        fetch(API_URL, { credentials: "include" }), // Thêm credentials để an toàn
        fetch(CATEGORY_API_URL, { credentials: "include" }),
      ]);

      const dataProducts = await resProducts.json();
      const dataCategories = await resCategories.json();

      if (resProducts.ok) {
        setProducts(Array.isArray(dataProducts) ? dataProducts : []);
      }
      if (resCategories.ok) {
        setCategories(Array.isArray(dataCategories) ? dataCategories : []);
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product._id);
    setFormData({
      product_name: product.product_name || "",
      price: product.price || "",
      quantity: product.quantity || "",
      // Kiểm tra kỹ: nếu category_id là object (đã populate) thì lấy ._id, nếu là string thì lấy luôn
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
    setIsModalOpen(true);
  };

  // --- 3. SAVE ---
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.category_id) {
      alert("Vui lòng chọn danh mục!");
      setIsSubmitting(false);
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      const res = await fetch(url, {
        method: method,
        credentials: "include", // Quan trọng: Gửi Cookie Auth
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Có lỗi xảy ra");

      alert(editingId ? "Cập nhật thành công!" : "Thêm mới thành công!");
      setIsModalOpen(false);
      fetchData(); // Load lại để cập nhật bảng
    } catch (error) {
      alert("Lỗi: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 4. DELETE ---
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        const res = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
          credentials: "include", // Quan trọng: Gửi Cookie Auth
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

  // Filter
  const filteredProducts = products.filter((p) =>
    (p.product_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen pb-10 font-sans text-gray-800">
      {/* Header Section */}
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

      {/* Tools Bar */}
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

        {/* Nút Refresh */}
        <button
          onClick={fetchData}
          className="p-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors"
          title="Tải lại dữ liệu"
        >
          <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                <th className="py-4 px-6 w-20 text-center">Ảnh</th>
                <th className="py-4 px-6 w-1/4">Thông tin sản phẩm</th>
                <th className="py-4 px-6">Danh mục</th>
                <th className="py-4 px-6 text-right">Giá bán</th>
                <th className="py-4 px-6 text-center">Tồn kho</th>
                <th className="py-4 px-6 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2
                        className="animate-spin text-blue-500"
                        size={32}
                      />
                      <span className="text-sm font-medium">
                        Đang tải dữ liệu...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
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
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = ""; // Fallback nếu ảnh lỗi
                            }}
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
                      <div
                        className="text-xs text-gray-500 line-clamp-1 max-w-[250px]"
                        title={p.description}
                      >
                        {p.description || "Không có mô tả"}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {/* Sử dụng optional chaining để tránh lỗi crash nếu chưa populate */}
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
                          title="Sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-2 bg-white border border-gray-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-200 shadow-sm transition-all"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Package size={48} className="text-gray-300 mb-3" />
                      <p className="text-lg font-medium">
                        Chưa có sản phẩm nào
                      </p>
                      <p className="text-sm">Bấm "Thêm sản phẩm" để bắt đầu</p>
                    </div>
                  </td>
                </tr>
              )}
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
              {/* Cột Trái */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="VD: Áo Thun Polo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Danh mục <span className="text-red-500">*</span>
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
                      Giá (VNĐ) <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Kho <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Link Ảnh
                  </label>
                  <input
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Cột Phải */}
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
                    placeholder="Mô tả sản phẩm..."
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
                      placeholder="S, M, L..."
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
                      placeholder="Đen, Trắng..."
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

              {/* Footer Actions */}
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
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Save size={18} />
                  )}
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
