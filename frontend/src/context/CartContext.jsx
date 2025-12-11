import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext"; // Import Auth để biết user đã login chưa

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0); // Số lượng hiển thị trên Navbar
  const { state } = useAuth(); // Lấy thông tin user
  const { isAuthenticated } = state;

  // Hàm lấy số lượng giỏ hàng từ API
  const fetchCartCount = async () => {
    if (!isAuthenticated) {
      setCartCount(0);
      return;
    }
    try {
      const res = await axios.get("http://localhost:5000/api/cart", {
        withCredentials: true, // Gửi cookie để xác thực
      });
      // Giả sử API trả về { cart: {...}, items: [...] }
      // Đếm tổng số lượng item
      const items = res.data.items || [];
      const count = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    } catch (error) {
      console.error("Lỗi lấy giỏ hàng:", error);
    }
  };

  // Gọi khi App mount hoặc khi login thành công
  useEffect(() => {
    fetchCartCount();
  }, [isAuthenticated]);

  // Hàm thêm vào giỏ hàng (Gọi từ trang ProductDetail)
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để mua hàng!");
      return false;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/cart/add",
        { productId, quantity },
        { withCredentials: true }
      );
      // Sau khi thêm thành công, update lại số lượng ngay lập tức
      await fetchCartCount();
      alert("Đã thêm vào giỏ hàng!");
      return true;
    } catch (error) {
      console.error("Lỗi thêm giỏ hàng:", error);
      alert(error.response?.data?.error || "Có lỗi xảy ra");
      return false;
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
