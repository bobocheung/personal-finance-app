import express from 'express';
import Transaction from '../models/Transaction';
import { auth } from '../middleware/auth';

const router = express.Router();

// 獲取所有交易
router.get('/', auth, async (req: any, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: '獲取交易記錄失敗' });
  }
});

// 創建新交易
router.post('/', auth, async (req: any, res) => {
  try {
    const transaction = new Transaction({
      ...req.body,
      user: req.user._id,
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: '創建交易失敗' });
  }
});

// 更新交易
router.patch('/:id', auth, async (req: any, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: '找不到交易記錄' });
    }

    Object.assign(transaction, req.body);
    await transaction.save();
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ message: '更新交易失敗' });
  }
});

// 刪除交易
router.delete('/:id', auth, async (req: any, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: '找不到交易記錄' });
    }

    res.json({ message: '交易已刪除' });
  } catch (error) {
    res.status(500).json({ message: '刪除交易失敗' });
  }
});

// 獲取交易統計
router.get('/stats', auth, async (req: any, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query: any = { user: req.user._id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const transactions = await Transaction.find(query);
    
    const stats = {
      totalIncome: 0,
      totalExpense: 0,
      byCategory: {} as Record<string, { income: number; expense: number }>,
    };

    transactions.forEach((transaction) => {
      const { type, amount, category } = transaction;
      
      if (type === 'income') {
        stats.totalIncome += amount;
        stats.byCategory[category] = stats.byCategory[category] || { income: 0, expense: 0 };
        stats.byCategory[category].income += amount;
      } else {
        stats.totalExpense += amount;
        stats.byCategory[category] = stats.byCategory[category] || { income: 0, expense: 0 };
        stats.byCategory[category].expense += amount;
      }
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: '獲取統計數據失敗' });
  }
});

export default router; 