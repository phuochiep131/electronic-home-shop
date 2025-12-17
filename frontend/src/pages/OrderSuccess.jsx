import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle, ArrowRight, Home } from "lucide-react";

const OrderSuccess = () => {
  const location = useLocation();
  // Lấy orderId từ state truyền sang (nếu có)
  const orderId = location.state?.orderId;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Đặt hàng thành công!
        </h1>
        <p className="text-gray-500 mb-6">
          Cảm ơn bạn đã mua sắm tại ElectroShop. Đơn hàng của bạn đã được tiếp
          nhận và đang được xử lý.
        </p>

        {orderId && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-8">
            <span className="text-sm text-gray-500">Mã đơn hàng:</span>
            <div className="font-mono font-bold text-lg text-blue-600">
              #{orderId.slice(-6).toUpperCase()}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            to="/my-orders"
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            Xem đơn hàng của tôi <ArrowRight size={18} />
          </Link>
          <Link
            to="/"
            className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Home size={18} /> Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
