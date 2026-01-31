import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  ChevronRight,
  Home,
  ArrowUpDown,
  SlidersHorizontal,
} from "lucide-react";

// Import Components
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar"; // <--- Import Sidebar dùng chung

const API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000/api";

const CategoryPage = () => {
  const { id } = useParams();

  // State dữ liệu từ API
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  // --- STATE BỘ LỌC & SẮP XẾP ---
  const [sortOption, setSortOption] = useState("default");
  const [priceRange, setPriceRange] = useState("all");
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Fetch dữ liệu API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoryRes, productRes] = await Promise.all([
          axios.get(`${API_URL}/categories/${id}`),
          axios.get(`${API_URL}/products?category=${id}`),
        ]);

        if (categoryRes.data)
          setCategoryName(
            categoryRes.data.name || categoryRes.data.category_name
          );
        setProducts(productRes.data);
      } catch (error) {
        console.error("Lỗi tải dữ liệu danh mục:", error);
        setCategoryName("Không tìm thấy danh mục");
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };

    if (id) {
      // Reset bộ lọc khi chuyển danh mục khác
      setPriceRange("all");
      setSelectedBrands([]);
      setSortOption("default");
      fetchData();
    }
  }, [id]);

  // Hàm toggle chọn thương hiệu
  const handleBrandToggle = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // --- LOGIC LỌC & SẮP XẾP (Client-side) ---
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Lọc theo Thương hiệu (Tìm trong tên sản phẩm)
    if (selectedBrands.length > 0) {
      result = result.filter((product) =>
        selectedBrands.some((brand) =>
          product.product_name.toLowerCase().includes(brand.toLowerCase())
        )
      );
    }

    // 2. Lọc theo Giá (Tính giá sau giảm)
    if (priceRange !== "all") {
      result = result.filter((product) => {
        const finalPrice = product.price * (1 - (product.discount || 0) / 100);

        switch (priceRange) {
          case "under-2m":
            return finalPrice < 2000000;
          case "2m-5m":
            return finalPrice >= 2000000 && finalPrice <= 5000000;
          case "5m-10m":
            return finalPrice > 5000000 && finalPrice <= 10000000;
          case "above-10m":
            return finalPrice > 10000000;
          default:
            return true;
        }
      });
    }

    // 3. Sắp xếp
    if (sortOption !== "default") {
      result.sort((a, b) => {
        const priceA = a.price * (1 - (a.discount || 0) / 100);
        const priceB = b.price * (1 - (b.discount || 0) / 100);

        if (sortOption === "price_asc") return priceA - priceB;
        if (sortOption === "price_desc") return priceB - priceA;
        if (sortOption === "newest")
          return new Date(b.createdAt) - new Date(a.createdAt);
        return 0;
      });
    }

    return result;
  }, [products, priceRange, selectedBrands, sortOption]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center space-x-2 bg-gray-50">
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce delay-100"></div>
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce delay-200"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center text-sm text-gray-500">
          <Link to="/" className="hover:text-blue-600 flex items-center gap-1">
            <Home size={14} /> Trang chủ
          </Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-gray-900 font-medium">{categoryName}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- SIDEBAR BỘ LỌC (Dùng chung Component) --- */}
          <FilterSidebar
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedBrands={selectedBrands}
            handleBrandToggle={handleBrandToggle}
          />

          {/* --- MAIN CONTENT (Right) --- */}
          <main className="flex-1">
            {/* Header & Sort Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-xl font-bold text-gray-800">
                {categoryName}{" "}
                <span className="text-gray-500 text-base font-normal">
                  ({filteredProducts.length} sản phẩm)
                </span>
              </h1>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 hidden md:block">
                  Sắp xếp theo:
                </span>
                <div className="relative">
                  <select
                    className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8 cursor-pointer"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="default">Nổi bật</option>
                    <option value="price_asc">Giá: Thấp đến Cao</option>
                    <option value="price_desc">Giá: Cao đến Thấp</option>
                    <option value="newest">Hàng mới về</option>
                  </select>
                  <ArrowUpDown
                    size={16}
                    className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                  <SlidersHorizontal size={32} />
                </div>
                <p className="text-gray-500 text-lg">
                  Không tìm thấy sản phẩm nào phù hợp bộ lọc.
                </p>
                <button
                  onClick={() => {
                    setPriceRange("all");
                    setSelectedBrands([]);
                    setSortOption("default");
                  }}
                  className="mt-4 text-blue-600 font-medium hover:underline"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}

            {/* Pagination (UI Only - Bạn có thể phát triển thêm logic phân trang sau này) */}
            {filteredProducts.length > 0 && (
              <div className="mt-8 flex justify-center gap-2">
                <button className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-500 disabled:opacity-50">
                  &laquo;
                </button>
                <button className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                  1
                </button>
                <button className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-700 font-medium">
                  2
                </button>
                <button className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-500">
                  &raquo;
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
