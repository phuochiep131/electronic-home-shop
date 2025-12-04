const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Tạo User mới
const createUser = async (userData) => {
  // 1. Kiểm tra username tồn tại chưa
  const existingUser = await User.findOne({ username: userData.username });
  if (existingUser) {
    throw new Error('Username đã tồn tại');
  }

  // 2. Hash password trước khi lưu
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  
  const newUser = new User({
    ...userData,
    password: hashedPassword
  });

  return await newUser.save();
};

// Lấy tất cả Users (có thể thêm phân trang, lọc tại đây)
const getAllUsers = async () => {
  // Loại bỏ trường password khi trả về danh sách
  return await User.find().select('-password').sort({ created_at: -1 });
};

// Lấy chi tiết User theo ID
const getUserById = async (id) => {
  const user = await User.findById(id).select('-password');
  if (!user) throw new Error('Không tìm thấy người dùng');
  return user;
};

// Cập nhật User
const updateUser = async (id, updateData) => {
  // Nếu có cập nhật password thì phải hash lại
  if (updateData.password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(updateData.password, salt);
  }

  const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
  if (!user) throw new Error('Không tìm thấy người dùng để cập nhật');
  return user;
};

// Xóa User
const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error('Không tìm thấy người dùng để xóa');
  return user;
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};