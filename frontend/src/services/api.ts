import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Callbacks for global loading state
let _incrementLoading: () => void;
let _decrementLoading: () => void;

export const setLoadingCallbacks = (increment: () => void, decrement: () => void) => {
  _incrementLoading = increment;
  _decrementLoading = decrement;
};

// Request interceptor to add JWT token to headers and increment loading count
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (_incrementLoading) {
      _incrementLoading();
    }
    const token = localStorage.getItem('token');
    if (token) {
      // Directly assign Authorization header, casting config.headers to any to bypass strict type checking
      // This is a workaround if TypeScript is being overly strict with AxiosRequestHeaders type
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    if (_decrementLoading) {
      _decrementLoading();
    }
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally and decrement loading count
api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (_decrementLoading) {
      _decrementLoading();
    }
    return response;
  },
  (error: AxiosError) => {
    if (_decrementLoading) {
      _decrementLoading();
    }
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors, e.g., redirect to login
      console.log('Unauthorized: Token expired or invalid');
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // Also clear user data
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

// --- Auth API calls ---
export const registerUser = async (userData: any) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials: any) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// --- Transactions API calls ---
export const getTransactions = async () => {
  const response = await api.get('/transactions');
  return response.data;
};

export const addTransaction = async (transactionData: any) => {
  const response = await api.post('/transactions', transactionData);
  return response.data;
};

export const getTransactionsStats = async (startDate?: string, endDate?: string) => {
  const params: any = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  const response = await api.get('/transactions/stats', { params });
  return response.data;
};

// --- Budgets API calls ---
// export const getBudgets = async (signal?: AbortSignal) => {
//   const response = await api.get('/budgets', { signal });
//   return response.data;
// };

// export const addBudget = async (budgetData: any, signal?: AbortSignal) => {
//   const response = await api.post('/budgets', budgetData, { signal });
//   return response.data;
// };

export default api; 