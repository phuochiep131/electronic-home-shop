import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Zap, // Icon Flash Sale
  Save,
  X,
  Loader2,
  RefreshCcw,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";

// --- CẤU HÌNH API ---
const FLASHSALE_API_URL = "http://localhost:5000/api/flash-sale"; // Route backend đã tạo
const PRODUCT_API_URL = "http://localhost:5000/api/products";

const FlashSaleManager = () => {
  const [flashSales, setFlashSales] = useState([]);
  const [products, setProducts] = useState([]); // Để dropdown chọn sản phẩm
  const [loading, setLoading] = useState(false);

  // UI States
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const initialFormState = {
    product_id: "",
    discount_percent: 0,
    quantity: 10,
    start_date: "",
    end_date: "",
    status: true,
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- HELPER: Format Date cho Input (YYYY-MM-DDThh:mm) ---
  const formatDateTimeLocal = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const pad = (num) => String(num).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  // --- 1. FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      // Lấy danh sách Flash Sale VÀ Danh sách sản phẩm (để chọn)
      const [resFlashSales, resProducts] = await Promise.all([
        fetch(FLASHSALE_API_URL), // Cần đảm bảo route này trả về mảng populate product_id
        fetch(PRODUCT_API_URL),
      ]);

      const dataFlashSales = await resFlashSales.json();
      const dataProducts = await resProducts.json();

      if (resFlashSales.ok)
        setFlashSales(Array.isArray(dataFlashSales) ? dataFlashSales : []);
      if (resProducts.ok)
        setProducts(Array.isArray(dataProducts) ? dataProducts : []);
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

  const openEditModal = (sale) => {
    setEditingId(sale._id);
    setFormData({
      product_id: sale.product_id._id, // Lấy ID từ object đã populate
      discount_percent: sale.discount_percent,
      quantity: sale.quantity,
      start_date: formatDateTimeLocal(sale.start_date),
      end_date: formatDateTimeLocal(sale.end_date),
      status: sale.status,
    });
    setIsModalOpen(true);
  };

  // --- 3. SAVE ---
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate cơ bản
    if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      alert("Thời gian kết thúc phải lớn hơn thời gian bắt đầu!");
      setIsSubmitting(false);
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${FLASHSALE_API_URL}/${editingId}`
        : FLASHSALE_API_URL;

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Có lỗi xảy ra");

      alert(editingId ? "Cập nhật Flash Sale thành công!" : "Tạo Flash Sale thành công!");
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert("Lỗi: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 4. DELETE ---
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chiến dịch này?")) {
      try {
        const res = await fetch(`${FLASHSALE_API_URL}/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setFlashSales((prev) => prev.filter((item) => item._id !== id));
        } else {
          alert("Xóa thất bại");
        }
      } catch (error) {
        alert("Lỗi kết nối");
      }
    }
  };

  // Tìm sản phẩm đang chọn để hiển thị preview giá/ảnh trong modal
  const selectedProduct = products.find((p) => p._id === formData.product_id);

  // Filter tìm kiếm
  const filteredSales = flashSales.filter((s) => {
    const productName = s.product_id?.product_name || "";
    return productName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="relative min-h-screen pb-10 font-sans text-gray-800">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-orange-600">
            <Zap className="fill-current" /> Quản lý Flash Sale
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {loading ? "Đang tải..." : `Đang chạy: ${flashSales.length} chiến dịch`}
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-orange-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-orange-700 shadow-lg shadow-orange-500/30 transition-all active:scale-95"
        >
          <Plus size={18} /> Tạo chiến dịch mới
        </button>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 border border-gray-100 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
          />
        </div>
        <button
          onClick={fetchData}
          className="p-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors"
        >
          <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-orange-50 text-orange-800 uppercase text-xs font-bold">
              <tr>
                <th className="py-4 px-6">Sản phẩm</th>
                <th className="py-4 px-6 text-center">Giảm giá</th>
                <th className="py-4 px-6 text-center">Tiến độ bán</th>
                <th className="py-4 px-6">Thời gian</th>
                <th className="py-4 px-6 text-center">Trạng thái</th>
                <th className="py-4 px-6 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredSales.map((sale) => {
                const product = sale.product_id;
                // Phòng trường hợp sản phẩm gốc bị xóa
                if (!product) return null; 
                const salePrice = product.price * (1 - sale.discount_percent / 100);
                const percentSold = Math.round((sale.sold / sale.quantity) * 100);

                return (
                  <tr key={sale._id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image_url || "https://placehold.co/50"}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                        />
                        <div>
                          <div className="font-semibold text-gray-800 line-clamp-1 max-w-[200px]">
                            {product.product_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Gốc: {new Intl.NumberFormat("vi-VN").format(product.price)}đ
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded border border-red-100">
                        -{sale.discount_percent}%
                      </span>
                      <div className="text-xs font-bold text-orange-600 mt-1">
                        {new Intl.NumberFormat("vi-VN").format(salePrice)}đ
                      </div>
                    </td>
                    <td className="py-4 px-6 min-w-[150px]">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Đã bán: {sale.sold}</span>
                        <span>Tổng: {sale.quantity}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-orange-500 h-2.5 rounded-full"
                          style={{ width: `${percentSold}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                         <span className="w-10 text-xs font-bold">Start:</span> 
                         {new Date(sale.start_date).toLocaleString('vi-VN')}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                         <span className="w-10 text-xs font-bold">End:</span>
                         {new Date(sale.end_date).toLocaleString('vi-VN')}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {sale.status ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                          <CheckCircle size={12} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          <XCircle size={12} /> Paused
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                       <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => openEditModal(sale)} className="p-2 bg-white border border-gray-200 text-blue-600 rounded-lg hover:bg-blue-50 shadow-sm">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(sale._id)} className="p-2 bg-white border border-gray-200 text-red-600 rounded-lg hover:bg-red-50 shadow-sm">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL FORM --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-y-auto border border-gray-100 max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800">
                {editingId ? "Cập nhật Flash Sale" : "Tạo chiến dịch mới"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 rounded-full">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Chọn sản phẩm */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sản phẩm áp dụng</label>
                <select
                  required
                  name="product_id"
                  value={formData.product_id}
                  onChange={handleInputChange}
                  disabled={!!editingId} // Không cho đổi sản phẩm khi đang edit
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-orange-500/20 outline-none bg-white"
                >
                  <option value="">-- Chọn sản phẩm --</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.product_name} - Giá gốc: {p.price.toLocaleString()}đ
                    </option>
                  ))}
                </select>
              </div>

              {/* Preview thông tin sản phẩm đã chọn */}
              {selectedProduct && (
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-center gap-4">
                    <img src={selectedProduct.image_url} alt="" className="w-16 h-16 object-cover rounded-md bg-white"/>
                    <div>
                        <p className="font-bold text-gray-800">{selectedProduct.product_name}</p>
                        <p className="text-sm text-gray-600">Kho hiện tại: {selectedProduct.quantity}</p>
                        {formData.discount_percent > 0 && (
                            <p className="text-sm font-bold text-orange-600 mt-1">
                                Giá sau giảm: {new Intl.NumberFormat("vi-VN").format(selectedProduct.price * (1 - formData.discount_percent/100))}đ
                            </p>
                        )}
                    </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phần trăm giảm (%)</label>
                  <input
                    required
                    type="number"
                    min="1"
                    max="99"
                    name="discount_percent"
                    value={formData.discount_percent}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-orange-500/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Số lượng Sale</label>
                  <input
                    required
                    type="number"
                    min="1"
                    max={selectedProduct ? selectedProduct.quantity : 9999}
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-orange-500/20 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Thời gian bắt đầu</label>
                  <div className="relative">
                    <input
                      required
                      type="datetime-local"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-orange-500/20 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Thời gian kết thúc</label>
                  <div className="relative">
                     <input
                      required
                      type="datetime-local"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-orange-500/20 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="status"
                  name="status"
                  checked={formData.status}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 border-gray-300"
                />
                <label htmlFor="status" className="text-sm font-semibold text-gray-700 select-none cursor-pointer">
                  Kích hoạt chiến dịch ngay
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
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
                  className="px-6 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 font-medium flex items-center gap-2 shadow-lg shadow-orange-500/30 transition-all active:scale-95 disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  {editingId ? "Lưu thay đổi" : "Xác nhận tạo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashSaleManager;