import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Facebook,
  Chrome,
  Loader2,
  AlertCircle,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useAuth();

  // Lấy trang trước đó để redirect sau khi login, mặc định là trang chủ
  const from = location.state?.from?.pathname || "/";

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Xóa lỗi khi người dùng bắt đầu nhập lại
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Gọi API Login
      const response = await axios.post(
        `http://localhost:5000/api/auth/login`,
        {
          // QUAN TRỌNG: Hãy kiểm tra Backend authController.js
          // Nếu backend viết: const { email, password } = req.body
          // Thì ở đây phải sửa 'username' thành 'email'
          username: formData.username,
          password: formData.password,
        },
        { withCredentials: true } // Bắt buộc để nhận Cookie
      );

      // Nếu thành công (Axios tự ném lỗi nếu status != 2xx, nên không cần check response.data.user ở đây)
      const userData = response.data.user || response.data;

      console.log("Login Success:", userData);
      dispatch({ type: "AUTH_SUCCESS", payload: userData });

      // Chuyển hướng ngay lập tức
      // Dùng { replace: true } để người dùng không back lại trang login được
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Lỗi Login:", err);

      // Lấy thông báo lỗi chuẩn từ Backend trả về
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";

      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* --- LEFT SIDE: IMAGE (Giữ nguyên) --- */}
        <div className="hidden md:flex md:w-1/2 bg-blue-600 relative flex-col justify-between p-12 text-white overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20">
            <img
              src="https://placehold.co/800x1200/1e40af/ffffff?text=Smart+Home"
              alt="BG"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10">
            <Link
              to="/"
              className="text-3xl font-bold flex items-center gap-2 mb-6"
            >
              Electro<span className="text-orange-400">Shop</span>
            </Link>
            <h2 className="text-3xl font-bold mb-4">
              Mua sắm thiết bị điện gia dụng
            </h2>
            <p className="text-blue-100 text-lg">
              Trải nghiệm mua sắm thông minh.
            </p>
          </div>
        </div>

        {/* --- RIGHT SIDE: FORM --- */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="flex justify-end mb-8">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1"
            >
              Về trang chủ <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Đăng nhập
            </h2>
            <p className="text-sm text-gray-500">Chào mừng trở lại!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200 flex items-center gap-2 animate-pulse">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            {/* USERNAME INPUT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Nhập username"
                  className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* PASSWORD INPUT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="pl-10 pr-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 cursor-pointer"
                >
                  Ghi nhớ
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Đăng nhập"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Chưa có tài khoản? </span>
            <Link
              to="/register"
              className="font-bold text-blue-600 hover:underline"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
