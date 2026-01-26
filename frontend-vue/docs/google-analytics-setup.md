# Google Analytics 4 配置指南

## 📊 已完成的配置

✅ Google Analytics 脚本已添加到 `index.html`

**位置**：`/Users/Zhuanz/boke/frontend-vue/index.html`

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🔧 配置步骤

### 步骤 1：创建 Google Analytics 账号

1. 访问 [Google Analytics](https://analytics.google.com/)
2. 使用 Google 账号登录
3. 点击 "开始衡量"

### 步骤 2：设置账号和媒体资源

**账号设置**：
- 账号名称：`个人作品集` 或您喜欢的名称
- 数据共享设置：根据需要选择

**媒体资源设置**：
- 媒体资源名称：`我的作品集网站`
- 报告时区：`中国 (GMT+08:00)`
- 币种：`人民币 (CNY)`

**业务详情**：
- 行业类别：`技术` 或 `计算机与电子产品`
- 业务规模：`小型` (如果是个人项目)

### 步骤 3：设置数据流

1. 选择平台：**网站**
2. 填写信息：
   - **网站网址**：`https://yoursite.com`
   - **数据流名称**：`主网站`
3. 点击 "创建数据流"

### 步骤 4：获取 Measurement ID

创建数据流后，您会看到：

```
衡量 ID
G-XXXXXXXXXX  [复制]
```

**这就是您需要的 Measurement ID！**

### 步骤 5：更新代码

**打开文件**：`index.html`

**替换两处 `G-XXXXXXXXXX`**：

```html
<!-- 第1处：脚本 URL -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR-ACTUAL-ID"></script>

<!-- 第2处：config -->
gtag('config', 'G-YOUR-ACTUAL-ID');
```

### 步骤 6：验证安装

**方法 1：实时报告**
1. 部署网站（或本地运行）
2. 访问 Google Analytics → 实时报告
3. 打开您的网站
4. 应该看到 1 个活跃用户

**方法 2：浏览器开发者工具**
1. 打开网站
2. F12 → Network
3. 搜索 `google-analytics.com`
4. 应该看到请求发送

**方法 3：Tag Assistant**
1. 安装 [Tag Assistant Legacy](https://chrome.google.com/webstore) 扩展
2. 访问您的网站
3. 点击扩展图标
4. 应该看到 GA4 标签在工作

---

## 📈 Google Analytics 功能

### 免费功能包括

- ✅ **实时数据**：查看当前活跃用户
- ✅ **用户概览**：访问量、用户数、会话数
- ✅ **流量来源**：直接访问、搜索引擎、社交媒体
- ✅ **页面浏览**：哪些页面最受欢迎
- ✅ **设备信息**：桌面、移动、平板
- ✅ **地理位置**：访客的国家和城市
- ✅ **事件跟踪**：按钮点击、视频播放等

### 查看数据

**登录后**：
1. **实时** → 查看当前访客
2. **报告** → 访问概览
3. **探索** → 自定义报告

---

## 🎯 自定义事件（可选）

如果想跟踪特定操作（如按钮点击）：

```javascript
// 跟踪按钮点击
gtag('event', 'button_click', {
  'event_category': 'engagement',
  'event_label': 'contact_button'
})

// 跟踪下载
gtag('event', 'file_download', {
  'file_name': 'resume.pdf'
})
```

**在 Vue 组件中使用**：

```vue
<template>
  <button @click="trackClick">联系我</button>
</template>

<script setup>
const trackClick = () => {
  if (window.gtag) {
    window.gtag('event', 'contact_click')
  }
  // 其他逻辑...
}
</script>
```

---

## 🔒 隐私与合规

### GDPR 合规

如果您的网站面向欧盟用户，需要：

1. **Cookie 同意横幅**
2. **隐私政策页面**
3. **数据处理说明**

**简单实现**：

```html
<!-- Cookie 同意横幅示例 -->
<div v-if="!cookieConsent" class="cookie-banner">
  本网站使用 Google Analytics 收集匿名访问数据以改进用户体验。
  <button @click="acceptCookies">接受</button>
  <button @click="rejectCookies">拒绝</button>
</div>
```

### 禁用 IP 匿名化（已默认）

GA4 默认匿名化 IP 地址，无需额外配置。

### 用户选择退出

在隐私政策中提供退出链接：

```html
<a href="https://tools.google.com/dlpage/gaoptout">
  停用 Google Analytics
</a>
```

---

## 🚀 部署后操作

### 1. 验证数据收集

部署网站后 24-48 小时：
- 检查实时报告
- 查看用户数据
- 验证页面跟踪

### 2. 设置目标

**示例目标**：
- 访问联系页面
- 下载简历
- 点击项目链接

**设置路径**：
1. GA 管理 → 事件
2. 创建事件
3. 设置为转化

### 3. 创建自定义报告

根据需要创建：
- 每周流量报告
- 热门页面排行
- 访客来源分析

---

## 📊 常用数据查看

### 查看访问量

**路径**：报告 → 生命周期 → 参与度 → 页面和屏幕

**数据**：
- 页面浏览量
- 平均参与时间
- 跳出率

### 查看流量来源

**路径**：报告 → 生命周期 → 获客

**数据**：
- 直接访问
- 搜索引擎（Google、Bing）
- 社交媒体
- 推荐网站

### 查看用户设备

**路径**：报告 → 用户 → 技术 → 概览

**数据**：
- 桌面 vs 移动
- 浏览器类型
- 操作系统

---

## ⚠️ 注意事项

### 开发环境

在本地开发时，GA 会记录您自己的访问。

**解决方案**：

1. **使用浏览器扩展**（推荐）
   - 安装 [Block Yourself from Analytics](https://chrome.google.com/webstore)

2. **代码判断**
   ```javascript
   const isDev = window.location.hostname === 'localhost'
   if (!isDev && window.gtag) {
     gtag('config', 'G-XXXXXXXXXX')
   }
   ```

3. **设置过滤器**
   - GA 管理 → 数据流 → 配置 → 显示高级设置
   - 排除内部流量

---

## 🆘 故障排除

### 数据不显示

**检查项**：
1. Measurement ID 是否正确？
2. 脚本是否成功加载？（F12 → Network）
3. 是否使用广告拦截器？（暂时禁用测试）
4. 等待 24-48 小时（数据有延迟）

### 实时报告显示 0

**可能原因**：
1. 网站未部署到公网
2. 本地测试需要等待
3. 浏览器禁用了 JavaScript

### 跟踪代码重复

**检查**：
- 只在 `index.html` 添加一次
- 不要在多个组件中重复添加

---

## 📱 移动应用跟踪（如需要）

如果您有移动应用：
1. 创建新的数据流（iOS/Android）
2. 集成 Firebase Analytics
3. 关联到 GA4

---

## 🎓 学习资源

- [GA4 官方文档](https://support.google.com/analytics/answer/10089681)
- [GA4 学院](https://analytics.google.com/analytics/academy/)
- [数据分析最佳实践](https://support.google.com/analytics/topic/9303319)

---

## ✅ 配置完成检查清单

- [ ] 创建 Google Analytics 账号
- [ ] 设置媒体资源
- [ ] 创建数据流
- [ ] 获取 Measurement ID
- [ ] 更新 `index.html` 中的 ID（两处）
- [ ] 部署网站
- [ ] 验证数据收集（实时报告）
- [ ] 添加隐私政策（如需要）
- [ ] 设置 Cookie 同意（如面向欧盟）

---

**配置完成后，您就可以开始收集和分析网站数据了！** 📊
