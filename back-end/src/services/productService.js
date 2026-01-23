const Product = require("../models/Product");
const Category = require("../models/Category");
const FlashSale = require("../models/FlashSale");

// Lấy tất cả sản phẩm (có filter category, search keyword & JOIN FlashSale)
async function getAllProducts(query) {
  const filter = {};

  // Logic lọc theo Category
  if (query.category) {
    filter.category_id = query.category;
  }

  // Logic tìm kiếm theo Keyword
  const searchKeyword = query.search || query.keyword;
  if (searchKeyword) {
    filter.$or = [
      { product_name: { $regex: searchKeyword, $options: "i" } },
      { description: { $regex: searchKeyword, $options: "i" } },
    ];
  }

  // 2. Lấy danh sách sản phẩm và dùng .lean() để trả về plain object
  const products = await Product.find(filter)
    .populate("category_id", "name")
    .lean();

  // 3. Lấy thời gian hiện tại để check Flash Sale
  const now = new Date();

  // 4. Duyệt qua từng sản phẩm để tìm Flash Sale tương ứng
  const productsWithFlashSale = await Promise.all(
    products.map(async (product) => {
      const activeFlashSale = await FlashSale.findOne({
        product_id: product._id,
        status: true,
        start_date: { $lte: now }, // Đã bắt đầu
        end_date: { $gte: now },   // Chưa kết thúc
      }).lean();

      // Nếu có Flash Sale active, gắn vào object product
      if (activeFlashSale) {
        product.flash_sale = activeFlashSale;
      }
      
      return product;
    })
  );

  return productsWithFlashSale;
}

// Lấy chi tiết 1 sản phẩm & check Flash Sale
async function getProductById(id) {
  // 1. Dùng .lean()
  const product = await Product.findById(id)
    .populate("category_id", "name")
    .lean();

  if (!product) throw new Error("Không tìm thấy sản phẩm");

  // 2. Check Flash Sale cho sản phẩm này
  const now = new Date();
  const activeFlashSale = await FlashSale.findOne({
    product_id: product._id,
    status: true,
    start_date: { $lte: now },
    end_date: { $gte: now },
  }).lean();

  // 3. Nếu có, gắn vào
  if (activeFlashSale) {
    product.flash_sale = activeFlashSale;
  }

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