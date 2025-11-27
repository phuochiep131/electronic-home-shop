import React from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";

const ProductManager = () => {
  // Dữ liệu giả, sau này bạn thay bằng API axios.get('/api/products')
  const products = [
    {
      id: 1,
      name: "Tủ lạnh Samsung 236L",
      category: "Tủ lạnh",
      price: 6490000,
      stock: 10,
    },
    {
      id: 2,
      name: "Máy giặt LG AI DD 9kg",
      category: "Máy giặt",
      price: 8990000,
      stock: 5,
    },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Danh sách sản phẩm</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-sm">
          <Plus size={18} /> Thêm mới
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option>Tất cả danh mục</option>
          <option>Tủ lạnh</option>
          <option>Máy giặt</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold">
            <tr>
              <th className="py-4 px-6">ID</th>
              <th className="py-4 px-6">Tên sản phẩm</th>
              <th className="py-4 px-6">Danh mục</th>
              <th className="py-4 px-6">Giá</th>
              <th className="py-4 px-6">Kho</th>
              <th className="py-4 px-6 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-6">#{product.id}</td>
                <td className="py-4 px-6 font-medium text-gray-800">
                  {product.name}
                </td>
                <td className="py-4 px-6">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {product.category}
                  </span>
                </td>
                <td className="py-4 px-6">{product.price.toLocaleString()}đ</td>
                <td className="py-4 px-6">{product.stock}</td>
                <td className="py-4 px-6 flex justify-center gap-2">
                  <button className="p-2 bg-yellow-50 text-yellow-600 rounded hover:bg-yellow-100">
                    <Edit size={16} />
                  </button>
                  <button className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManager;
