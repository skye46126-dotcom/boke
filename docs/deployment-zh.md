# 博客项目部署指引

本指南将指导你如何将博客项目部署上线，并解决 Supabase 在国内访问慢的问题。

## 1. 修复构建错误 (已完成)
由于你的图片文件 `images/gallery/----------mjpcdlrm.png` 超过了 PWA 默认的 2MB 限制，我已在 `vite.config.js` 中将限制提升至 5MB。你现在可以再次运行以下命令尝试构建：

```bash
cd frontend-vue
npm run build
```

## 2. 推荐方案：Cloudflare Pages (免费、全加速)

### 步骤 A：准备工作
1. 确保你的代码已上传到 GitHub。
2. 注册并登录 [Cloudflare 控制台](https://dash.cloudflare.com/)。

### 步骤 B：创建项目
1. 在左侧菜单选择 **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**。
2. 选择你的 GitHub 仓库。
3. **Build settings** 配置如下：
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. **Environment variables** (重要)：
   - 点击 **Add variable**，添加 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`。

### 步骤 C：绑定域名
1. 部署完成后，在 Pages 项目页面点击 **Custom domains**。
2. 点击 **Set up a custom domain**，输入你购买的域名。
3. 如果你的 DNS 也在 Cloudflare，它会自动设置；否则请按提示修改 DNS 记录。

---

## 3. VPS + Nginx 方案 (如果你坚持使用服务器)

如果你已经买了服务器（建议选香港/新加坡节点）：

1. **安装环境**：
   ```bash
   sudo apt update
   sudo apt install nginx nodejs npm
   ```
2. **构建代码**：在本地或服务器运行 `npm run build`。
3. **上传 dist 文件夹**：将 `dist` 文件夹上传到服务器路径（如 `/var/www/boke`）。
4. **配置 Nginx**：
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/boke;
       index index.html;
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```
5. **Cloudflare 设置**：在 Cloudflare DNS 页面添加 A 记录指向服务器 IP，并确保小云朵是开启状态。

---

## 4. 解决 Supabase 国内慢的问题：Cloudflare Worker 代理

无论你选择哪种方案，都可以配合这个代理来加速：

1. 在 Cloudflare 控制台选择 **Workers & Pages** -> **Create application** -> **Create Worker**。
2. 名字可以叫 `supabase-proxy`。
3. 部署后，将 Worker 的基础 URL 复制，在你的 `.env` 文件或 Cloudflare Pages 的环境变量中，将 `VITE_SUPABASE_URL` 替换为这个 Worker 的 URL。

> [!TIP]
> 如果需要这个代理的具体代码，请告诉我，我可以为你生成。
