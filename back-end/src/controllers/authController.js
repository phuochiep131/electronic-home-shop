const authService = require('../services/authService');

const register = async (req, res) => {
	try {
		const user = await authService.registerUser(req.body);
		res.status(201).json({ message: 'Đăng ký thành công!', user });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

const login = async (req, res) => {
	try {
		const { username, password } = req.body;
		const { user, token } = await authService.loginUser(username, password);
		res.json({ message: 'Đăng nhập thành công!', user, token });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.json({ message: 'Đăng xuất thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
module.exports = {
	register,
	login,
	logout,
};
