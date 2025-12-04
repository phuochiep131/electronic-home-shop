import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Package,
  Filter,
  Image as ImageIcon,
  Save,
  X,
  Loader2,
  RefreshCcw,
} from "lucide-react";

// CẤU HÌNH API
const API_BASE = "http://localhost:5000/api";

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // State chứa danh sách danh mục
  const [loading, setLoading] = useState(false);

  // UI States
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const initialFormState = {
    product_name: "",
    price: 0,
    quantity: 0,
    discount: 0,
    category_id: "", // Trường quan trọng để binding với select box
    image_url: "",
    description: "",
    size: "",
    color: "",
    material: "",
    warranty: "",
    origin: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- 1. FETCH DATA ---

  // Lấy danh sách Categories để đổ vào Dropdown khi thêm/sửa
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      } else {
        console.error("Không thể tải danh mục");
      }
    } catch (error) {
      console.error("Lỗi kết nối danh mục:", error);
    }
  };

  // Lấy danh sách Products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        console.error("Không thể tải sản phẩm");
      }
    } catch (error) {
      console.error("Lỗi kết nối sản phẩm:", error);
      alert("Không thể kết nối tới Server!");
    } finally {
      setLoading(false);
    }
  };

  // Chạy khi component mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // --- 2. XỬ LÝ FORM (HANDLERS) ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  // --- LOGIC QUAN TRỌNG: CHUẨN BỊ DỮ LIỆU ĐỂ SỬA ---
  const openEditModal = (product) => {
    setEditingId(product._id);

    // XỬ LÝ CATEGORY ID:
    // Backend có thể trả về 1 object (nếu populate) hoặc 1 string ID.
    // Ta cần đảm bảo lấy được String ID để gán vào value của thẻ <select>
    let safeCategoryId = "";

    if (product.category_id) {
      if (typeof product.category_id === "object") {
        // Trường hợp populate: { _id: "abc", name: "xyz" }
        safeCategoryId = product.category_id._id;
      } else {
        // Trường hợp string: "abc"
        safeCategoryId = product.category_id;
      }
    }

    setFormData({
      product_name: product.product_name || "",
      price: product.price || 0,
      quantity: product.quantity || 0,
      discount: product.discount || 0,
      category_id: safeCategoryId, // Gán ID đã xử lý vào đây
      image_url: product.image_url || "",
      description: product.description || "",
      size: product.size || "",
      color: product.color || "",
      material: product.material || "",
      warranty: product.warranty || "",
      origin: product.origin || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API_BASE}/products/${editingId}`
        : `${API_BASE}/products`;

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Lỗi khi lưu dữ liệu");

      alert(editingId ? "Cập nhật thành công!" : "Thêm mới thành công!");

      setIsModalOpen(false);
      fetchProducts(); // Tải lại danh sách sau khi lưu
    } catch (error) {
      alert("Lỗi: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        const result = await res.json();
        alert("Xóa thất bại: " + result.error);
      }
    } catch (error) {
      alert("Lỗi kết nối khi xóa");
    }
  };

  // --- HELPERS ---

  // Helper: Hiển thị tên Category trong bảng (Table)
  const getCategoryName = (catData) => {
    if (!catData)
      return <span className="text-gray-400 italic">Chưa phân loại</span>;

    // Nếu backend trả về object (đã populate) -> lấy .name
    if (typeof catData === "object" && catData.name) return catData.name;

    // Nếu backend trả về string ID -> tìm trong state categories
    const foundCat = categories.find((c) => c._id === catData);
    return foundCat ? foundCat.name : "---";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Filter Client-side
  const filteredProducts = products.filter((p) => {
    const pName = p.product_name || "";
    const matchesSearch = pName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Xử lý lấy ID để so sánh với bộ lọc
    let pCatId = "";
    if (p.category_id) {
      pCatId =
        typeof p.category_id === "object" ? p.category_id._id : p.category_id;
    }

    const matchesCategory =
      categoryFilter === "All" || pCatId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="text-blue-600" /> Quản lý Sản phẩm
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {loading
              ? "Đang tải dữ liệu..."
              : `Tổng số: ${filteredProducts.length} sản phẩm`}
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-sm transition-all"
        >
          <Plus size={18} /> Thêm sản phẩm
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row gap-4 border border-gray-100">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Tìm tên sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[200px]"
          >
            <option value="All">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              fetchProducts();
              fetchCategories();
            }}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            title="Tải lại dữ liệu"
          >
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 overflow-x-auto min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p>Đang tải dữ liệu từ Server...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold">
              <tr>
                <th className="py-4 px-6 w-20">Ảnh</th>
                <th className="py-4 px-6">Tên sản phẩm</th>
                <th className="py-4 px-6">Danh mục</th>
                <th className="py-4 px-6">Giá & Kho</th>
                <th className="py-4 px-6">Chi tiết</th>
                <th className="py-4 px-6 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                  >
                    {/* Ảnh */}
                    <td className="py-4 px-6">
                      <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.product_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "";
                            }}
                          />
                        ) : (
                          <ImageIcon size={24} className="text-gray-400" />
                        )}
                      </div>
                    </td>

                    {/* Tên & Mô tả */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-800 text-base mb-1">
                        {product.product_name}
                      </div>
                      <div
                        className="text-xs text-gray-500 line-clamp-2 max-w-[250px]"
                        title={product.description}
                      >
                        {product.description || "Chưa có mô tả"}
                      </div>
                    </td>

                    {/* Danh mục (Gọi helper function) */}
                    <td className="py-4 px-6">
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-100 whitespace-nowrap">
                        {getCategoryName(product.category_id)}
                      </span>
                    </td>

                    {/* Giá & Kho */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-gray-800">
                          {formatCurrency(product.price)}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-xs text-red-500 bg-red-50 px-1 rounded w-fit">
                            Giảm {product.discount}%
                          </span>
                        )}
                        <div className="mt-1">
                          {product.quantity > 0 ? (
                            <span className="text-xs text-green-600 font-medium">
                              Sẵn: {product.quantity}
                            </span>
                          ) : (
                            <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded">
                              Hết hàng
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Thông tin thêm */}
                    <td className="py-4 px-6">
                      <div className="text-xs space-y-1 text-gray-500">
                        {product.origin && (
                          <div>
                            <span className="font-medium text-gray-700">
                              Xuất xứ:
                            </span>{" "}
                            {product.origin}
                          </div>
                        )}
                        {(product.size || product.color) && (
                          <div>
                            <span className="font-medium text-gray-700">
                              Loại:
                            </span>{" "}
                            {product.size} - {product.color}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Hành động */}
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 bg-white border border-gray-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-all shadow-sm"
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 bg-white border border-gray-200 text-red-600 rounded-lg hover:bg-red-50 transition-all shadow-sm"
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
                  <td colSpan="6" className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Package size={48} className="text-gray-300 mb-2" />
                      <p>Không tìm thấy sản phẩm nào.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* --- MODAL (FORM) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-800">
                {editingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cột Trái: Thông tin chính */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700 border-b pb-2">
                    Thông tin cơ bản
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      name="product_name"
                      value={formData.product_name}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="VD: iPhone 15"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giá (VNĐ) <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giảm giá (%)
                      </label>
                      <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>

                  {/* DROP DOWN CATEGORY: Đây là phần bạn quan tâm nhất */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {categories.length === 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        * Chưa tải được danh mục hoặc chưa có danh mục nào.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số lượng kho <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      min="0"
                    />
                  </div>
                </div>

                {/* Cột Phải: Thông tin phụ */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700 border-b pb-2">
                    Hình ảnh & Chi tiết
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Link hình ảnh
                    </label>
                    <div className="flex gap-2">
                      <input
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="https://..."
                      />
                      {formData.image_url && (
                        <div className="w-10 h-10 rounded border overflow-hidden shrink-0">
                          <img
                            src={formData.image_url}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Size
                      </label>
                      <input
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Màu sắc
                      </label>
                      <input
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Chất liệu
                      </label>
                      <input
                        name="material"
                        value={formData.material}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Xuất xứ
                      </label>
                      <input
                        name="origin"
                        value={formData.origin}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bảo hành
                    </label>
                    <input
                      name="warranty"
                      value={formData.warranty}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Mô tả (Full width) */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả sản phẩm
                    </label>
                    <textarea
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-blue-200"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Save size={18} />
                  )}
                  {editingId ? "Lưu thay đổi" : "Tạo sản phẩm"}
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
