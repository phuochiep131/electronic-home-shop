const Order = require("../models/Order");
const OrderDetail = require("../models/OrderDetail");
const Product = require("../models/Product");
const User = require("../models/User"); // Giả định bạn có model User

// Helper: Lấy ngày đầu tháng
const getStartOfMonth = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

// 1. Lấy thống kê tổng quan (Cards)
exports.getOverviewStats = async () => {
  const startOfMonth = getStartOfMonth();

  // Doanh thu tháng này (chỉ tính đơn không bị hủy)
  const revenueAgg = await Order.aggregate([
    {
      $match: {
        order_date: { $gte: startOfMonth },
        order_status: { $ne: "cancelled" },
      },
    },
    { $group: { _id: null, total: { $sum: "$total_amount" } } },
  ]);

  // Đếm số lượng
  const [ordersCount, usersCount, productsAgg] = await Promise.all([
    Order.countDocuments({ order_date: { $gte: startOfMonth } }),
    User.countDocuments(),
    Product.aggregate([
      { $group: { _id: null, totalQty: { $sum: "$quantity" } } },
    ]),
  ]);

  return {
    revenueThisMonth: revenueAgg[0]?.total || 0,
    ordersThisMonth: ordersCount,
    users: usersCount,
    productsInStock: productsAgg[0]?.totalQty || 0,
  };
};

// 2. Lấy dữ liệu biểu đồ doanh thu 12 tháng
exports.getRevenueChartData = async () => {
  const currentYear = new Date().getFullYear();

  return await Order.aggregate([
    {
      $match: {
        order_status: { $ne: "cancelled" },
        order_date: {
          $gte: new Date(currentYear, 0, 1),
          $lte: new Date(currentYear, 11, 31),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$order_date" },
        revenue: { $sum: "$total_amount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

// 3. Lấy top sản phẩm bán chạy (Kèm thông tin bảo hành - đặc thù đồ điện)
exports.getTopSellingProducts = async () => {
  return await OrderDetail.aggregate([
    {
      $group: {
        _id: "$product_id",
        totalSold: { $sum: "$quantity" },
        revenue: { $sum: "$subtotal" },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "products", // Tên collection trong MongoDB (thường là số nhiều)
        localField: "_id",
        foreignField: "_id",
        as: "productInfo",
      },
    },
    { $unwind: "$productInfo" },
    {
      $project: {
        name: "$productInfo.product_name",
        image: "$productInfo.image_url",
        price: "$productInfo.price",
        warranty: "$productInfo.warranty", //
        totalSold: 1,
        revenue: 1,
      },
    },
  ]);
};

// 4. Lấy hàng tồn kho lâu (Dead Stock) - Quan trọng với đồ điện tử rớt giá nhanh
exports.getDeadStockProducts = async () => {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 2);

  return await Product.find({
    createdAt: { $lt: threeMonthsAgo },
    quantity: { $gt: 0 }, // Vẫn còn hàng
  })
    .select("product_name price quantity image_url createdAt")
    .sort({ quantity: -1 })
    .limit(5);
};

// 5. Lấy đơn hàng gần đây
exports.getRecentOrders = async () => {
  return await Order.find()
    .sort({ order_date: -1 }) // sắp xếp theo order_date
    .limit(6)
    .populate("user_id", "fullname email")
    .select("user_id total_amount order_status order_date payment_method");
};
