import mongoose, { Document, Schema } from 'mongoose';

export interface IBudget extends Document {
  user: mongoose.Types.ObjectId;
  category: string;
  amount: number;
  period: 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

const budgetSchema = new Schema<IBudget>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  period: {
    type: String,
    enum: ['monthly', 'yearly'],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 索引
budgetSchema.index({ user: 1, category: 1 });
budgetSchema.index({ user: 1, startDate: 1, endDate: 1 });

export default mongoose.model<IBudget>('Budget', budgetSchema); 