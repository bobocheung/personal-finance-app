import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTransaction } from '../services/api';

interface AddTransactionProps {
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ showNotification }) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState<number | string>('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!amount || Number(amount) <= 0) {
      const errorMessage = '金額必須是大於零的數字。';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      setLoading(false);
      return;
    }
    if (!description.trim()) {
      const errorMessage = '描述不能為空。';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      setLoading(false);
      return;
    }
    if (!category.trim()) {
      const errorMessage = '類別不能為空。';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      setLoading(false);
      return;
    }

    try {
      const transactionData = {
        type,
        amount: Number(amount),
        description,
        category,
        date: new Date(date), // 將日期字串轉換為 Date 物件
      };
      await addTransaction(transactionData);
      setTimeout(() => {
        navigate('/dashboard'); // 成功後導航到儀表板
      }, 1500);
    } catch (err: any) {
      console.error('新增交易失敗:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || '新增交易失敗，請重試。';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-50">
            新增交易
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-300">交易類型</label>
              <select
                id="type"
                name="type"
                required
                className="input-field mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-700 focus:outline-none focus:ring-darkPrimary-500 focus:border-darkPrimary-500 sm:text-sm rounded-md"
                value={type}
                onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                disabled={loading}
              >
                <option value="expense">支出</option>
                <option value="income">收入</option>
              </select>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-300">金額</label>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                required
                className="input-field mt-1"
                placeholder="例如：50.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">描述</label>
              <input
                id="description"
                name="description"
                type="text"
                required
                className="input-field mt-1"
                placeholder="例如：咖啡、薪水"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300">類別</label>
              <input
                id="category"
                name="category"
                type="text"
                required
                className="input-field mt-1"
                placeholder="例如：餐飲、交通、工作"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-300">日期</label>
              <input
                id="date"
                name="date"
                type="date"
                required
                className="input-field mt-1"
                value={date}
                onChange={(e) => setDate(e.target.value)}
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
              {loading ? '新增中...' : '新增交易'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction; 