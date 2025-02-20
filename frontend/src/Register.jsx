import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Register({ setToken }) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/register/', formData);
      // 註冊成功後自動登入
      const response = await axios.post('/api/login/', {
        username: formData.username,
        password: formData.password
      });
      const token = response.data.access;
      setToken(token);
      localStorage.setItem('token', token);
      navigate('/products');
    } catch (err) {
      setError('註冊失敗，請檢查輸入內容');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">註冊</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            name="username"
            className="form-control"
            placeholder="用戶名"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="電子郵件"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="密碼"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary">註冊</button>
      </form>
      <p className="mt-3">
        已有帳號？<Link to="/login">點擊登入</Link>
      </p>
    </div>
  );
}

export default Register;