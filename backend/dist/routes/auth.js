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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// 註冊
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name } = req.body;
        // 檢查用戶是否已存在
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: '此電子郵件已被註冊' });
        }
        // 創建新用戶
        const user = new User_1.default({
            email,
            password,
            name,
        });
        yield user.save();
        // 生成 JWT
        const token = jsonwebtoken_1.default.sign({ _id: user._id.toHexString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            token,
            user: {
                id: user._id.toHexString(),
                email: user.email,
                name: user.name,
            },
        });
    }
    catch (error) {
        console.error('註冊失敗:', error);
        res.status(500).json({ message: '註冊失敗' });
    }
}));
// 登入
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // 查找用戶
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: '電子郵件或密碼錯誤' });
        }
        // 驗證密碼
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: '電子郵件或密碼錯誤' });
        }
        // 生成 JWT
        const token = jsonwebtoken_1.default.sign({ _id: user._id.toHexString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            user: {
                id: user._id.toHexString(),
                email: user.email,
                name: user.name,
            },
        });
    }
    catch (error) {
        console.error('登入失敗:', error);
        res.status(500).json({ message: '登入失敗' });
    }
}));
// 獲取當前用戶信息
router.get('/me', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: '未經認證的使用者' });
        }
        res.json({
            user: {
                id: req.user._id.toHexString(),
                email: req.user.email,
                name: req.user.name,
            },
        });
    }
    catch (error) {
        console.error('獲取用戶信息失敗:', error);
        res.status(500).json({ message: '獲取用戶信息失敗' });
    }
}));
exports.default = router;
