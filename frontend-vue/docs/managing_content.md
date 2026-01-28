# 博客内容管理指南

你的博客内容主要通过两个数据文件来管理。要添加新项目或更新历史记录，只需修改这些文件即可。
所有修改保存后，网页会自动更新。

## 1. 如何管理 IDE 项目 (Projects)

**所有项目数据都存储在：**
`src/data/portfolio.js`

### 添加新项目
向下滚动到 `export const projects = [...]` 部分，复制一个现有的项目对象并添加进去：

```javascript
{
    title: '你的新项目名称',
    description: '项目的简短介绍。在 IDE 视图中，这段文字会作为 "export const description" 的值显示。',
    emoji: '🚀', // 项目的类别图标
    technologies: ['React', 'Three.js', 'AI'], // 技术栈列表，会高亮显示
    github: 'https://github.com/yourname/repo', // 源码链接（可选）
    demo: 'https://demo.com' // 演示链接（可选）
}
```

**注意：**
- `projects` 数组中的顺序决定了 IDE 左侧侧边栏的文件顺序。
- `title` 会自动转换为文件名 (例如 "My Project" -> `myproject.js`)。

---

## 2. 如何管理 Git 更新日志 (Changelog)

**所有日志数据都存储在：**
`src/data/changelog.js`

### 添加新记录
这个文件导出一个数组，按日期分组。要添加新的更新，请在数组**最上方**添加一个新的日期对象：

```javascript
{
    date: '2024-02-01', // 日期格式 YYYY-MM-DD
    commits: [
        { 
            hash: 'a1b2c3', // 伪造的 Commit Hash (6位字符)
            message: 'feat: Added a cool new AI feature', // 提交信息
            type: 'feat' // 类型，决定颜色 (feat, fix, style, docs, init)
        },
        { 
            hash: 'd4e5f6', 
            message: 'fix: Resolved login bug', 
            type: 'fix' 
        }
    ]
},
```

### 支持的 Commit 类型 (`type`)
不同的类型会有不同的标签颜色：
- `feat` (绿色): 新功能
- `fix` (红色): 修复 Bug
- `style` (紫色): 样式调整
- `docs` (蓝色): 文档更新
- `init` (黄色): 初始化/重大里程碑

---

### Tips
- 你不需要重新启动服务器，修改这些 JS 文件后，Vite 会自动热更新页面。
- 数据是纯文本的，你可以随意发挥，比如在 commit message 里写一些只有程序员懂的梗！
