const Product = require('../models/Product');
const Category = require('../models/Category');

// Lấy tất cả sản phẩm (có filter và phân trang)
async function getAllProducts(query) {
    const filter = {};
    if (query.category) {
        filter.category_id = query.category;
    }
    // Populate để lấy cả tên danh mục thay vì chỉ ID
    const products = await Product.find(filter).populate('category_id', 'category_name');
    return products;
}

// Lấy một sản phẩm theo ID
async function getProductById(id) {
    const product = await Product.findById(id).populate('category_id', 'category_name');
    if (!product) throw new Error('Không tìm thấy sản phẩm');
    return product;
}

// Tạo sản phẩm mới
async function createProduct(data) {
    // Kiểm tra xem category_id có hợp lệ không
    const category = await Category.findById(data.category_id);
    if (!category) throw new Error('Danh mục không hợp lệ');

    const newProduct = new Product(data);
    await newProduct.save();
    return newProduct;
}

// Cập nhật sản phẩm
async function updateProduct(id, data) {
    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    if (!product) throw new Error('Không tìm thấy sản phẩm để cập nhật');
    return product;
}

// Xóa sản phẩm
async function deleteProduct(id) {
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new Error('Không tìm thấy sản phẩm để xóa');
    return { message: 'Xóa sản phẩm thành công' };
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};