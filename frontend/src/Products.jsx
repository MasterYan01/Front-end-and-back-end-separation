import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function Products({ token }) {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', description: '' });
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login'); // 未登入則跳轉
    } else {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // 設置 token
      fetchProducts();
    }
  }, [token, navigate]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products/');
      setProducts(response.data);
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

  return (
    <div className="container mt-5">
      <h1 className="mb-4">電商產品管理</h1>
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

export default Products;