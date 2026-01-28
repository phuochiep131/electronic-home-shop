const dashboardService = require("../services/dashboardService");

exports.getDashboardData = async (req, res) => {
  try {
    // Gọi song song các service để tối ưu thời gian phản hồi
    const [stats, chartData, topProducts, deadStockProducts, recentOrders] =
      await Promise.all([
        dashboardService.getOverviewStats(),
        dashboardService.getRevenueChartData(),
        dashboardService.getTopSellingProducts(),
        dashboardService.getDeadStockProducts(),
        dashboardService.getRecentOrders(),
      ]);

    res.status(200).json({
      success: true,
      data: {
        stats,
        chartData,
        topProducts,
        deadStockProducts,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi Server khi tải dữ liệu Dashboard",
    });
  }
};
