import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Carousel, Spin, message } from "antd";
import banner1 from "../../../assets/banner.png";
import banner2 from "../../../assets/banner2.png";
import banner3 from "../../../assets/banner3.png";

import tulanh from "../../../assets/tu-lanh-samsung.jpg";
import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    // Dữ liệu tĩnh demo cho cửa hàng điện gia dụng
    const fakeProducts = [
      {
        id: 1,
        name: "Tủ lạnh Samsung Inverter 256L RT25M4032BY/SV",
        price: 8490000,
        image:
          tulanh,
        brand: "Samsung",
        stock: 5,
      },
      {
        id: 2,
        name: "Máy giặt LG Inverter 9kg FV1409S4W",
        price: 8990000,
        image:
          "https://cdn.tgdd.vn/Products/Images/1944/228924/lg-fv1409s4w-1-600x600.jpg",
        brand: "LG",
        stock: 3,
      },
      {
        id: 3,
        name: "Smart TV Sony 43 inch 4K KD-43X75K",
        price: 10290000,
        image:
          "https://cdn.tgdd.vn/Products/Images/1942/290973/sony-kd-43x75k-1-600x600.jpg",
        brand: "Sony",
        stock: 8,
      },
      {
        id: 4,
        name: "Nồi cơm điện tử Toshiba RC-18NTFV(W)",
        price: 1890000,
        image:
          "https://cdn.tgdd.vn/Products/Images/1921/221176/toshiba-rc-18ntfv-w-1-600x600.jpg",
        brand: "Toshiba",
        stock: 12,
      },
      {
        id: 5,
        name: "Bếp từ đôi Kangaroo KG438i",
        price: 3490000,
        image:
          "https://cdn.tgdd.vn/Products/Images/1983/238467/bep-tu-doi-kangaroo-kg438i-1-600x600.jpg",
        brand: "Kangaroo",
        stock: 7,
      },
      {
        id: 6,
        name: "Máy lạnh Daikin Inverter 1.5 HP FTKB35WMVMV",
        price: 12990000,
        image:
          "https://cdn.tgdd.vn/Products/Images/2002/284864/daikin-ftkb35wmvmv-1-600x600.jpg",
        brand: "Daikin",
        stock: 4,
      },
      {
        id: 7,
        name: "Lò vi sóng Sharp R-32A2VN-S 25L",
        price: 2290000,
        image:
          "https://cdn.tgdd.vn/Products/Images/2262/283169/sharp-r-32a2vn-s-1-600x600.jpg",
        brand: "Sharp",
        stock: 9,
      },
      {
        id: 8,
        name: "Máy hút bụi Panasonic MC-CG370GN46 1800W",
        price: 2190000,
        image:
          "https://cdn.tgdd.vn/Products/Images/1982/247983/panasonic-mc-cg370gn46-1-600x600.jpg",
        brand: "Panasonic",
        stock: 6,
      },
    ];
    setProducts(fakeProducts);
  }, []);

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
            <div className="product-card" key={product.id}>
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>

              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="brand">Thương hiệu: {product.brand}</p>
                <p className="price">
                  {product.price.toLocaleString("vi-VN")} đ
                </p>
                <p className="stock">
                  Tồn kho: {product.stock > 0 ? product.stock : "Hết hàng"}
                </p>
              </div>

              <div className="product-actions">
                <button className="detail-btn">Chi tiết</button>
                <button className="add-btn">Thêm vào giỏ</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
