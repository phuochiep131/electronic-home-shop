const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET_KEY = "websitedodiengiadung";

async function registerUser(data) {
	const {
	username, password, email, role, fullname,
	birth_date, gender, address, avatar, phone_number } = data;

	const existingUser = await User.findOne({ username });
	if (existingUser) throw new Error('Tên đăng nhập đã tồn tại!');

	const hashedPassword = await bcrypt.hash(password, 10);

	const user = await User.create({
		username,
		password: hashedPassword,
		email,
		role,
		fullname,
		birth_date,
		gender,
		address,
		avatar,
		phone_number,
		created_at: new Date(),
	});

	return user;
}

async function loginUser(username, password) {
	const user = await User.findOne({ username });
	if (!user) throw new Error('Không tìm thấy người dùng!');

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) throw new Error('Sai mật khẩu!');

	const token = jwt.sign(
		{ id: user._id, role: user.role },
		SECRET_KEY,
		{ expiresIn: '1h' }
	);

	return { success: true, token };
}

module.exports = {
	registerUser,
	loginUser,
};
