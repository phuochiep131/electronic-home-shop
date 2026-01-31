import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000/api";

const VnpayReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/orders/vnpay-verify?${searchParams.toString()}`,
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Lỗi xác thực:", error);
        setStatus("error");
      }
    };

    if (searchParams.toString()) {
        verify();
    }
  }, [searchParams]);

  useEffect(() => {
    if (status !== "loading") {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      if (timeLeft === 0) navigate("/my-orders");
      return () => clearInterval(timer);
    }
  }, [status, timeLeft, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full border border-gray-100">
        {status === "loading" ? (
          <div className="space-y-4">
            <Loader2 className="animate-spin mx-auto text-blue-600" size={48} />
            <h2 className="text-xl font-bold">Đang xác thực giao dịch...</h2>
          </div>
        ) : status === "success" ? (
          <>
            <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-900">
              Thanh toán thành công!
            </h2>
            <p className="text-gray-500 mt-2">Cảm ơn bạn đã mua hàng.</p>
          </>
        ) : (
          <>
            <XCircle className="text-red-500 mx-auto mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-900">
              Thanh toán thất bại
            </h2>
            <p className="text-gray-500 mt-2">
              Giao dịch bị hủy hoặc có lỗi xảy ra.
            </p>
          </>
        )}
        <div className="mt-8 pt-6 border-t border-gray-100 text-sm text-blue-600 font-medium">
          Tự động quay lại trang đơn hàng sau {timeLeft}s...
        </div>
      </div>
    </div>
  );
};
export default VnpayReturn;