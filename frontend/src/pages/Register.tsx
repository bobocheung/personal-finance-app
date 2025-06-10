import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

interface RegisterProps {
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

const Register: React.FC<RegisterProps> = ({ showNotification }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setLoading(true); // Set loading state

    if (password !== confirmPassword) {
      const errorMessage = '密碼和確認密碼不匹配！';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      setLoading(false);
      return;
    }

    try {
      const data = await registerUser({ name, email, password });
      console.log('註冊成功', data);
      setTimeout(() => {
        navigate('/login'); // 註冊成功後跳轉到登入頁面
      }, 2000);
    } catch (err: any) {
      console.error('註冊失敗', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || '註冊失敗，請重試。';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false); // Clear loading state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-50">
            建立您的帳戶
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">姓名</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="input-field rounded-t-md"
                placeholder="姓名"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">電子郵件地址</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-field"
                placeholder="電子郵件地址"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">密碼</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="input-field"
                placeholder="密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">確認密碼</label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="input-field rounded-b-md"
                placeholder="確認密碼"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-darkPrimary-600 hover:bg-darkPrimary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-darkPrimary-500"
              disabled={loading}
            >
              {loading ? '註冊中...' : '註冊'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <Link to="/login" className="font-medium text-darkPrimary-400 hover:text-darkPrimary-300">
            已經有帳戶？登入
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register; 