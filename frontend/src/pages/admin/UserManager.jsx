import React, { useState, useEffect } from "react";
import { 
  Plus, Edit, Trash2, Search, User, Mail, Phone, 
  Calendar, MapPin, ShieldCheck, X, Save, Loader2, AlertCircle
} from "lucide-react";

// Cấu hình đường dẫn API Backend của bạn
// Khi deploy thì đổi thành domain thật, ví dụ: 'https://api.mywebsite.com/api/users'
const API_URL = "http://localhost:5000/api/user"; 

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI States
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const initialFormState = {
    username: "",
    fullname: "",
    email: "",
    role: "Customer",
    phone_number: "",
    gender: "Nam",
    address: "",
    birth_date: "",
    avatar: ""
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- 1. FETCH DATA (GET) ---
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Dùng fetch hoặc axios.get(API_URL)
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Không thể kết nối đến Server");
      
      const data = await response.json();
      console.log(data);
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error("Lỗi fetch data:", err);
      // MOCK DATA: Để bạn xem trước giao diện khi chưa bật Backend
      // Xóa dòng này khi chạy thật
      setUsers(mockUsers); 
      setError("Không thể kết nối API (Đang hiển thị dữ liệu mẫu). Hãy chắc chắn Backend Node.js đang chạy.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- 2. HANDLERS ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingId(user._id);
    setFormData({
      username: user.username || "",
      fullname: user.fullname || "",
      email: user.email || "",
      role: user.role || "Customer",
      phone_number: user.phone_number || "",
      gender: user.gender || "Nam",
      address: user.address || "",
      birth_date: user.birth_date ? user.birth_date.split('T')[0] : "",
      avatar: user.avatar || ""
    });
    setIsModalOpen(true);
  };

  // --- 3. SUBMIT (POST / PUT) ---
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      
      const payload = { ...formData };
      if (!editingId) {
          // Chỉ thêm password mặc định khi tạo mới
          payload.password = "User@123"; 
      }

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Lỗi khi lưu dữ liệu");

      // Reload lại danh sách sau khi lưu thành công
      await fetchUsers();
      setIsModalOpen(false);
      alert(editingId ? "Cập nhật thành công!" : "Thêm mới thành công!");

    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 4. DELETE (DELETE) ---
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Lỗi khi xóa");
      
      // Cập nhật lại state UI ngay lập tức để cảm giác nhanh hơn
      setUsers(prev => prev.filter(u => u._id !== id));
      
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại: " + err.message);
    }
  };

  // --- UTILS ---
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN");
    } catch { return ""; }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      (user.fullname?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (user.phone_number || "").includes(searchTerm);
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="relative min-h-screen pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h2>
          <p className="text-gray-500 text-sm mt-1">
            Tổng số: {filteredUsers.length} tài khoản
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-sm transition-all"
        >
          <Plus size={18} /> Thêm mới
        </button>
      </div>

      {/* Error Banner if API fails */}
      {error && (
        <div className="mb-6 bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row gap-4 border border-gray-100">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên, email, sđt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <select 
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="All">Tất cả vai trò</option>
          <option value="Admin">Admin</option>
          <option value="Customer">Customer</option>
        </select>
      </div>

      {/* Table Area */}
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
                <th className="py-4 px-6">Người dùng</th>
                <th className="py-4 px-6">Liên hệ</th>
                <th className="py-4 px-6">Vai trò</th>
                <th className="py-4 px-6">Thông tin cá nhân</th>
                <th className="py-4 px-6">Ngày tạo</th>
                <th className="py-4 px-6 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shrink-0 border border-gray-300">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.fullname} className="w-full h-full object-cover" 
                                 onError={(e) => {e.target.onerror = null; e.target.src = ''}} />
                          ) : (
                            <User size={20} className="text-gray-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{user.fullname || "Chưa đặt tên"}</p>
                          <p className="text-xs text-gray-500">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Mail size={14} className="text-gray-400" /> {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                          <Phone size={14} className="text-gray-400" /> {user.phone_number || "---"}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${
                        user.role === 'Admin' 
                        ? 'bg-purple-100 text-purple-700 border-purple-200' 
                        : 'bg-green-100 text-green-700 border-green-200'
                      }`}>
                        {user.role === 'Admin' ? <ShieldCheck size={12} /> : <User size={12} />}
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center gap-2">
                           <span className={`w-2 h-2 rounded-full ${user.gender === 'Nam' ? 'bg-blue-400' : 'bg-pink-400'}`}></span>
                           {user.gender} • {formatDate(user.birth_date)}
                        </div>
                        <div className="flex items-center gap-1 text-gray-400 truncate max-w-[150px]" title={user.address}>
                          <MapPin size={12} /> {user.address || "Chưa có địa chỉ"}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar size={14} className="text-gray-400" />
                        {formatDate(user.created_at)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(user)} className="p-2 bg-white border border-gray-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-all shadow-sm">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(user._id)} className="p-2 bg-white border border-gray-200 text-red-600 rounded-lg hover:bg-red-50 transition-all shadow-sm">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500">
                    <p>Chưa có dữ liệu.</p>
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
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-800">
                {editingId ? "Cập nhật User" : "Thêm mới User"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Inputs giống như trước, mapping đúng field của Mongoose */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username <span className="text-red-500">*</span></label>
                  <input required name="username" value={formData.username} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                  <input name="fullname" value={formData.fullname} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input name="phone_number" value={formData.phone_number} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                  <select name="role" value={formData.role} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="Customer">Customer</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                  <input type="date" name="birth_date" value={formData.birth_date} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link Avatar</label>
                  <input name="avatar" value={formData.avatar} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                  <input name="address" value={formData.address} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Hủy bỏ</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  {isSubmitting ? "Đang lưu..." : "Lưu thông tin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;