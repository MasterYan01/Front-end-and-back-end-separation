import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function Products({ token, setToken }) {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [page, setPage] = useState(1); // 當前頁數
  const [pageInfo, setPageInfo] = useState({ next: null, previous: null, count: 0 }); // 分頁資訊
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProducts();
    }
  }, [token, navigate, searchTerm, priceMin, priceMax, page]); // 頁數改變時重新獲取

  const fetchProducts = async () => {
    try {
      const params = { page };
      if (searchTerm) params.search = searchTerm;
      if (priceMin) params.price_min = priceMin;
      if (priceMax) params.price_max = priceMax;
      const response = await axios.get('/api/products/', { params });
      setProducts(response.data.results); // 分頁數據在 results 中
      setPageInfo({
        next: response.data.next,
        previous: response.data.previous,
        count: response.data.count,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/api/products/${editId}/`, formData);
        setEditId(null);
      } else {
        await axios.post('/api/products/', formData);
      }
      setFormData({ name: '', price: '', description: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setFormData({ name: product.name, price: product.price, description: product.description });
    setEditId(product.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/products/${id}/`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // 分頁控制
  const goToPreviousPage = () => {
    if (pageInfo.previous) setPage(page - 1);
  };

  const goToNextPage = () => {
    if (pageInfo.next) setPage(page + 1);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>電商產品管理</h1>
        <button className="btn btn-secondary" onClick={handleLogout}>
          登出
        </button>
      </div>

      {/* 搜索與篩選區域 */}
      <div className="row mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="搜索產品名稱或描述..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="價格下限"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="價格上限"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
          />
        </div>
      </div>

      {/* 產品表單 */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="產品名稱"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col">
            <input
              type="number"
              name="price"
              className="form-control"
              placeholder="價格"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col">
            <input
              type="text"
              name="description"
              className="form-control"
              placeholder="描述"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-primary">
              {editId ? '更新' : '新增'}
            </button>
          </div>
        </div>
      </form>

      {/* 產品列表 */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>名稱</th>
            <th>價格</th>
            <th>描述</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.description}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(product)}
                >
                  編輯
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(product.id)}
                >
                  刪除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 分頁控制 */}
      <div className="d-flex justify-content-between mb-4">
        <button
          className="btn btn-outline-primary"
          onClick={goToPreviousPage}
          disabled={!pageInfo.previous}
        >
          上一頁
        </button>
        <span>第 {page} 頁 (共 {Math.ceil(pageInfo.count / 5)} 頁)</span>
        <button
          className="btn btn-outline-primary"
          onClick={goToNextPage}
          disabled={!pageInfo.next}
        >
          下一頁
        </button>
      </div>
    </div>
  );
}

export default Products;