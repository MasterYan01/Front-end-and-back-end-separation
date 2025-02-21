import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom'; // 更新導入
import { jwtDecode } from 'jwt-decode';
// ----- 即時通知功能開始 -----
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // 導入樣式
// ----- 即時通知功能結束 -----
function Products({ token, setToken }) {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', description: '', image: null, imagePreview: null });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [page, setPage] = useState(1);
  const [pageInfo, setPageInfo] = useState({ next: null, previous: null, count: 0 });
  const [isAdmin, setIsAdmin] = useState(false); // 用於儲存是否為管理員
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const decodedToken = jwtDecode(token); // 解析 token
      setIsAdmin(decodedToken.is_staff); // 從 token 中獲取 is_staff
      fetchProducts();
    }
  }, [token, navigate, searchTerm, priceMin, priceMax, page]);

  const fetchProducts = async () => {
    try {
      const params = { page };
      if (searchTerm) params.search = searchTerm;
      if (priceMin) params.price_min = priceMin;
      if (priceMax) params.price_max = priceMax;
      const response = await axios.get('/api/products/', { params });
      setProducts(response.data.results);
      setPageInfo({
        next: response.data.next,
        previous: response.data.previous,
        count: response.data.count,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      // ----- 即時通知功能開始 -----
      toast.error('無法載入產品列表，請稍後再試');
      // ----- 即時通知功能結束 -----
      
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files[0]) {
      setFormData({ ...formData, image: files[0], imagePreview: URL.createObjectURL(files[0]) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('description', formData.description);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editId) {
        await axios.put(`/api/products/${editId}/`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setEditId(null);
        // ----- 即時通知功能開始 -----
        toast.success('產品更新成功');
        // ----- 即時通知功能結束 -----
      } else {
        await axios.post('/api/products/', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
          
        });
        // ----- 即時通知功能開始 -----
        toast.success('產品新增成功');
        // ----- 即時通知功能結束 -----
      }
      setFormData({ name: '', price: '', description: '', image: null, imagePreview: null });
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      // ----- 即時通知功能開始 -----
      toast.error('操作失敗，請檢查輸入或稍後再試');
      // ----- 即時通知功能結束 -----
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      image: null,
      imagePreview: null,
    });
    setEditId(product.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/products/${id}/`);
      fetchProducts();
      // ----- 即時通知功能開始 -----
      toast.success('產品刪除成功');
      // ----- 即時通知功能結束 -----
    } catch (error) {
      console.error('Error deleting product:', error);
      // ----- 即時通知功能開始 -----
      toast.error('刪除失敗，請稍後再試');
      // ----- 即時通知功能結束 -----
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const goToPreviousPage = () => {
    if (pageInfo.previous) setPage(page - 1);
  };

  const goToNextPage = () => {
    if (pageInfo.next) setPage(page + 1);
  };

  return (
    <div className="container mt-5">
      {/* ----- 即時通知功能開始 ----- */}
      <ToastContainer
        position="top-right" // 通知顯示位置
        autoClose={3000}    // 自動關閉時間（3秒）
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* ----- 即時通知功能結束 ----- */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>電商產品管理</h1>
        {/* ----- 數據統計儀表板功能開始 ----- */}
        {isAdmin && (
            <button
              className="btn btn-outline-info me-2"
              onClick={() => navigate('/dashboard')}
            >
              查看儀表板
            </button>
          )}
          {/* ----- 數據統計儀表板功能結束 ----- */}
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

      {/* 產品表單（僅管理員可見） */}
      {isAdmin && (
        <form onSubmit={handleSubmit} className="mb-4" encType="multipart/form-data">
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
            <div className="col">
              <input
                type="file"
                name="image"
                className="form-control"
                accept="image/*"
                onChange={handleInputChange}
              />
              {formData.imagePreview && (
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  style={{ maxWidth: '100px', height: 'auto', marginTop: '10px' }}
                />
              )}
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-primary">
                {editId ? '更新' : '新增'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* 產品列表 */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>名稱</th>
            <th>價格</th>
            <th>描述</th>
            <th>圖片</th>
            {isAdmin && <th>操作</th>} {/* 僅管理員顯示操作欄 */}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              {/* ----- 產品詳情頁面功能開始 ----- */}
              <td>
                <Link to={`/products/${product.id}`} className="text-primary">
                  {product.name}
                </Link>
              </td>
              {/* ----- 產品詳情頁面功能結束 ----- */}
              <td>{product.price}</td>
              <td>{product.description}</td>
              <td>
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ maxWidth: '100px', height: 'auto' }}
                  />
                )}
              </td>
              {isAdmin && ( // 僅管理員顯示編輯與刪除按鈕
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
              )}
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