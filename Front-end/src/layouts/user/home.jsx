import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Carousel, Spin, message } from "antd";
import banner4 from "../../assets/banner4.jpg";
import banner5 from "../../assets/banner5.jpg";
import banner6 from "../../assets/banner6.jpg";
import tulanh from "../../assets/tu-lanh-samsung.jpg";

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
        image: tulanh,
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

  // Lớp CSS dùng chung cho các button
  const buttonBaseStyles =
    "flex-1 border-none p-2.5 rounded-lg font-semibold cursor-pointer transition duration-300 ease-in-out";

  return (
    <div className="flex flex-col gap-[60px] pb-10 max-w-[1200px] mx-auto">
      {contextHolder}
      <Spin spinning={spinning} fullscreen />

      {/* Banner */}
      <Carousel autoplay autoplaySpeed={3000}>
        {[banner4, banner5, banner6].map((img, i) => (
          <div
            className="w-full h-[350px] rounded-[10px] overflow-hidden flex justify-center items-center"
            key={i}
          >
            <img
              src={img}
              alt={`Banner ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </Carousel>

      {/* Sản phẩm nổi bật */}
      <section className="flex flex-col gap-[25px]">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[22px]">Sản phẩm nổi bật</span>
          <Link
            to="/products"
            className="flex items-center gap-2 text-gray-500 font-semibold"
          >
            <span>Xem tất cả</span>
            <ion-icon name="arrow-forward"></ion-icon>
          </Link>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-[25px]">
          {products.map((product) => (
            <div
              className="bg-white rounded-2xl shadow-[0_2px_6px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:-translate-y-[5px] hover:shadow-[0_10px_18px_rgba(0,0,0,0.2)]"
              key={product.id}
            >
              <div className="product-image">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[220px] object-cover pt-2.5"
                />
              </div>

              <div className="p-[15px] flex-1">
                <h3 className="text-base font-semibold mb-[5px] text-gray-800">
                  {product.name}
                </h3>
                <p className="text-gray-500 text-sm mb-[5px]">
                  Thương hiệu: {product.brand}
                </p>
                <p className="text-[#e53935] font-bold text-lg mb-1">
                  {product.price.toLocaleString("vi-VN")} đ
                </p>
                <p className="text-sm text-gray-600">
                  Tồn kho: {product.stock > 0 ? product.stock : "Hết hàng"}
                </p>
              </div>

              <div className="flex justify-between px-[15px] pt-[10px] pb-[15px] gap-2.5">
                <button
                  className={`${buttonBaseStyles} bg-white border border-[#1a73e8] text-[#1a73e8] hover:bg-[#2980b9] hover:text-white`}
                >
                  Chi tiết
                </button>
                <button
                  className={`${buttonBaseStyles} bg-[#3498db] text-white hover:bg-[#2980b9]`}
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
