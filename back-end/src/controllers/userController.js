const userService = require("../services/userService");

// [POST] /api/users
const create = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({
      success: true,
      message: "Tạo người dùng thành công",
      data: user,
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
      message: "Cập nhật thành công",
      data: user,
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
      message: "Xóa người dùng thành công",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// [PUT] /api/user/update (User tự cập nhật)
const updateSelf = async (req, res) => {
  try {
    // req.user.id được lấy từ middleware authenticate sau khi giải mã Token
    const userId = req.user.id;

    // Lọc dữ liệu: Chỉ cho phép update những trường an toàn
    // Tránh việc user tự hack quyền 'Admin' hoặc đổi username
    const allowedUpdates = {
      fullname: req.body.fullname,
      phone_number: req.body.phone_number,
      address: req.body.address,
      gender: req.body.gender,
      birth_date: req.body.birth_date,
      avatar: req.body.avatar,
      email: req.body.email,
    };

    // Loại bỏ các trường undefined (không gửi lên)
    Object.keys(allowedUpdates).forEach(
      (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    const user = await userService.updateUser(userId, allowedUpdates);

    res.status(200).json({
      success: true,
      message: "Cập nhật hồ sơ thành công",
      user: user, // Trả về user để Frontend cập nhật Context
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  updateSelf,
  create,
  getAll,
  getOne,
  update,
  remove,
};
