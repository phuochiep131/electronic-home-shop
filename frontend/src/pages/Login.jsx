import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import {
    User, // Đổi từ Mail sang User
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Facebook,
    CheckCircle,
    Chrome
} from 'lucide-react';

const Login = () => {
    // --- HOOKS ---
    const navigate = useNavigate();
    const location = useLocation();
    const { dispatch } = useAuth();
    
    const stateData = location.state;

    // --- STATE QUẢN LÝ ---
    const [formData, setFormData] = useState({
        // Sửa thành username để khớp với userModel
        username: stateData?.username || '', 
        password: stateData?.password || '',
        rememberMe: false
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // --- HANDLERS ---
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (error) setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Gọi API
        axios.post(`http://localhost:5000/api/auth/login`, {
            username: formData.username, // Gửi đúng trường username
            password: formData.password
        }, {
            withCredentials: true
        })
        .then(response => {
            if (response.data && response.data.user) {
                dispatch({ type: 'AUTH_SUCCESS', payload: response.data.user });
                
                setTimeout(() => {
                    setIsLoading(false);
                    if(stateData?.action === "redirect"){
                        navigate(stateData.url);
                    } else {
                        navigate("/");
                    }
                }, 500);
            } else {
                setError('Phản hồi từ máy chủ không hợp lệ.');
                setIsLoading(false);
            }
        })
        .catch(err => {
            console.error('Lỗi chi tiết:', err);
            // Xử lý thông báo lỗi chi tiết hơn
            const msg = err.response?.data?.message || err.response?.data?.error || 'Tên đăng nhập hoặc mật khẩu không chính xác.';
            setError(msg);
            setIsLoading(false);
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

                {/* --- LEFT SIDE: IMAGE --- */}
                <div className="hidden md:flex md:w-1/2 bg-blue-600 relative flex-col justify-between p-12 text-white overflow-hidden">
                    <div className="absolute inset-0 z-0 opacity-20">
                        <img
                            src="https://placehold.co/800x1200/1e40af/ffffff?text=Smart+Home+Appliance"
                            alt="Background"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="relative z-10">
                        <Link to="/" className="text-3xl font-bold flex items-center gap-2 mb-6">
                            Electro<span className="text-orange-400">Shop</span>
                        </Link>
                        <h2 className="text-3xl font-bold mb-4">Mua sắm thiết bị điện gia dụng</h2>
                        <p className="text-blue-100 text-lg">Trải nghiệm mua sắm thông minh, bảo hành tận tâm.</p>
                    </div>
                    {/* Decorative circles... */}
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                </div>

                {/* --- RIGHT SIDE: FORM --- */}
                <div className="w-full md:w-1/2 p-8 md:p-12">
                    <div className="flex justify-end mb-8">
                        <Link to="/" className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1">
                            Về trang chủ <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="mb-8 text-center md:text-left">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Đăng nhập</h2>
                        <p className="text-sm text-gray-500">Chào mừng trở lại! Vui lòng nhập thông tin.</p>
                    </div>

                    {/* Social Buttons */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                            <Chrome size={20} className="text-red-500" /> Google
                        </button>
                        <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                            <Facebook size={20} className="text-blue-600" /> Facebook
                        </button>
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập bằng tài khoản</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200 flex items-center gap-2">
                                <span className="font-bold">!</span> {error}
                            </div>
                        )}

                        {/* INPUT USERNAME */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    {/* Dùng icon User thay vì Mail */}
                                    <User size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="username" // Name map với state
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    placeholder="Nhập tên đăng nhập"
                                    className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* INPUT PASSWORD */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
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
                                    className="pl-10 pr-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
                                    name="rememberMe"
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                                    Ghi nhớ đăng nhập
                                </label>
                            </div>
                            <div className="text-sm">
                                <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                                    Quên mật khẩu?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-500">Bạn chưa có tài khoản? </span>
                        <Link to="/register" className="font-bold text-blue-600 hover:text-blue-500">
                            Đăng ký ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;