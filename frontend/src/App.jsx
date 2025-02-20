import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', description: '' });
  const [editId, setEditId] = useState(null);

  // 獲取產品列表
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products/');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // 處理表單輸入
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 新增或更新產品
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // 更新產品
        await axios.put(`/api/products/${editId}/`, formData);
        setEditId(null);
      } else {
        // 新增產品
        await axios.post('/api/products/', formData);
      }
      setFormData({ name: '', price: '', description: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  // 編輯產品
  const handleEdit = (product) => {
    setFormData({ name: product.name, price: product.price, description: product.description });
    setEditId(product.id);
  };

  // 刪除產品
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/products/${id}/`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">電商產品管理</h1>

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
    </div>
  );
}

export default App;