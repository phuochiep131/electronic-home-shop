import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Save,
  X,
  Edit2,
  Package,
  KeyRound,
  LogOut,
  ChevronRight,
  Loader2,
  UploadCloud,
} from "lucide-react";
import defaultAvatar from "../assets/react.svg";

// --- CẤU HÌNH ---
const API_UPDATE_URL = "http://localhost:5000/api/user/update"; // Route cho user tự sửa
const CLOUD_NAME = "detransaw";
const UPLOAD_PRESET = "web_upload";

const Profile = () => {
  const { state, dispatch } = useAuth();
  const { currentUser } = state;

  // --- STATE ---
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Avatar upload states
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  // Form data
  const [formData, setFormData] = useState({
    fullname: "",
    phone_number: "",
    address: "",
    gender: "Nam",
    birth_date: "",
    avatar: "",
  });

  // --- EFFECT: Sync Data ---
  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullname: currentUser.fullname || "",
        phone_number: currentUser.phone_number || "",
        address: currentUser.address || "",
        gender: currentUser.gender || "Nam",
        birth_date: currentUser.birth_date
          ? currentUser.birth_date.split("T")[0]
          : "",
        avatar: currentUser.avatar || "",
      });
      setImagePreview(currentUser.avatar || "");
    }
  }, [currentUser]);

  // --- HANDLERS ẢNH ---
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

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
      return data.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  // --- HANDLERS FORM ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let finalAvatar = formData.avatar;

      // 1. Upload ảnh nếu có chọn mới
      if (selectedImageFile) {
        finalAvatar = await uploadToCloudinary(selectedImageFile);
      }

      // 2. Chuẩn bị payload
      const payload = {
        ...formData,
        avatar: finalAvatar,
      };

      // 3. Gọi API Update
      const response = await axios.put(API_UPDATE_URL, payload, {
        withCredentials: true,
      });

      // 4. Update Context
      if (response.data && response.data.user) {
        dispatch({ type: "AUTH_SUCCESS", payload: response.data.user });
        alert("Cập nhật thông tin thành công!");
        setIsEditing(false);
        // Reset file select
        setSelectedImageFile(null);
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser)
    return (
      <div className="p-8 text-center">
        <Loader2 className="animate-spin inline mr-2" /> Đang tải...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-sans">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600">
            Trang chủ
          </Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-gray-900 font-medium">Hồ sơ của tôi</span>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* --- LEFT SIDEBAR --- */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-100 flex flex-col items-center text-center">
                {/* Avatar Display / Upload Trigger */}
                <div
                  className="relative w-24 h-24 mb-4 group cursor-pointer"
                  onClick={() => isEditing && fileInputRef.current.click()}
                >
                  <img
                    src={imagePreview || defaultAvatar}
                    alt="Avatar"
                    className={`w-full h-full rounded-full object-cover border-4 ${
                      isEditing ? "border-blue-200" : "border-gray-100"
                    }`}
                  />
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="text-white" size={24} />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </div>

                <h3 className="font-bold text-gray-800 text-lg">
                  {currentUser.fullname}
                </h3>
                <p className="text-sm text-gray-500">{currentUser.email}</p>
              </div>

              <nav className="p-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg font-medium transition-colors"
                >
                  <User size={20} /> Hồ sơ cá nhân
                </Link>
                <Link
                  to="/my-orders"
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                >
                  <Package size={20} /> Đơn mua
                </Link>
                {/* ... các link khác ... */}
              </nav>
            </div>
          </div>

          {/* --- RIGHT CONTENT --- */}
          <div className="w-full md:w-3/4">
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Hồ sơ của tôi
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Quản lý thông tin hồ sơ để bảo mật tài khoản
                  </p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                  >
                    <Edit2 size={16} /> Chỉnh sửa
                  </button>
                )}
              </div>

              <form onSubmit={handleUpdateProfile}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Username (Read only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên đăng nhập
                    </label>
                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        value={currentUser.username}
                        disabled
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed outline-none"
                      />
                    </div>
                  </div>

                  {/* Email (Read only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        value={currentUser.email}
                        disabled
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed outline-none"
                      />
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isEditing
                          ? "bg-gray-50 border-gray-200"
                          : "bg-white border-gray-300"
                      }`}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <Phone
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          !isEditing
                            ? "bg-gray-50 border-gray-200"
                            : "bg-white border-gray-300"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Birth Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày sinh
                    </label>
                    <div className="relative">
                      <Calendar
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="date"
                        name="birth_date"
                        value={formData.birth_date}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          !isEditing
                            ? "bg-gray-50 border-gray-200"
                            : "bg-white border-gray-300"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giới tính
                    </label>
                    <div className="flex gap-6 mt-2">
                      {["Nam", "Nữ", "Khác"].map((option) => (
                        <label
                          key={option}
                          className="flex items-center cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="gender"
                            value={option}
                            checked={formData.gender === option}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ
                    </label>
                    <div className="relative">
                      <MapPin
                        size={18}
                        className="absolute left-3 top-3 text-gray-400"
                      />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        rows="3"
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          !isEditing
                            ? "bg-gray-50 border-gray-200"
                            : "bg-white border-gray-300"
                        }`}
                      ></textarea>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-8 flex items-center justify-end gap-3 animate-in fade-in slide-in-from-bottom-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        // Reset data về ban đầu
                        setFormData({
                          fullname: currentUser.fullname || "",
                          phone_number: currentUser.phone_number || "",
                          address: currentUser.address || "",
                          gender: currentUser.gender || "Nam",
                          birth_date: currentUser.birth_date
                            ? currentUser.birth_date.split("T")[0]
                            : "",
                          avatar: currentUser.avatar || "",
                        });
                        setImagePreview(currentUser.avatar || "");
                        setSelectedImageFile(null);
                      }}
                      className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      <X size={18} /> Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70"
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <Save size={18} />
                      )}
                      {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
