"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Budget_1 = __importDefault(require("../models/Budget"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// 獲取所有預算
router.get('/', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const budgets = yield Budget_1.default.find({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id })
            .sort({ startDate: -1 });
        // 計算每個預算的已使用金額
        const budgetsWithSpent = yield Promise.all(budgets.map((budget) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            // Explicitly cast to any to resolve the toObject() type error
            const budgetObject = budget.toObject();
            const transactions = yield Transaction_1.default.find({
                user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
                category: budget.category,
                date: {
                    $gte: budget.startDate,
                    $lte: budget.endDate,
                },
                type: 'expense',
            });
            const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
            return Object.assign(Object.assign({}, budgetObject), { spent: totalSpent });
        })));
        res.json(budgetsWithSpent);
    }
    catch (error) {
        console.error('獲取預算失敗:', error);
        res.status(500).json({ message: '獲取預算失敗' });
    }
}));
// 創建新預算
router.post('/', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const budget = new Budget_1.default(Object.assign(Object.assign({}, req.body), { user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }));
        yield budget.save();
        res.status(201).json(budget);
    }
    catch (error) {
        console.error('創建預算失敗:', error);
        res.status(400).json({ message: '創建預算失敗' });
    }
}));
// 更新預算
router.patch('/:id', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const budget = yield Budget_1.default.findOne({
            _id: req.params.id,
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        });
        if (!budget) {
            return res.status(404).json({ message: '找不到預算' });
        }
        Object.assign(budget, req.body);
        yield budget.save();
        res.json(budget);
    }
    catch (error) {
        console.error('更新預算失敗:', error);
        res.status(400).json({ message: '更新預算失敗' });
    }
}));
// 刪除預算
router.delete('/:id', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const budget = yield Budget_1.default.findOneAndDelete({
            _id: req.params.id,
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        });
        if (!budget) {
            return res.status(404).json({ message: '找不到預算' });
        }
        res.json({ message: '預算已刪除' });
    }
    catch (error) {
        console.error('刪除預算失敗:', error);
        res.status(500).json({ message: '刪除預算失敗' });
    }
}));
// 獲取預算使用情況
router.get('/:id/usage', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const budget = yield Budget_1.default.findOne({
            _id: req.params.id,
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        });
        if (!budget) {
            return res.status(404).json({ message: '找不到預算' });
        }
        const transactions = yield Transaction_1.default.find({
            user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
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
    }
    catch (error) {
        console.error('獲取預算使用情況失敗:', error);
        res.status(500).json({ message: '獲取預算使用情況失敗' });
    }
}));
exports.default = router;
