import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminRoute = () => {
  const { state } = useAuth();
  const { currentUser, loading } = state;

  if (loading)
    return <div className="p-10 text-center">Đang kiểm tra quyền...</div>;

  // Nếu chưa đăng nhập hoặc Role không phải Admin -> Đá về Home
  if (!currentUser || currentUser.role !== "Admin") {
    alert("Bạn không có quyền truy cập trang này!");
    return <Navigate to="/" replace />;
  }

  // Nếu đúng là Admin -> Cho phép hiển thị nội dung bên trong (Outlet)
  return <Outlet />;
};

export default AdminRoute;
