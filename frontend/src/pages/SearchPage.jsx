import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Home,
  ChevronRight,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";

import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");

  // State dữ liệu gốc từ API
  const [originalProducts, setOriginalProducts] = useState([]);

  // State trạng thái loading
  const [loading, setLoading] = useState(true);

  // --- STATE BỘ LỌC ---
  const [sortOption, setSortOption] = useState("default");
  const [priceRange, setPriceRange] = useState("all");
  const [selectedBrands, setSelectedBrands] = useState([]);

  // 1. Fetch dữ liệu khi keyword thay đổi
  useEffect(() => {
    const fetchSearch = async () => {
      setLoading(true);
      try {
        // Gọi API tìm kiếm theo keyword
        const res = await axios.get(
          `http://localhost:5000/api/products?keyword=${keyword}`
        );
        setOriginalProducts(res.data);
      } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
        setOriginalProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (keyword) fetchSearch();
  }, [keyword]);

  // 2. Hàm xử lý chọn thương hiệu (Checkbox logic)
  const handleBrandToggle = (brand) => {
    setSelectedBrands(
      (prev) =>
        prev.includes(brand)
          ? prev.filter((b) => b !== brand) // Bỏ chọn
          : [...prev, brand] // Chọn thêm
    );
  };

  // 3. LOGIC LỌC VÀ SẮP XẾP (Chạy mỗi khi state filter thay đổi)
  const filteredProducts = useMemo(() => {
    let result = [...originalProducts];

    // --- A. Lọc theo Thương hiệu (Tìm trong tên sản phẩm vì Schema chưa có field brand) ---
    if (selectedBrands.length > 0) {
      result = result.filter((product) =>
        selectedBrands.some((brand) =>
          product.product_name.toLowerCase().includes(brand.toLowerCase())
        )
      );
    }

    // --- B. Lọc theo Giá (Tính giá sau giảm) ---
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

    // --- C. Sắp xếp ---
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
  }, [originalProducts, priceRange, selectedBrands, sortOption]);

  // --- Render Loading ---
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
          <span className="text-gray-900">Tìm kiếm: "{keyword}"</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- SIDEBAR --- */}
          <FilterSidebar
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedBrands={selectedBrands}
            handleBrandToggle={handleBrandToggle}
          />

          {/* --- MAIN CONTENT --- */}
          <main className="flex-1">
            {/* Header kết quả */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-xl font-bold text-gray-800">
                Kết quả tìm kiếm: "{keyword}"
                <span className="text-gray-500 text-base font-normal ml-2">
                  ({filteredProducts.length} sản phẩm)
                </span>
              </h1>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 hidden md:block">
                  Sắp xếp:
                </span>
                <div className="relative">
                  <select
                    className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8 cursor-pointer"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="default">Liên quan nhất</option>
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

            {/* Grid sản phẩm */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
                {filteredProducts.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                  <SlidersHorizontal size={32} />
                </div>
                <p className="text-gray-500 text-lg mb-2">
                  Không tìm thấy sản phẩm nào phù hợp.
                </p>
                <p className="text-gray-400 text-sm">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
                </p>

                <button
                  onClick={() => {
                    setPriceRange("all");
                    setSelectedBrands([]);
                    setSortOption("default");
                  }}
                  className="mt-6 text-blue-600 font-bold hover:underline"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
