// home.jsx (ĐÃ CẬP NHẬT)

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Carousel, Spin, message } from "antd";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

import banner1 from "../../../assets/banner.png";
import banner2 from "../../../assets/banner2.png";
import banner3 from "../../../assets/banner3.png";
import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { state } = useAuth();
  const { currentUser } = state;

  useEffect(() => {
    const fetchProducts = async () => {
      setSpinning(true);
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data.slice(0, 8));
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
        messageApi.error("Không thể tải danh sách sản phẩm!");
      } finally {
        setSpinning(false);
      }
    };

    fetchProducts();
  }, [messageApi]);

  const handleAddToCart = async (productId) => {
    if (!currentUser) {
      messageApi.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      navigate("/login");
      return;
    }

    setSpinning(true);
    try {
      await axios.post(
        "http://localhost:5000/api/cart/add",
        { productId: productId, quantity: 1 },
        { withCredentials: true }
      );
      messageApi.success("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      messageApi.error(error.response?.data?.error || "Có lỗi xảy ra!");
    } finally {
      setSpinning(false);
    }
  };

  return (
    <div className="homepage">
      {contextHolder}
      <Spin spinning={spinning} fullscreen />

      {/* Banner */}
      <Carousel autoplay autoplaySpeed={3000}>
        {[banner1, banner2, banner3].map((img, i) => (
          <div className="homepage-banner" key={i}>
            <img src={img} alt={`Banner ${i + 1}`} />
          </div>
        ))}
      </Carousel>

      {/* Sản phẩm nổi bật */}
      <section className="homepage-section">
        <div className="section-header">
          <span>Sản phẩm nổi bật</span>
          <Link to="/products">
            <span>Xem tất cả</span>
            <ion-icon name="arrow-forward"></ion-icon>
          </Link>
        </div>

        <div className="product-list">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              <div className="product-image">
                <img src={product.image_url} alt={product.product_name} />
                {product.discount > 0 && (
                  <div className="discount-tag">-{product.discount}%</div>
                )}
              </div>

              <div className="product-info">
                <h3>{product.product_name}</h3>
                <p className="brand">Xuất xứ: {product.origin}</p>
                <div className="price-container">
                  {product.discount > 0 ? (
                    <>
                      <p className="new-price">
                        {(
                          product.price *
                          (1 - product.discount / 100)
                        ).toLocaleString("vi-VN")}{" "}
                        đ
                      </p>
                      <p className="old-price">
                        {product.price.toLocaleString("vi-VN")} đ
                      </p>
                    </>
                  ) : (
                    <p className="price">
                      {product.price.toLocaleString("vi-VN")} đ
                    </p>
                  )}
                </div>
              </div>

              <div className="product-actions">
                <button
                  className="detail-btn"
                  onClick={() => navigate(`/products/${product._id}`)}
                >
                  Chi tiết
                </button>
                <button
                  className="add-btn"
                  onClick={() => handleAddToCart(product._id)}
                >
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;