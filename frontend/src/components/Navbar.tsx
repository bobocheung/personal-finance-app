import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus(); // Check on component mount

    window.addEventListener('storage', checkLoginStatus); // Listen for storage changes

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="bg-zinc-900 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-gray-50 text-2xl font-bold">
          個人理財追蹤器
        </Link>
        <div>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="text-gray-200 px-4 py-2 rounded-md hover:bg-gray-700 transition duration-300">
                儀表板
              </Link>
              <Link to="/transactions" className="text-gray-200 px-4 py-2 rounded-md hover:bg-gray-700 transition duration-300 ml-4">
                交易
              </Link>
              <Link to="/transactions/add" className="text-gray-200 px-4 py-2 rounded-md hover:bg-gray-700 transition duration-300 ml-4">
                新增交易
              </Link>
              {/* <Link to="/budgets" className="text-gray-200 px-4 py-2 rounded-md hover:bg-gray-700 transition duration-300 ml-4">
                預算
              </Link> */}
              <button
                onClick={handleLogout}
                className="text-gray-200 px-4 py-2 rounded-md hover:bg-gray-700 transition duration-300 ml-4"
              >
                登出
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-200 px-4 py-2 rounded-md hover:bg-gray-700 transition duration-300">
                登入
              </Link>
              <Link to="/register" className="text-gray-200 px-4 py-2 rounded-md hover:bg-gray-700 transition duration-300 ml-4">
                註冊
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 