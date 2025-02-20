import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // 添加 Link
import 'bootstrap/dist/css/bootstrap.min.css';

function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login/', { username, password });
      const token = response.data.access;
      setToken(token);
      localStorage.setItem('token', token);
      navigate('/products');
    } catch (err) {
      setError('登入失敗，請檢查用戶名或密碼');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">登入</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="用戶名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary">登入</button>
      </form>
      <p className="mt-3">
        還沒有帳號？<Link to="/register">點擊註冊</Link>
      </p>
    </div>
  );
}

export default Login;