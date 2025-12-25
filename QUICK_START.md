# 快速启动指南

## 🎉 博客已成功启动！

你的个人博客系统现在已经在本地运行了，并且已经包含了 2 篇示例文章。

### 访问地址

- **前台首页**: http://localhost:3000
- **管理后台**: http://localhost:3000/admin/login

### 当前状态

✅ **Next.js 开发服务器**: 运行中  
✅ **PostgreSQL 数据库**: 运行中  
✅ **数据库表**: 已创建  
✅ **示例文章**: 已添加（2 篇已发布，1 篇草稿）  
⚠️ **AWS S3**: 需要配置（图片上传功能）

---

## 使用指南

### 1. 访问前台

打开浏览器访问 http://localhost:3000

你会看到 2 篇已发布的示例文章：
- "欢迎来到我的博客"
- "Next.js 14 新特性介绍"

点击文章标题可以查看详细内容。

### 2. 登录管理后台

1. 访问 http://localhost:3000/admin/login
2. 输入管理路径：`secret-admin-123`
3. 点击"进入管理后台"

### 3. 创建第一篇文章

1. 登录后台后，点击"新建文章"
2. 填写文章信息：
   - 标题：例如"我的第一篇博客"
   - URL Slug：自动生成，例如"my-first-blog"
   - 内容：使用 Markdown 格式编写
3. 点击"保存草稿"或"发布文章"

### 4. 查看文章

- 发布文章后，返回首页 http://localhost:3000
- 你会看到刚刚发布的文章
- 点击文章标题查看详情

---

## Markdown 编辑器功能

管理后台的编辑器支持：

- **实时预览**：左侧编辑，右侧实时预览
- **Markdown 语法**：标题、列表、链接、图片、代码块等
- **代码高亮**：支持多种编程语言
- **图片上传**：点击"上传图片"按钮（需要配置 AWS S3）

### Markdown 示例

```markdown
# 一级标题

## 二级标题

这是一段普通文本。

- 列表项 1
- 列表项 2

**粗体文本** 和 *斜体文本*

[链接文本](https://example.com)

\`\`\`javascript
console.log('Hello World');
\`\`\`
```

---

## 配置 AWS S3（可选）

如果你想使用图片上传功能，需要配置 AWS S3：

1. 创建 AWS S3 存储桶
2. 获取 AWS 访问密钥
3. 编辑 `frontend/.env.local`：

```bash
AWS_ACCESS_KEY_ID=你的访问密钥ID
AWS_SECRET_ACCESS_KEY=你的密钥
AWS_REGION=us-east-1
AWS_S3_BUCKET=你的存储桶名称
```

4. 重启开发服务器

---

## 停止服务

### 停止 Next.js 服务器

在终端按 `Ctrl + C`

### 停止数据库

```bash
docker-compose down
```

---

## 重新启动

### 启动数据库

```bash
docker-compose up -d
```

### 启动 Next.js

```bash
cd frontend
npm run dev
```

---

## 常见问题

### Q: 首页显示空白？

A: 这是正常的，因为数据库中还没有文章。请先通过管理后台创建文章。

### Q: 管理后台无法访问？

A: 确保使用正确的管理路径 `secret-admin-123`。这个路径在 `frontend/.env.local` 中配置。

### Q: 图片上传失败？

A: 图片上传需要配置 AWS S3。如果暂时不需要图片功能，可以先使用外部图片链接。

### Q: 数据库连接失败？

A: 确保 Docker 容器正在运行：
```bash
docker ps | grep blog_postgres
```

如果没有运行，执行：
```bash
docker-compose up -d
```

---

## 下一步

1. **创建更多文章**：熟悉 Markdown 编辑器
2. **自定义样式**：修改 `frontend/src/app/globals.css`
3. **配置 S3**：启用图片上传功能
4. **部署到生产环境**：参考 `DEPLOYMENT.md`

---

## 技术支持

- 查看 `README.md` 了解项目概述
- 查看 `ADMIN_GUIDE.md` 了解管理功能
- 查看 `API.md` 了解 API 文档
- 查看 `DEPLOYMENT.md` 了解部署指南

---

**祝你使用愉快！** 🚀
