const express = require('express');
const cors = require('cors');
const connect = require('./config/db');

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());
app.use(cors());

connect();

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server đang chạy tại http://localhost:${PORT}`));
