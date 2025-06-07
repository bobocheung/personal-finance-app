# 個人理財追蹤器 (Personal Finance Tracker)

這是一個開源的個人理財追蹤網站應用程式，幫助用戶管理他們的財務狀況。

## 功能特點

- 📊 收入和支出追蹤
- 📈 財務報表和圖表
- 💰 預算管理
- 📱 響應式設計
- 🔒 安全的用戶認證

## 技術堆疊

### 前端
- React.js
- Tailwind CSS
- Chart.js
- React Router
- Axios

### 後端
- Node.js
- Express.js
- MongoDB Atlas
- JWT 認證

## 本地開發設置

### 前端設置
```bash
cd frontend
npm install
npm start
```

### 後端設置
```bash
cd backend
npm install
npm run dev
```

## 環境變數設置

### 前端 (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

### 後端 (.env)
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

## 部署

本專案使用 GitHub Actions 進行自動部署：
- 前端部署到 GitHub Pages
- 後端部署到 Render.com (免費層級)

## 貢獻指南

歡迎提交 Pull Requests！請確保：
1. 更新測試
2. 更新文檔
3. 遵循現有的代碼風格

## 授權

MIT License 