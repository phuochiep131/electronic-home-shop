import React from "react";
import { Filter } from "lucide-react";

const FilterSidebar = ({
  priceRange,
  setPriceRange,
  selectedBrands,
  handleBrandToggle,
}) => {
  // Cấu hình các khoảng giá
  const priceOptions = [
    { value: "all", label: "Tất cả" },
    { value: "under-2m", label: "Dưới 2 triệu" },
    { value: "2m-5m", label: "Từ 2 - 5 triệu" },
    { value: "5m-10m", label: "Từ 5 - 10 triệu" },
    { value: "above-10m", label: "Trên 10 triệu" },
  ];

  // Cấu hình thương hiệu (Vì Schema chưa có field brand, ta sẽ lọc theo tên)
  const brandOptions = [
    "Samsung",
    "Panasonic",
    "LG",
    "Sony",
    "Daikin",
    "Apple",
    "Xiaomi",
  ];

  return (
    <aside className="w-full lg:w-1/4 flex-shrink-0 space-y-6">
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm sticky top-24">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
          <Filter size={18} /> Bộ lọc tìm kiếm
        </h3>

        {/* --- LỌC THEO GIÁ --- */}
        <div className="mb-6">
          <h4 className="font-medium text-sm text-gray-700 mb-3">Khoảng giá</h4>
          <div className="space-y-2">
            {priceOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="price"
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  checked={priceRange === option.value}
                  onChange={() => setPriceRange(option.value)}
                />
                <span className="text-sm text-gray-600 group-hover:text-blue-600">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* --- LỌC THEO THƯƠNG HIỆU --- */}
        <div>
          <h4 className="font-medium text-sm text-gray-700 mb-3">
            Thương hiệu
          </h4>
          <div className="space-y-2">
            {brandOptions.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                />
                <span className="text-sm text-gray-600 group-hover:text-blue-600">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
