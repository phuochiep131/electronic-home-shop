import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";

// --- LAYOUT COMPONENT ---
// Layout này giúp Navbar và Footer luôn hiển thị, chỉ có phần giữa (Outlet) thay đổi
const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-900">
      {/* Navbar cố định ở trên */}
      <Navbar />

      {/* Phần nội dung chính sẽ thay đổi tùy theo trang */}
      {/* flex-grow giúp đẩy Footer xuống dưới cùng nếu nội dung trang ngắn */}
      <main className="flex-grow bg-gray-50">
        <Outlet />
      </main>

      {/* Footer cố định ở dưới */}
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Route cha sử dụng MainLayout */}
      <Route path="/" element={<MainLayout />}>
        {/* Route Index: Trang chủ (hiển thị khi vào đường dẫn /) */}
        <Route index element={<Home />} />

        {/* Các Route con */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="cart" element={<Cart />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="/profile" element={<Profile />} />

        {/* Route động cho danh mục sản phẩm (khớp với link trong Navbar) */}
        {/* Ví dụ: /category/tu-lanh */}
        <Route
          path="category/:slug"
          element={
            <div className="p-20 text-center text-xl">
              Trang danh mục đang phát triển...
            </div>
          }
        />

        {/* Route bắt lỗi 404 */}
        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center h-64">
              <h1 className="text-4xl font-bold text-gray-300">404</h1>
              <p className="text-gray-500">Không tìm thấy trang này</p>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
