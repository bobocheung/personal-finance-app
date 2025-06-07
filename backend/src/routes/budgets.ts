import express from 'express';
import Budget from '../models/Budget';
import Transaction from '../models/Transaction';
import { auth } from '../middleware/auth';

const router = express.Router();

// 獲取所有預算
router.get('/', auth, async (req: any, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id })
      .sort({ startDate: -1 });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: '獲取預算失敗' });
  }
});

// 創建新預算
router.post('/', auth, async (req: any, res) => {
  try {
    const budget = new Budget({
      ...req.body,
      user: req.user._id,
    });
    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    res.status(400).json({ message: '創建預算失敗' });
  }
});

// 更新預算
router.patch('/:id', auth, async (req: any, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({ message: '找不到預算' });
    }

    Object.assign(budget, req.body);
    await budget.save();
    res.json(budget);
  } catch (error) {
    res.status(400).json({ message: '更新預算失敗' });
  }
});

// 刪除預算
router.delete('/:id', auth, async (req: any, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({ message: '找不到預算' });
    }

    res.json({ message: '預算已刪除' });
  } catch (error) {
    res.status(500).json({ message: '刪除預算失敗' });
  }
});

// 獲取預算使用情況
router.get('/:id/usage', auth, async (req: any, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({ message: '找不到預算' });
    }

    const transactions = await Transaction.find({
      user: req.user._id,
      category: budget.category,
      date: {
        $gte: budget.startDate,
        $lte: budget.endDate,
      },
      type: 'expense',
    });

    const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const remaining = budget.amount - totalSpent;
    const percentageUsed = (totalSpent / budget.amount) * 100;

    res.json({
      budget,
      totalSpent,
      remaining,
      percentageUsed,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ message: '獲取預算使用情況失敗' });
  }
});

export default router; 