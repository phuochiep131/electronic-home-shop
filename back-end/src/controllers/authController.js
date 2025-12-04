const authService = require("../services/authService");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config/jwt");

const register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({ message: "Đăng ký thành công!", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { user, token } = await authService.loginUser(username, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600 * 1000, // 1 giờ
    });

    res.json({ message: "Đăng nhập thành công!", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// API này dùng để lấy thông tin user dựa trên Token trong Cookie
const getMe = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập" });
    }

    const decoded = jwt.verify(token, config.SECRET_KEY);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json(user);
  } catch (err) {
    console.error("Lỗi getMe:", err.message);
    return res
      .status(401)
      .json({ message: "Phiên đăng nhập hết hạn hoặc lỗi Server" });
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
};
