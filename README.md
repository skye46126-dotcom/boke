# Personal Blog System

超轻量级、高性能、易于维护的个人博客系统。

## 特性

- 🚀 前后端分离架构
- 📝 Markdown 编辑和渲染
- 🖼️ 云存储图片上传
- 🔒 隐蔽管理入口
- 📱 响应式设计
- ⚡ 高性能渲染

## 技术栈

### Frontend
- Next.js 14
- React 18
- TypeScript
- Marked.js (Markdown 渲染)
- Highlight.js (代码高亮)

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL
- AWS S3 / 阿里云 OSS

## 快速开始

### 前置要求

- Node.js 18+
- PostgreSQL 14+
- 云存储账号 (AWS S3 / 阿里云 OSS)

### 安装

```bash
# 安装依赖
npm install

# 配置环境变量
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# 编辑 .env 文件，填入数据库和云存储配置
```

### 数据库设置

```bash
# 创建数据库
createdb personal_blog

# 运行迁移
npm run migrate --workspace=backend
```

### 运行开发服务器

```bash
# 同时启动前后端
npm run dev

# 或分别启动
npm run dev:frontend  # 前端: http://localhost:3000
npm run dev:backend   # 后端: http://localhost:3001
```

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
personal-blog/
├── frontend/          # Next.js 前端
│   ├── src/
│   │   ├── app/      # App Router 页面
│   │   └── components/
│   └── package.json
├── backend/           # Express 后端
│   ├── src/
│   │   ├── config/   # 配置
│   │   ├── db/       # 数据库
│   │   ├── routes/   # API 路由
│   │   └── storage/  # 云存储
│   └── package.json
└── package.json       # 根配置
```

## 安全配置

1. **管理入口**: 在 `.env` 中设置随机的 `ADMIN_PATH`
2. **数据库**: 使用强密码
3. **云存储**: 配置适当的访问权限
4. **CORS**: 限制允许的来源

## License

MIT
