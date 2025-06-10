import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

interface LoginProps {
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

const Login: React.FC<LoginProps> = ({ showNotification }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setLoading(true); // Set loading state

    try {
      const data = await loginUser({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('登入成功', data);
      navigate('/dashboard'); // 登入成功後跳轉到儀表板
    } catch (err: any) {
      console.error('登入失敗', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || '登入失敗，請檢查您的憑證。';
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
            登入您的帳戶
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">電子郵件地址</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-field rounded-t-md"
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
                autoComplete="current-password"
                required
                className="input-field rounded-b-md"
                placeholder="密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {loading ? '登入中...' : '登入'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <Link to="/register" className="font-medium text-darkPrimary-400 hover:text-darkPrimary-300">
            還沒有帳戶？註冊
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 