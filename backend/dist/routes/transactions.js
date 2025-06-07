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
const Transaction_1 = __importDefault(require("../models/Transaction"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// 獲取所有交易
router.get('/', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const transactions = yield Transaction_1.default.find({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id })
            .sort({ date: -1 });
        res.json(transactions);
    }
    catch (error) {
        console.error('獲取交易記錄失敗:', error);
        res.status(500).json({ message: '獲取交易記錄失敗' });
    }
}));
// 創建新交易
router.post('/', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const transaction = new Transaction_1.default(Object.assign(Object.assign({}, req.body), { user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }));
        yield transaction.save();
        res.status(201).json(transaction);
    }
    catch (error) {
        console.error('創建交易失敗:', error);
        res.status(400).json({ message: '創建交易失敗' });
    }
}));
// 更新交易
router.patch('/:id', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const transaction = yield Transaction_1.default.findOne({
            _id: req.params.id,
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        });
        if (!transaction) {
            return res.status(404).json({ message: '找不到交易記錄' });
        }
        Object.assign(transaction, req.body);
        yield transaction.save();
        res.json(transaction);
    }
    catch (error) {
        console.error('更新交易失敗:', error);
        res.status(400).json({ message: '更新交易失敗' });
    }
}));
// 刪除交易
router.delete('/:id', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const transaction = yield Transaction_1.default.findOneAndDelete({
            _id: req.params.id,
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        });
        if (!transaction) {
            return res.status(404).json({ message: '找不到交易記錄' });
        }
        res.json({ message: '交易已刪除' });
    }
    catch (error) {
        console.error('刪除交易失敗:', error);
        res.status(500).json({ message: '刪除交易失敗' });
    }
}));
// 獲取交易統計
router.get('/stats', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { startDate, endDate } = req.query;
        const query = { user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id };
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }
        const transactions = yield Transaction_1.default.find(query);
        const stats = {
            totalIncome: 0,
            totalExpense: 0,
            byCategory: {},
        };
        transactions.forEach((transaction) => {
            const { type, amount, category } = transaction;
            if (type === 'income') {
                stats.totalIncome += amount;
                stats.byCategory[category] = stats.byCategory[category] || { income: 0, expense: 0 };
                stats.byCategory[category].income += amount;
            }
            else {
                stats.totalExpense += amount;
                stats.byCategory[category] = stats.byCategory[category] || { income: 0, expense: 0 };
                stats.byCategory[category].expense += amount;
            }
        });
        res.json(stats);
    }
    catch (error) {
        console.error('獲取統計數據失敗:', error);
        res.status(500).json({ message: '獲取統計數據失敗' });
    }
}));
exports.default = router;
