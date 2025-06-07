import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

// 路由導入
import authRoutes from './routes/auth';
import transactionRoutes from './routes/transactions';
import budgetRoutes from './routes/budgets';

dotenv.config();

const app = express();

// 中間件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);

// 數據庫連接
const MONGODB_URI = process.env.MONGODB_URI as string || 'mongodb://localhost:27017/finance-tracker';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('已連接到 MongoDB'))
  .catch((err: Error) => console.error('MongoDB 連接錯誤:', err));

// 錯誤處理中間件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: '伺服器錯誤' });
});

const PORT = parseInt(process.env.PORT || '5000', 10);
app.listen(PORT, () => {
  console.log(`伺服器運行在端口 ${PORT}`);
}); 