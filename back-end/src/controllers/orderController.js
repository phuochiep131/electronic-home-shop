const orderService = require("../services/orderService");
const paymentService = require("../services/paymentService");
const moment = require("moment");
const querystring = require("qs");
const crypto = require("crypto");

// --- CẤU HÌNH VNPAY (HARDCODE) ---
const vnp_TmnCode = "Y4S5DHQ5";
const vnp_HashSecret = "CRBZ1439KUDSKR375SLGOM6BTXFWB5OI";
const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const vnp_ReturnUrl = "http://localhost:5173/order/vnpay_return"; // URL Frontend nhận kết quả

const create = async (req, res) => {
  try {
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    const order = await orderService.createOrder(req.user.id, req.body);

    if (req.body.payment_method === "VNPAY") {
      const paymentUrl = createVnpayUrl(order, ipAddr);
      return res.status(201).json({
        message: "Đang chuyển hướng sang VNPAY...",
        order,
        paymentUrl,
      });
    }

    res.status(201).json({ message: "Đặt hàng thành công!", order });
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(400).json({ error: err.message });
  }
};

const vnpayVerify = async (req, res) => {
  try {
    let vnp_Params = req.query;
    const secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    // Sắp xếp param để tạo chữ ký (Quan trọng)
    vnp_Params = sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      const orderId = vnp_Params["vnp_TxnRef"];
      const rspCode = vnp_Params["vnp_ResponseCode"];

      const payment = await paymentService.getPaymentByOrderId(orderId);
      if (!payment)
        return res
          .status(400)
          .json({ success: false, message: "Order not found" });

      if (rspCode === "00") {
        await paymentService.updatePaymentStatus(payment._id, "completed");
        await orderService.updateOrderStatus(orderId, "processing");
        return res
          .status(200)
          .json({ success: true, message: "Giao dịch thành công" });
      } else {
        await paymentService.updatePaymentStatus(payment._id, "failed");
        await orderService.cancelOrder(payment.order_id, orderId); // Tự động hủy đơn hoàn kho
        return res
          .status(200)
          .json({ success: false, message: "Giao dịch thất bại" });
      }
    } else {
      console.log("Chữ ký không khớp!");
      return res
        .status(200)
        .json({ success: false, message: "Invalid Signature" });
    }
  } catch (error) {
    console.error("VNPAY Verify Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

function createVnpayUrl(order, ipAddr) {
  process.env.TZ = "Asia/Ho_Chi_Minh";
  const date = new Date();
  const createDate = moment(date).format("YYYYMMDDHHmmss");
  const orderId = order._id.toString();

  // --- FIX 4: Đảm bảo Amount là số nguyên ---
  // VNPay yêu cầu số tiền nhân 100 và không có thập phân
  const amount = Math.floor(order.total_amount * 100);

  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = vnp_TmnCode;
  vnp_Params["vnp_Locale"] = "vn";
  vnp_Params["vnp_CurrCode"] = "VND";
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = "Thanh toan don hang " + orderId;
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] = amount; // Sử dụng biến amount đã xử lý
  vnp_Params["vnp_ReturnUrl"] = vnp_ReturnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;

  vnp_Params = sortObject(vnp_Params);

  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  vnp_Params["vnp_SecureHash"] = signed;

  return vnp_Url + "?" + querystring.stringify(vnp_Params, { encode: false });
}

// --- HÀM sortObject ĐÃ SỬA LỖI (Quan trọng nhất) ---
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    // Sửa lỗi crash "obj.hasOwnProperty is not a function" ở đây:
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

const getMyOrders = async (req, res) => {
  try {
    const orders = await orderService.getOrdersByUser(req.user.id);
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAll = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status);
    res.status(200).json({ message: "Cập nhật trạng thái thành công", order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const items = await orderService.getOrderItems(req.params.id);
    res.status(200).json(items);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const getOrderDetail = async (req, res) => {
  try {
    const data = await orderService.getOrderById(req.params.id);
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    const order = await orderService.cancelOrder(userId, orderId);
    res.status(200).json({ message: "Hủy đơn hàng thành công!", order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateOrderPaymentStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { payment_status } = req.body; // 'completed', 'failed', 'pending'

    if (!payment_status) {
      return res.status(400).json({ message: "Thiếu trạng thái thanh toán" });
    }

    // Gọi Service mới thêm
    const updatedPayment = await paymentService.updatePaymentStatusByOrderId(
      orderId,
      payment_status,
    );

    res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái thanh toán thành công",
      data: updatedPayment,
    });
  } catch (error) {
    // Xử lý trường hợp chưa có Payment record -> Tự động tạo 'completed' (Opsional - tuỳ chọn nâng cao)
    if (error.message.includes("chưa có bản ghi thanh toán")) {
      // Logic tự tạo payment nếu muốn...
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  create,
  vnpayVerify,
  getMyOrders,
  getAll,
  updateStatus,
  getOrderDetails,
  getOrderDetail,
  cancelOrder,
  updateOrderPaymentStatus,
};
