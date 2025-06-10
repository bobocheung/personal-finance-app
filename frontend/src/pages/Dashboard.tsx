import React, { useEffect, useState } from 'react';
import { getMe, getTransactions, getTransactionsStats } from '../services/api';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';

// 註冊 Chart.js 組件
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

interface UserInfo {
  id: string;
  email: string;
  name: string;
}

interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string; // ISO string
  user: string; // User ID
  createdAt: string;
}

interface TransactionStats {
  totalIncome: number;
  totalExpense: number;
  byCategory: Record<string, { income: number; expense: number }>;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pieChartData = {
    labels: ['收入', '支出'],
    datasets: [
      {
        data: [stats?.totalIncome || 0, stats?.totalExpense || 0],
        backgroundColor: ['#10B981', '#EF4444'], // green-500, red-500
        borderColor: ['#10B981', '#EF4444'],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#D1D5DB', // text-gray-300
        },
      },
      title: {
        display: true,
        text: '收入 vs 支出概覽',
        color: '#F9FAFB', // text-gray-50
      },
    },
  };

  const lineChartData = {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月'], // 這些標籤應根據實際數據動態生成
    datasets: [
      {
        label: '結餘',
        data: [1000, 1200, 900, 1500, 1100, 1800], // 這些數據應根據實際數據動態生成
        fill: false,
        borderColor: '#6366F1', // darkPrimary-400
        tension: 0.1,
        pointBackgroundColor: '#6366F1',
        pointBorderColor: '#6366F1',
        pointHoverBackgroundColor: '#4338CA',
        pointHoverBorderColor: '#4338CA',
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#D1D5DB',
        },
      },
      title: {
        display: true,
        text: '月度結餘趨勢',
        color: '#F9FAFB',
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#D1D5DB',
        },
        grid: {
          color: '#4B5563', // gray-600
        },
      },
      y: {
        ticks: {
          color: '#D1D5DB',
        },
        grid: {
          color: '#4B5563',
        },
      },
    },
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // 獲取使用者資訊
        const userData = await getMe();
        setUser(userData.user);
        
        // 獲取交易統計數據
        const statsData = await getTransactionsStats();
        setStats(statsData);

        // 獲取最新交易記錄
        const latestTransactions = await getTransactions();
        // 只顯示最新的5筆交易
        setTransactions(latestTransactions.slice(0, 5)); 

      } catch (err: any) {
        console.error('獲取儀表板數據失敗:', err.response?.data || err.message);
        setError(err.response?.data?.message || '無法加載儀表板數據。');
        if (err.response && err.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // navigate('/login'); // 或者使用 useNavigate
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalIncome = stats?.totalIncome || 0;
  const totalExpense = stats?.totalExpense || 0;
  const totalBalance = totalIncome - totalExpense;

  if (loading) {
    return <div className="text-center text-gray-400 mt-10">載入中...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">錯誤: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6 mt-8">
      <h1 className="text-3xl font-bold text-gray-50 mb-6">歡迎，{user?.name || '使用者'}！</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* 收入卡片 */}
        <div className="card bg-gray-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-lg font-semibold text-gray-300 mb-2">總收入</h2>
          <p className="text-2xl font-bold text-green-400">${totalIncome.toFixed(2)}</p>
        </div>

        {/* 支出卡片 */}
        <div className="card bg-gray-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-lg font-semibold text-gray-300 mb-2">總支出</h2>
          <p className="text-2xl font-bold text-red-400">${totalExpense.toFixed(2)}</p>
        </div>

        {/* 結餘卡片 */}
        <div className="card bg-gray-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-lg font-semibold text-gray-300 mb-2">總結餘</h2>
          <p className="text-2xl font-bold text-darkPrimary-400">${totalBalance.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 收入與支出圖表 */}
        <div className="card bg-gray-800 p-6 rounded-lg shadow-xl h-96">
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>

        {/* 月度結餘趨勢圖表 */}
        <div className="card bg-gray-800 p-6 rounded-lg shadow-xl h-96">
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>

      {/* 最新交易列表 */}
      <div className="card bg-gray-800 p-6 rounded-lg shadow-xl mt-6">
        <h2 className="text-lg font-semibold text-gray-300 mb-4">最新交易</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-400">沒有交易記錄。</p>
        ) : (
          <ul>
            {transactions.map((t) => (
              <li key={t._id} className="text-gray-300 border-b border-gray-700 py-2">
                {t.description}: {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 