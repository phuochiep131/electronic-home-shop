const userService = require('../services/userService');

// [POST] /api/users
const create = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({
      success: true,
      message: 'Tạo người dùng thành công',
      data: user
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// [GET] /api/users
const getAll = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users); // Trả về mảng trực tiếp cho dễ dùng ở frontend
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [GET] /api/users/:id
const getOne = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// [PUT] /api/users/:id
const update = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Cập nhật thành công',
      data: user
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// [DELETE] /api/users/:id
const remove = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Xóa người dùng thành công'
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove
};