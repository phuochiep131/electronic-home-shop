const Product = require("../models/Product");
const Category = require("../models/Category");

// Lấy tất cả sản phẩm (có filter category và search keyword)
async function getAllProducts(query) {
  const filter = {};

  // 1. Logic lọc theo Category (Giữ nguyên)
  if (query.category) {
    filter.category_id = query.category;
  }

  // 2. Logic tìm kiếm theo Keyword (MỚI THÊM)
  // Hỗ trợ nhận cả param ?search=... hoặc ?keyword=... từ Frontend gửi lên
  const searchKeyword = query.search || query.keyword;

  if (searchKeyword) {
    filter.$or = [
      // Tìm trong tên sản phẩm (regex: tìm gần đúng, options 'i': không phân biệt hoa thường)
      { product_name: { $regex: searchKeyword, $options: "i" } },
      // (Tùy chọn) Tìm luôn trong mô tả nếu muốn
      { description: { $regex: searchKeyword, $options: "i" } },
    ];
  }

  // Thực hiện truy vấn với filter đã tạo
  const products = await Product.find(filter).populate("category_id", "name");
  return products;
}

// ... (Các hàm getProductById, createProduct, updateProduct, deleteProduct GIỮ NGUYÊN) ...
async function getProductById(id) {
  const product = await Product.findById(id).populate("category_id", "name");
  if (!product) throw new Error("Không tìm thấy sản phẩm");
  return product;
}

async function createProduct(data) {
  const category = await Category.findById(data.category_id);
  if (!category) throw new Error("Danh mục không hợp lệ");
  const newProduct = new Product(data);
  await newProduct.save();
  return newProduct;
}

async function updateProduct(id, data) {
  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  if (!product) throw new Error("Không tìm thấy sản phẩm để cập nhật");
  return product;
}

async function deleteProduct(id) {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new Error("Không tìm thấy sản phẩm để xóa");
  return { message: "Xóa sản phẩm thành công" };
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
