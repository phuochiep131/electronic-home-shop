import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, message, Radio, Input, Select, Pagination } from "antd";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import "./Products.css";

const { Search } = Input;
const { Option } = Select;

function Products() {
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { state } = useAuth();
  const { currentUser } = state;

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      setSpinning(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/products"),
          axios.get("http://localhost:5000/api/categories"),
        ]);
        setAllProducts(productsRes.data);
        setDisplayedProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        messageApi.error("Không thể tải dữ liệu trang sản phẩm!");
      } finally {
        setSpinning(false);
      }
    };
    fetchData();
  }, [messageApi]);

  useEffect(() => {
    let filtered = [...allProducts];

    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category_id._id === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.product_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOrder === "price-asc") {
      filtered.sort((a, b) => a.price * (1 - a.discount / 100) - b.price * (1 - b.discount / 100));
    } else if (sortOrder === "price-desc") {
      filtered.sort((a, b) => b.price * (1 - b.discount / 100) - a.price * (1 - a.discount / 100));
    }

    setDisplayedProducts(filtered);
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, sortOrder, allProducts]);

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
            { productId, quantity: 1 },
            { withCredentials: true }
        );
        messageApi.success("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (error) {
        messageApi.error(error.response?.data?.error || "Có lỗi xảy ra!");
    } finally {
        setSpinning(false);
    }
  };
  
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = displayedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="products-page">
      {contextHolder}
      <Spin spinning={spinning} fullscreen />
      
      <div className="products-page__container">
        {/* Sidebar bộ lọc */}
        <aside className="products-page__sidebar">
          <div className="products-page__filter-group">
            <h3>Tìm kiếm</h3>
            <Search
              placeholder="Nhập tên sản phẩm..."
              onSearch={(value) => setSearchTerm(value)}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
          <div className="products-page__filter-group">
            <h3>Danh mục sản phẩm</h3>
            <Radio.Group
              onChange={(e) => setSelectedCategory(e.target.value)}
              value={selectedCategory}
            >
              <Radio value="all">Tất cả</Radio>
              {categories.map((cat) => (
                <Radio key={cat._id} value={cat._id}>
                  {cat.category_name}
                </Radio>
              ))}
            </Radio.Group>
          </div>
        </aside>

        <main className="products-page__main">
          <div className="products-page__toolbar">
            <p>{displayedProducts.length} sản phẩm được tìm thấy</p>
            <Select defaultValue="default" style={{ width: 200 }} onChange={(value) => setSortOrder(value)}>
              <Option value="default">Sắp xếp mặc định</Option>
              <Option value="price-asc">Giá: Thấp đến Cao</Option>
              <Option value="price-desc">Giá: Cao đến Thấp</Option>
            </Select>
          </div>
          
          <div className="products-page__list">
             {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                    <div className="product-card-v2" key={product._id}>
                        <div className="product-card-v2__image">
                            <img src={product.image_url} alt={product.product_name} />
                            {product.discount > 0 && <div className="discount-tag">-{product.discount}%</div>}
                        </div>
                        <div className="product-card-v2__info">
                            <h3>{product.product_name}</h3>
                            <div className="product-card-v2__price-container">
                            {product.discount > 0 ? (
                                <>
                                <p className="product-card-v2__new-price">{(product.price * (1 - product.discount / 100)).toLocaleString("vi-VN")} đ</p>
                                <p className="product-card-v2__old-price">{product.price.toLocaleString("vi-VN")} đ</p>
                                </>
                            ) : (
                                <p className="product-card-v2__price">{product.price.toLocaleString("vi-VN")} đ</p>
                            )}
                            </div>
                        </div>
                        <div className="product-card-v2__actions">
                            <button className="product-card-v2__detail-btn" onClick={() => navigate(`/products/${product._id}`)}>Chi tiết</button>
                            <button className="product-card-v2__add-btn" onClick={() => handleAddToCart(product._id)}>Thêm vào giỏ</button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="products-page__no-products">
                    <h3>Không tìm thấy sản phẩm phù hợp.</h3>
                    <p>Vui lòng thử lại với từ khóa hoặc bộ lọc khác.</p>
                </div>
            )}
          </div>
          
          <div className="products-page__pagination">
             <Pagination
                current={currentPage}
                total={displayedProducts.length}
                pageSize={productsPerPage}
                onChange={handlePageChange}
                showSizeChanger={false}
             />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Products;