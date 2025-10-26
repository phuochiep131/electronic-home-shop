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

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true khi deploy
            sameSite: 'strict',
            maxAge: 3600 * 1000 // 1 giờ
        });

		res.json({ message: 'Đăng nhập thành công!', user });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

const logout = async (req, res) => {
    try {
        res.clearCookie('token'); 
        res.status(200).json({ message: 'Đăng xuất thành công' });
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
