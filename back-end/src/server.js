const express = require("express");
const cors = require("cors");
const connect = require("./config/db");
const cookieParser = require('cookie-parser');

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes"); 
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

connect();

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server đang chạy tại http://localhost:${PORT}`)
);
