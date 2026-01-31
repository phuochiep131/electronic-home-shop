const flashSaleService = require("../services/flashSaleService");

// API này dùng cho trang ADMIN MANAGER
const getFlashSales = async (req, res) => {
  try {
    // Đổi từ getActiveFlashSales -> getAllFlashSales
    const sales = await flashSaleService.getAllFlashSales();
    res.status(200).json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// (Tùy chọn) API này dùng cho trang HOME user xem
const getActiveFlashSalesForUser = async (req, res) => {
  try {
    const sales = await flashSaleService.getActiveFlashSales();
    res.status(200).json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createFlashSale = async (req, res) => {
  try {
    const sale = await flashSaleService.createFlashSale(req.body);
    res.status(201).json(sale);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateFlashSale = async (req, res) => {
  try {
    const sale = await flashSaleService.updateFlashSale(
      req.params.id,
      req.body,
    );
    res.status(200).json(sale);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteFlashSale = async (req, res) => {
  try {
    await flashSaleService.deleteFlashSale(req.params.id);
    res.status(200).json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getFlashSales,
  getActiveFlashSalesForUser, // Export thêm cái này nếu cần route riêng cho User
  createFlashSale,
  updateFlashSale,
  deleteFlashSale,
};
