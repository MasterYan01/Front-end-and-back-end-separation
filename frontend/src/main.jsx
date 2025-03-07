import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login.jsx';
import Products from './Products.jsx';
import Register from './Register.jsx'; // 新增 Register
// ----- 產品詳情頁面功能開始 -----
import ProductDetail from './ProductDetail.jsx'; // 新增導入
// ----- 產品詳情頁面功能結束 -----
import 'bootstrap/dist/css/bootstrap.min.css';
// ----- 數據統計儀表板功能開始 -----
import Dashboard from './Dashboard.jsx'; // 新增導入
// ----- 數據統計儀表板功能結束 -----
function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    if (!token) {
      localStorage.removeItem('token');
    }
  }, [token]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register setToken={setToken} />} /> {/* 新增註冊路由 */}
        <Route path="/products" element={<Products token={token} setToken={setToken} />} />
        <Route path="/products/:id" element={<ProductDetail token={token} />} />
        <Route path="/dashboard" element={<Dashboard token={token} />} />
        <Route path="/" element={<Login setToken={setToken} />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);