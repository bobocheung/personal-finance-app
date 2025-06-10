import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import Transactions from './pages/Transactions';
// import Budgets from './pages/Budgets'; // 移除 Budgets 導入
import ProtectedRoute from './components/ProtectedRoute';
import Notification from './components/Notification';
import LoadingSpinner from './components/LoadingSpinner';
import { setLoadingCallbacks } from './services/api';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-4 text-center mt-10">
      <h1 className="text-4xl font-bold text-gray-50">歡迎來到個人理財追蹤器</h1>
      <p className="mt-4 text-lg text-gray-300">輕鬆管理您的收入、支出和預算。</p>
      <p className="mt-2 text-md text-gray-400">請透過導覽列的連結登入或註冊，開始您的理財之旅。</p>
    </div>
  );
};

const App: React.FC = () => {
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info'; show: boolean } | null>(null);
  const [loadingCount, setLoadingCount] = useState(0);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type, show: true });
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  const incrementLoading = () => {
    setLoadingCount((prev) => prev + 1);
  };

  const decrementLoading = () => {
    setLoadingCount((prev) => Math.max(0, prev - 1));
  };

  useEffect(() => {
    setLoadingCallbacks(incrementLoading, decrementLoading);
  }, []);

  return (
    <Router basename={process.env.NODE_ENV === 'production' ? '/personal-finance-app' : '/'}>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login showNotification={showNotification} />} />
          <Route path="/register" element={<Register showNotification={showNotification} />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/transactions/add" element={<ProtectedRoute><AddTransaction showNotification={showNotification} /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          {/* <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} /> */}
          {/* 未來這裡可以添加交易、預算等路由 */}
        </Routes>
      </main>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}
      {loadingCount > 0 && <LoadingSpinner />}
    </Router>
  );
};

export default App;
