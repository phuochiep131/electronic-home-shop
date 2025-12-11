const Category = require("../models/Category");
const Product = require("../models/Product");

// 1. Lấy tất cả danh mục
async function getAllCategories() {
  // Bỏ populate, chỉ lấy danh sách và sắp xếp mới nhất lên đầu
  return await Category.find().sort({ created_at: -1 });
}

// 2. Lấy một danh mục theo ID
async function getCategoryById(id) {
  const category = await Category.findById(id);
  if (!category) throw new Error("Không tìm thấy danh mục");
  return category;
}

// 3. Tạo danh mục mới
async function createCategory(data) {
  // Bỏ parent_id ra khỏi dữ liệu đầu vào
  const { name, description, image, is_active } = data;

  // Validate cơ bản
  if (!name) throw new Error("Tên danh mục là bắt buộc");

  // Kiểm tra trùng tên
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) throw new Error("Tên danh mục đã tồn tại");

  // Tạo đối tượng mới (Không còn parent_id)
  const newCategory = new Category({
    name,
    description,
    image,
    is_active: is_active !== undefined ? is_active : true,
  });

  await newCategory.save();
  return newCategory;
}

// 4. Cập nhật danh mục
async function updateCategory(id, data) {
  // Bỏ parent_id ra khỏi dữ liệu cập nhật
  const { name, description, image, is_active } = data;

  // Kiểm tra trùng tên (trừ chính nó ra)
  if (name) {
    const existingCategory = await Category.findOne({
      name: name,
      _id: { $ne: id },
    });
    if (existingCategory) throw new Error("Tên danh mục đã tồn tại");
  }

  // Cập nhật
  const category = await Category.findByIdAndUpdate(
    id,
    {
      name,
      description,
      image,
      is_active,
    },
    { new: true } // Trả về dữ liệu mới sau khi update
  );

  if (!category) throw new Error("Không tìm thấy danh mục để cập nhật");
  return category;
}

// 5. Xóa danh mục
async function deleteCategory(id) {
  // ĐÃ XÓA logic kiểm tra danh mục con (vì không còn quan hệ cha-con)

  // Kiểm tra xem có sản phẩm nào thuộc danh mục này không
  // Lưu ý: Đảm bảo Model Product có field 'category_id' hoặc 'category' khớp
  const productInCategory = await Product.findOne({ category_id: id });
  if (productInCategory) {
    throw new Error("Không thể xóa danh mục vì vẫn còn sản phẩm tồn tại");
  }

  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new Error("Không tìm thấy danh mục để xóa");

  return { message: "Xóa danh mục thành công", _id: id };
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
