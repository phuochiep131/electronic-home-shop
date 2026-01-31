import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

// Import ảnh
import banner1 from "../assets/banners/banner1.png";
import banner2 from "../assets/banners/banner2.png";
import banner3 from "../assets/banners/banner3.png";
import side1 from "../assets/banners/slide1.png";
import side2 from "../assets/banners/slide2.png";

const LOCAL_BANNERS = [
  {
    _id: "1",
    image_url: banner1,
    link_to: "/category/gia-dung-bep",
  },
  {
    _id: "2",
    image_url: banner2,
    link_to: "/category/may-giat",
  },
  {
    _id: "3",
    image_url: banner3,
    link_to: "/category/tu-lanh",
  },
];

const Banner = () => {
  const [banners, setBanners] = useState(LOCAL_BANNERS);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide(currentSlide === banners.length - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? banners.length - 1 : currentSlide - 1);
  };

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* --- MAIN SLIDER (Cột trái) --- */}
        {/* Đã sửa: md:h-[500px] để bằng chiều cao cột phải */}
        <div className="md:col-span-8 relative rounded-2xl overflow-hidden shadow-lg group h-[200px] sm:h-[300px] md:h-[500px]">
          {banners.map((banner, index) => (
            <div
              key={banner._id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <a href={banner.link_to} className="block w-full h-full">
                <img
                  src={banner.image_url}
                  alt="Banner"
                  // w-full h-full object-cover: Đảm bảo ảnh phủ kín 100% khung hình
                  className="w-full h-full object-cover"
                />
              </a>
            </div>
          ))}

          {/* Nút điều hướng */}
          {banners.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={24} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all shadow-sm ${
                      idx === currentSlide
                        ? "bg-orange-500 w-8"
                        : "bg-white/50 w-2 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* --- SIDE BANNERS (Cột phải) --- */}
        {/* Chiều cao h-[500px] được giữ nguyên */}
        <div className="md:col-span-4 flex-col gap-4 h-[500px] hidden md:flex">
          {/* Ảnh phụ 1 */}
          <div className="flex-1 rounded-2xl overflow-hidden shadow-md relative cursor-pointer group">
            <img
              src={side1}
              alt="Side Banner 1"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Ảnh phụ 2 */}
          <div className="flex-1 rounded-2xl overflow-hidden shadow-md relative cursor-pointer group">
            <img
              src={side2}
              alt="Side Banner 2"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;