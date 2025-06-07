"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
// 路由導入
const auth_1 = __importDefault(require("./routes/auth"));
const transactions_1 = __importDefault(require("./routes/transactions"));
const budgets_1 = __importDefault(require("./routes/budgets"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// 中間件
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// 路由
app.use('/api/auth', auth_1.default);
app.use('/api/transactions', transactions_1.default);
app.use('/api/budgets', budgets_1.default);
// 數據庫連接
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/finance-tracker';
mongoose_1.default.connect(MONGODB_URI)
    .then(() => console.log('已連接到 MongoDB'))
    .catch((err) => console.error('MongoDB 連接錯誤:', err));
// 錯誤處理中間件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: '伺服器錯誤' });
});
const PORT = parseInt(process.env.PORT || '5000', 10);
app.listen(PORT, () => {
    console.log(`伺服器運行在端口 ${PORT}`);
});
