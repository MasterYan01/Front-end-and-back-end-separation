// src/Dashboard.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Bar } from 'react-chartjs-2'; // 導入 Bar 圖表
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; // 導入 Chart.js 組件

// ----- 數據統計儀表板功能開始 -----
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend); // 註冊 Chart.js 組件

function Dashboard({ token }) {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchStats();
    }
  }, [token, navigate]);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats/');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      navigate('/products'); // 若失敗，返回產品列表
    }
  };

  if (!stats) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">載入中...</span>
        </div>
        <p className="mt-3">載入中...</p>
      </div>
    );
  }

  // 圖表數據
  const chartData = {
    labels: ['產品總數', '總價值'],
    datasets: [
      {
        label: '統計數據',
        data: [stats.total_products, stats.total_value],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '產品統計概覽' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4 text-center fw-bold">數據統計儀表板</h1>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title fw-semibold">產品總數</h5>
              <p className="card-text display-4 text-primary">{stats.total_products}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title fw-semibold">總價值</h5>
              <p className="card-text display-4 text-success">{stats.total_value.toFixed(2)} 元</p>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigate('/products')}
        >
          返回產品列表
        </button>
      </div>
    </div>
  );
}
// ----- 數據統計儀表板功能結束 -----

export default Dashboard;