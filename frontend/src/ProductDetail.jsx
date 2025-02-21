// src/ProductDetail.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function ProductDetail({ token }) {
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProduct();
    }
  }, [token, id, navigate]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}/`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/products');
    }
  };

  if (!product) {
    return (
      // ----- 美化產品詳情頁面開始 -----
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">載入中...</span>
        </div>
        <p className="mt-3">載入中...</p>
      </div>
      // ----- 美化產品詳情頁面結束 -----
    );
  }

  return (
    // ----- 美化產品詳情頁面開始 -----
    <div className="container my-5">
      <div className="row">
        {/* 左側產品圖片 */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-body p-0">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="img-fluid rounded"
                  style={{ maxHeight: '500px', objectFit: 'cover', width: '100%' }}
                />
              ) : (
                <div
                  className="bg-light d-flex align-items-center justify-content-center rounded"
                  style={{ height: '500px' }}
                >
                  <span className="text-muted">無圖片</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 右側產品資訊 */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h1 className="card-title mb-3 fw-bold">{product.name}</h1>
              <h3 className="text-danger mb-4 fw-semibold">{product.price} 元</h3>
              <div className="mb-4">
                <h5 className="fw-semibold">產品描述</h5>
                <p className="text-muted">{product.description}</p>
              </div>
              <div className="d-flex gap-3">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate('/products')}
                >
                  返回產品列表
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // ----- 美化產品詳情頁面結束 -----
  );
}

export default ProductDetail;