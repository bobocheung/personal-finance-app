import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// 擴展 Request 型別以包含 user 屬性
export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const auth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error('Authorization token not found.');
    }

    // 明確轉換解碼後的 payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { _id: string };

    const user = await User.findById(decoded._id);

    if (!user) {
      throw new Error('User not found.');
    }

    req.user = user;
    next();
  } catch (error) {
    // 開發時印出實際錯誤以便調試
    console.error('Authentication Error:', error);
    res.status(401).json({ message: '認證失敗，請重新登入。' });
  }
}; 