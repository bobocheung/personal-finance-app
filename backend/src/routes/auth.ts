import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { auth, AuthenticatedRequest } from '../middleware/auth';
import mongoose from 'mongoose';

const router = express.Router();

// 註冊
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // 檢查用戶是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: '此電子郵件已被註冊' });
    }

    // 創建新用戶
    const user = new User({
      email,
      password,
      name,
    });

    await user.save();

    // 生成 JWT
    const token = jwt.sign(
      { _id: (user._id as mongoose.Types.ObjectId).toHexString() },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id.toHexString(),
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('註冊失敗:', error);
    res.status(500).json({ message: '註冊失敗' });
  }
});

// 登入
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 查找用戶
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: '電子郵件或密碼錯誤' });
    }

    // 驗證密碼
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: '電子郵件或密碼錯誤' });
    }

    // 生成 JWT
    const token = jwt.sign(
      { _id: (user._id as mongoose.Types.ObjectId).toHexString() },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id.toHexString(),
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('登入失敗:', error);
    res.status(500).json({ message: '登入失敗' });
  }
});

// 獲取當前用戶信息
router.get('/me', auth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: '未經認證的使用者' });
    }
    res.json({
      user: {
        id: (req.user._id as mongoose.Types.ObjectId).toHexString(),
        email: req.user.email,
        name: req.user.name,
      },
    });
  } catch (error) {
    console.error('獲取用戶信息失敗:', error);
    res.status(500).json({ message: '獲取用戶信息失敗' });
  }
});

export default router; 