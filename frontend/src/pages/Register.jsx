import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Facebook,
    CheckCircle,
    Chrome,
    User, // Icon cho Họ tên
    UserCircle, // Icon cho Username
    AlertCircle
} from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();

    // --- STATE QUẢN LÝ ---
    const [formData, setFormData] = useState({
        fullName: '',
        username: '', // Thêm trường username
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    });

    // Quản lý hiển thị mật khẩu
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

        // --- 1. VALIDATION (Kết hợp cũ và mới) ---
        
        // Kiểm tra đồng ý điều khoản
        if (!formData.agreeTerms) {
            setIsLoading(false);
            setError('Bạn cần đồng ý với điều khoản sử dụng để tiếp tục.');
            return;
        }

        // Kiểm tra khớp mật khẩu
        if (formData.password !== formData.confirmPassword) {
            setIsLoading(false);
            setError('Mật khẩu nhập lại không khớp!');
            return;
        }

        // Kiểm tra độ dài mật khẩu
        if (formData.password.length < 6) {
            setIsLoading(false);
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        // Kiểm tra Họ tên (Logic từ file cũ: không số, không ký tự đặc biệt)
        if (/\d/.test(formData.fullName)) {
            setIsLoading(false);
            setError("Họ và tên không được chứa ký tự số!");
            return;
        }
        if (/[^a-zA-ZÀ-Ỹà-ỹ\s]/.test(formData.fullName)) {
            setIsLoading(false);
            setError("Họ và tên không được chứa ký tự đặc biệt!");
            return;
        }

        // --- 2. GỌI API ---
        axios.post(`http://localhost:5000/api/auth/register`, {
            fullname: formData.fullName, // Map đúng key backend yêu cầu
            email: formData.email,
            username: formData.username,
            password: formData.password
        }, {
            withCredentials: true
        })
        .then(response => {
            console.log(response.data);
            // Giả lập delay nhỏ để UX mượt hơn
            setTimeout(() => {
                setIsLoading(false);
                
                // Chuẩn bị dữ liệu để auto-fill bên trang Login
                const stateData = {
                    action: "register",
                    username: formData.username,
                    password: formData.password,
                    url: "/" // Mặc định redirect sau khi login xong
                };

                // Điều hướng sang trang Login
                navigate('/login', { state: stateData });
            }, 1000);
        })
        .catch(err => {
            console.error('Error fetching data:', err);
            const msg = err.response?.data?.message || err.response?.data?.error || 'Tên đăng nhập hoặc Email đã tồn tại.';
            setError(msg);
            setIsLoading(false);
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

                {/* --- 1. LEFT SIDE: BRANDING --- */}
                <div className="hidden md:flex md:w-1/2 bg-blue-600 relative flex-col justify-between p-12 text-white overflow-hidden">
                    <div className="absolute inset-0 z-0 opacity-20">
                        <img
                            src="https://placehold.co/800x1200/1e40af/ffffff?text=Smart+Lifestyle"
                            alt="Background"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="relative z-10">
                        <Link to="/" className="text-3xl font-bold flex items-center gap-2 mb-6">
                            Electro<span className="text-orange-400">Shop</span>
                        </Link>
                        <h2 className="text-3xl font-bold mb-4">Tham gia cộng đồng mua sắm thông minh</h2>
                        <p className="text-blue-100 text-lg">Tạo tài khoản ngay hôm nay để nhận ưu đãi đặc biệt dành cho thành viên mới.</p>
                    </div>

                    <div className="relative z-10 mt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-white/20 p-2 rounded-full"><CheckCircle size={20} /></div>
                            <span>Tích điểm đổi quà hấp dẫn</span>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-white/20 p-2 rounded-full"><CheckCircle size={20} /></div>
                            <span>Theo dõi đơn hàng dễ dàng</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-full"><CheckCircle size={20} /></div>
                            <span>Nhận thông báo khuyến mãi sớm nhất</span>
                        </div>
                    </div>

                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                </div>

                {/* --- 2. RIGHT SIDE: REGISTER FORM --- */}
                <div className="w-full md:w-1/2 p-8 md:p-12">
                    <div className="flex justify-end mb-6">
                        <Link to="/" className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1">
                            Về trang chủ <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="mb-6 text-center md:text-left">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Tạo tài khoản</h2>
                        <p className="text-sm text-gray-500">Điền thông tin bên dưới để bắt đầu hành trình của bạn.</p>
                    </div>

                    {/* Social Register Buttons */}
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
                            <span className="px-2 bg-white text-gray-500">Hoặc đăng ký bằng tài khoản</span>
                        </div>
                    </div>

                    {/* Register Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200 flex items-center gap-2 animate-pulse">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        {/* 1. Full Name Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Nguyễn Văn A"
                                    className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* 2. Username Input (Đã thêm mới) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <UserCircle size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    placeholder="nguyenvana123"
                                    className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* 3. Email Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="name@example.com"
                                    className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* 4. Password Input */}
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
                                    placeholder="Tối thiểu 6 ký tự"
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

                        {/* 5. Confirm Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nhập lại mật khẩu</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className={`pl-10 pr-10 w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                                        formData.confirmPassword && formData.password !== formData.confirmPassword
                                            ? 'border-red-300 bg-red-50 focus:ring-red-500'
                                            : 'border-gray-300'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Terms Checkbox */}
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="agree-terms"
                                    name="agreeTerms"
                                    type="checkbox"
                                    checked={formData.agreeTerms}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                />
                            </div>
                            <div className="ml-2 text-sm">
                                <label htmlFor="agree-terms" className="font-medium text-gray-700 cursor-pointer">
                                    Tôi đồng ý với <a href="#" className="text-blue-600 hover:text-blue-500">Điều khoản dịch vụ</a>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang xử lý...
                                </span>
                            ) : (
                                "Đăng ký"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-500">Bạn đã có tài khoản? </span>
                        <Link to="/login" className="font-bold text-blue-600 hover:text-blue-500">
                            Đăng nhập ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;