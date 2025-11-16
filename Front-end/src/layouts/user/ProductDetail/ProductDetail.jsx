// src/pages/ProductDetail/ProductDetail.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Spin, message, InputNumber } from "antd";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import "./ProductDetail.css";

function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [spinning, setSpinning] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  
  const { productId } = useParams();
  const navigate = useNavigate();
  const { state } = useAuth();
  const { currentUser } = state;

  // Tải dữ liệu chi tiết sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      setSpinning(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", error);
        messageApi.error("Không tìm thấy sản phẩm!");
        navigate("/products"); // Nếu lỗi, chuyển về trang sản phẩm
      } finally {
        setSpinning(false);
      }
    };
    fetchProduct();
  }, [productId, messageApi, navigate]);

  const handleAddToCart = async () => {
    if (!currentUser) {
      messageApi.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      navigate("/login");
      return;
    }
    setSpinning(true);
    try {
      await axios.post(
        "http://localhost:5000/api/cart/add",
        { productId: product._id, quantity: quantity },
        { withCredentials: true }
      );
      messageApi.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    } catch (error) {
      messageApi.error(error.response?.data?.error || "Có lỗi xảy ra!");
    } finally {
      setSpinning(false);
    }
  };
  
  if (!product) {
    return <Spin spinning={true} fullscreen />;
  }
  
  const finalPrice = product.price * (1 - product.discount / 100);

  return (
    <div className="product-detail-page">
      {contextHolder}
      <Spin spinning={spinning} fullscreen />
      
      <div className="product-detail-nav">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ion-icon name="arrow-back-outline"></ion-icon>
          Quay lại
        </button>
        <div className="breadcrumbs">
          <Link to="/">Trang chủ</Link> / 
          <Link to="/products">Sản phẩm</Link> / 
          <span>{product.product_name}</span>
        </div>
      </div>

      <div className="product-detail-container">
        <div className="product-detail__image-gallery">
          <img src={product.image_url} alt={product.product_name} />
          {/* (thêm các ảnh thumbnail ở đây) */}
        </div>
        
        <div className="product-detail__info">
          <h1 className="info__title">{product.product_name}</h1>
          
          <div className="info__price-container">
            {product.discount > 0 ? (
              <>
                <span className="info__new-price">{finalPrice.toLocaleString("vi-VN")} đ</span>
                <span className="info__old-price">{product.price.toLocaleString("vi-VN")} đ</span>
                <span className="info__discount-tag">-{product.discount}%</span>
              </>
            ) : (
              <span className="info__price">{product.price.toLocaleString("vi-VN")} đ</span>
            )}
          </div>

          <p className="info__stock">
            Tình trạng: 
            <span className={product.quantity > 0 ? "in-stock" : "out-of-stock"}>
              {product.quantity > 0 ? ` Còn hàng (${product.quantity} sản phẩm)` : " Hết hàng"}
            </span>
          </p>
          
          <div className="info__quantity-selector">
            <span>Số lượng:</span>
            <InputNumber 
              min={1} 
              max={product.quantity} 
              defaultValue={1} 
              onChange={(value) => setQuantity(value)}
              disabled={product.quantity === 0}
            />
          </div>

          <div className="info__actions">
            <button 
              className="add-to-cart-btn" 
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
            >
              <ion-icon name="cart-outline"></ion-icon>
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>

      <div className="product-detail__description">
        <h2>Mô tả sản phẩm</h2>
        <p>{product.description}</p>
        
        <h2>Thông số kỹ thuật</h2>
        <ul className="specs-list">
          {product.origin && <li><strong>Xuất xứ:</strong> {product.origin}</li>}
          {product.warranty && <li><strong>Bảo hành:</strong> {product.warranty}</li>}
          {product.color && <li><strong>Màu sắc:</strong> {product.color}</li>}
          {product.size && <li><strong>Kích thước:</strong> {product.size}</li>}
          {product.material && <li><strong>Chất liệu:</strong> {product.material}</li>}
        </ul>
      </div>
    </div>
  );
}

export default ProductDetail;