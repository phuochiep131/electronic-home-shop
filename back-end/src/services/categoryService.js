const Category = require('../models/Category');
const Product = require('../models/Product');

// Lấy tất cả danh mục
async function getAllCategories() {
    return await Category.find();
}

// Lấy một danh mục theo ID
async function getCategoryById(id) {
    const category = await Category.findById(id);
    if (!category) throw new Error('Không tìm thấy danh mục');
    return category;
}

// Tạo danh mục mới
async function createCategory(data) {
    const { category_name } = data;
    // Kiểm tra xem tên danh mục đã tồn tại chưa
    const existingCategory = await Category.findOne({ category_name });
    if (existingCategory) throw new Error('Tên danh mục đã tồn tại');

    const newCategory = new Category({ category_name });
    await newCategory.save();
    return newCategory;
}

// Cập nhật danh mục
async function updateCategory(id, data) {
    const category = await Category.findByIdAndUpdate(id, data, { new: true });
    if (!category) throw new Error('Không tìm thấy danh mục để cập nhật');
    return category;
}

// Xóa danh mục
async function deleteCategory(id) {
    //Kiểm tra xem có sản phẩm nào thuộc danh mục này không
    const productInCategory = await Product.findOne({ category_id: id });
    if (productInCategory) {
        throw new Error('Không thể xóa danh mục vì vẫn còn sản phẩm tồn tại');
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) throw new Error('Không tìm thấy danh mục để xóa');
    return { message: 'Xóa danh mục thành công' };
}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};