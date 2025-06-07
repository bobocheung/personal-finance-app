import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { auth } from '../middleware/auth';

const router = express.Router();

// 註冊
router.post('/register', async (req, res) => {
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
      { _id: user._id.toString() },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: '註冊失敗' });
  }
});

// 登入
router.post('/login', async (req, res) => {
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
      { _id: user._id.toString() },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: '登入失敗' });
  }
});

// 獲取當前用戶信息
router.get('/me', auth, async (req: any, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: '獲取用戶信息失敗' });
  }
});

export default router; 