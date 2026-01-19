import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import CategoryPage from "./pages/CategoryPage";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import OrderDetail from "./pages/OrderDetail";
import SearchPage from "./pages/SearchPage";
import VnpayReturn from "./pages/VnpayReturn";

//admin
import AdminRoute from "./pages/admin/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProductManager from "./pages/admin/ProductManager";
import UserManager from "./pages/admin/UserManager";
import CategoryManager from "./pages/admin/CategoryManager";
import OrderManager from "./pages/admin/OrderManager";
import BannerManager from "./pages/admin/BannerManager";
import FlashSaleManager from "./pages/admin/FlashSaleManager";

// --- LAYOUT COMPONENT ---
const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-900">
      {/* Navbar cố định ở trên (fixed) */}
      <Navbar />
      <main className="flex-grow bg-gray-50 pt-[100px] md:pt-[160px]">
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
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      <Route path="/" element={<MainLayout />}>
        {/* Route Index: Trang chủ */}
        <Route index element={<Home />} />

        {/* Các Route con */}
        <Route path="cart" element={<Cart />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/order/vnpay_return" element={<VnpayReturn />} />
        <Route path="/order/:id" element={<OrderDetail />} />
        <Route path="/search" element={<SearchPage />} />
        

        {/* Route động cho danh mục (đang phát triển) */}
        <Route
          path="category/:slug"
          element={
            <div className="p-20 text-center text-xl">
              Trang danh mục đang phát triển...
            </div>
          }
        />

        {/* Route 404 */}
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

      {/* --- ROUTES ADMIN --- */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductManager />} />
          <Route path="users" element={<UserManager />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="orders" element={<OrderManager />} />
          <Route path="banners" element={<BannerManager />} />
          <Route path="flash-sales" element={<FlashSaleManager />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
