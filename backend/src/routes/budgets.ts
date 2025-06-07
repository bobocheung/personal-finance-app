import express, { Request, Response } from 'express';
import Budget, { IBudget } from '../models/Budget';
import Transaction, { ITransaction } from '../models/Transaction';
import { auth, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// 獲取所有預算
router.get('/', auth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const budgets: IBudget[] = await Budget.find({ user: req.user?._id })
      .sort({ startDate: -1 });
    res.json(budgets);
  } catch (error) {
    console.error('獲取預算失敗:', error);
    res.status(500).json({ message: '獲取預算失敗' });
  }
});

// 創建新預算
router.post('/', auth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const budget = new Budget({
      ...req.body,
      user: req.user?._id,
    });
    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    console.error('創建預算失敗:', error);
    res.status(400).json({ message: '創建預算失敗' });
  }
});

// 更新預算
router.patch('/:id', auth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id as string,
      user: req.user?._id,
    });

    if (!budget) {
      return res.status(404).json({ message: '找不到預算' });
    }

    Object.assign(budget, req.body);
    await budget.save();
    res.json(budget);
  } catch (error) {
    console.error('更新預算失敗:', error);
    res.status(400).json({ message: '更新預算失敗' });
  }
});

// 刪除預算
router.delete('/:id', auth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id as string,
      user: req.user?._id,
    });

    if (!budget) {
      return res.status(404).json({ message: '找不到預算' });
    }

    res.json({ message: '預算已刪除' });
  } catch (error) {
    console.error('刪除預算失敗:', error);
    res.status(500).json({ message: '刪除預算失敗' });
  }
});

// 獲取預算使用情況
router.get('/:id/usage', auth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id as string,
      user: req.user?._id,
    });

    if (!budget) {
      return res.status(404).json({ message: '找不到預算' });
    }

    const transactions: ITransaction[] = await Transaction.find({
      user: req.user?._id,
      category: budget.category,
      date: {
        $gte: budget.startDate,
        $lte: budget.endDate,
      },
      type: 'expense',
    });

    const totalSpent = transactions.reduce((sum: number, transaction: ITransaction) => sum + transaction.amount, 0);
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
    console.error('獲取預算使用情況失敗:', error);
    res.status(500).json({ message: '獲取預算使用情況失敗' });
  }
});

export default router; 