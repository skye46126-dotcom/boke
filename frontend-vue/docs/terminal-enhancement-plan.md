# Terminal 增强实施计划

**目标**：为 Terminal 组件添加更多有趣和实用的命令

---

## 当前状态

### 现有命令（6个）
- `help` - 帮助信息
- `about` - 关于我
- `skills` - 技能栈
- `projects` - 项目列表
- `contact` - 联系方式
- `clear` - 清空终端

---

## 推荐增强方案

### 第一批：基础实用命令（快速实现）

#### 1. `whoami`
显示当前用户信息
```
$ whoami
Your Name - Full Stack Developer
现在位于：个人作品集网站
```

#### 2. `date`
显示当前日期时间
```
$ date
2024-01-25 23:42:00 CST
```

#### 3. `ls`
列出网站"目录"结构
```
$ ls
📁 about/      关于我
📁 projects/   我的项目
📁 articles/   技术博客
📁 gallery/    相册
📁 contact/    联系方式
```

#### 4. `tree`
显示网站结构树
```
$ tree
/
├── 📄 about
├── 📁 projects/
│   ├── project-1
│   └── project-2
├── 📁 articles/
└── 📄 contact
```

#### 5. `social`
显示所有社交链接
```
$ social
🐙 GitHub:   https://github.com/yourusername
🐦 Twitter:  https://twitter.com/yourusername
💼 LinkedIn: https://linkedin.com/in/yourusername
📧 Email:    your@email.com
```

#### 6. `joke`
随机编程笑话
```
$ joke
为什么程序员总是分不清万圣节和圣诞节？
因为 Oct 31 == Dec 25 😄
```

---

### 第二批：视觉效果命令

#### 7. `banner`
显示ASCII艺术字（您的名字）
```
$ banner
  ██╗   ██╗ ██████╗ ██╗   ██╗██████╗ 
  ╚██╗ ██╔╝██╔═══██╗██║   ██║██╔══██╗
   ╚████╔╝ ██║   ██║██║   ██║██████╔╝
    ╚██╔╝  ██║   ██║██║   ██║██╔══██╗
     ██║   ╚██████╔╝╚██████╔╝██║  ██║
```

#### 8. `welcome`
显示欢迎信息（带ASCII art）
```
$ welcome
━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Welcome to my portfolio!
  Type 'help' to get started
━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### 第三批：开发者彩蛋

#### 9. `sudo [command]`
幽默的权限提示
```
$ sudo rm -rf /
😱 Nice try! 但这是我的作品集，不是你的服务器！
权限被拒绝（并且被记录了）
```

#### 10. `vim`
Vim 笑话
```
$ vim
启动 Vim...
...
提示：按 ESC 然后输入 :q! 退出
或者你可以直接重启电脑 😉
```

#### 11. `npm install`
假的安装进度
```
$ npm install
📦 Installing dependencies...
[████████████████████] 100%
✅ 0 vulnerabilities found
💰 节省了 3.7GB 磁盘空间（开玩笑的）
```

#### 12. `git status`
假的Git状态
```
$ git status
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
（这不是真的Git仓库哦）
```

---

### 第四批：互动功能

#### 13. `calc [expression]`
简单计算器
```
$ calc 2+2
= 4

$ calc 100*5
= 500
```

#### 14. `echo [text]`
回显文字
```
$ echo Hello World
Hello World
```

#### 15. `guess`
猜数字游戏
```
$ guess
🎲 我想了一个1-100之间的数字，猜猜看！
输入 'guess [number]' 来猜测
```

#### 16. `quote`
随机励志名言
```
$ quote
"代码是写给人读的，只是顺便让机器执行。"
—— Harold Abelson
```

---

### 第五批：导航增强

#### 17. `cd [path]`
跳转到页面
```
$ cd projects
跳转到 Projects 页面...
（实际调用 router.push）

$ cd ..
返回首页...
```

#### 18. `pwd`
显示当前"路径"
```
$ pwd
/home/projects
（根据当前路由显示）
```

#### 19. `open [url]`
打开链接
```
$ open github
🌐 打开 GitHub: https://github.com/yourusername

$ open blog
跳转到博客页面...
```

---

## 技术实现

### 命令结构设计

```javascript
const commands = {
  // 基础命令
  whoami: () => `${personalInfo.name} - ${personalInfo.title}`,
  
  date: () => new Date().toLocaleString('zh-CN'),
  
  ls: () => {
    return `📁 about/      关于我
📁 projects/   我的项目
📁 articles/   技术博客
📁 gallery/    相册
📁 contact/    联系方式`
  },
  
  // 带参数的命令
  calc: (args) => {
    try {
      const result = eval(args) // 注意：实际应使用安全的表达式求值
      return `= ${result}`
    } catch (e) {
      return '❌ 无效的表达式'
    }
  },
  
  // 交互式命令
  guess: () => {
    if (!gameState.guessNumber) {
      gameState.guessNumber = Math.floor(Math.random() * 100) + 1
      gameState.attempts = 0
      return '🎲 我想了一个1-100之间的数字，猜猜看！\n输入数字来猜测'
    }
    // 游戏逻辑...
  },
  
  // 导航命令
  cd: (path, router) => {
    const routes = {
      'projects': '/projects',
      'articles': '/articles',
      'about': '/',
      '..': '/'
    }
    if (routes[path]) {
      router.push(routes[path])
      return `跳转到 ${path}...`
    }
    return `❌ 路径不存在: ${path}`
  }
}
```

### 增强功能

**1. 参数解析**
```javascript
const parseCommand = (input) => {
  const parts = input.trim().split(' ')
  const cmd = parts[0].toLowerCase()
  const args = parts.slice(1).join(' ')
  return { cmd, args }
}
```

**2. 命令历史（上下箭头）**
```javascript
// 添加键盘事件监听
@keyup.up="navigateHistory(-1)"
@keyup.down="navigateHistory(1)"
```

**3. Tab 补全**
```javascript
@keyup.tab.prevent="autoComplete"
```

**4. 颜色输出**
```vue
<!-- 支持不同类型的输出样式 -->
<div :class="getOutputClass(line.type)">
  {{ line.content }}
</div>
```

---

## 实施优先级

### Phase 1: 基础增强（15分钟）
- [ ] whoami
- [ ] date
- [ ] ls
- [ ] social
- [ ] joke

### Phase 2: 视觉效果（20分钟）
- [ ] banner
- [ ] welcome
- [ ] 彩色输出

### Phase 3: 开发者彩蛋（15分钟）
- [ ] sudo
- [ ] vim
- [ ] npm install
- [ ] git status

### Phase 4: 互动功能（30分钟）
- [ ] calc
- [ ] echo
- [ ] guess
- [ ] quote

### Phase 5: 导航增强（20分钟）
- [ ] cd（需要注入router）
- [ ] pwd
- [ ] tree
- [ ] open

**总计**: 约100分钟（可分批实施）

---

## 笑话和名言数据

### 编程笑话库
```javascript
const jokes = [
  "为什么程序员总是分不清万圣节和圣诞节？\n因为 Oct 31 == Dec 25",
  "程序员的三大谎言：\n1. 这个bug很快就能修好\n2. 代码我都写好了，就差测试了\n3. 这次绝对不会出问题",
  "如何生成随机字符串？\n让新手退出 Vim",
  // 更多笑话...
]
```

### 励志名言库
```javascript
const quotes = [
  '"代码是写给人读的，只是顺便让机器执行。" —— Harold Abelson',
  '"过早优化是万恶之源。" —— Donald Knuth',
  '"简单是可靠的前提。" —— Edsger Dijkstra',
  // 更多名言...
]
```

---

## 用户选择

请选择您想要实施的批次：

- **选项 A**: Phase 1（基础，快速）
- **选项 B**: Phase 1 + 2（基础 + 视觉）
- **选项 C**: Phase 1 + 2 + 3（加入彩蛋）
- **选项 D**: 全部实施（完整版）
- **自定义**: 挑选特定命令

---

## 注意事项

1. **安全性**: `calc` 命令避免使用 `eval`，使用安全的数学表达式解析器
2. **路由注入**: `cd` 命令需要访问 Vue Router
3. **数据来源**: 从 `portfolio.js` 读取个人信息
4. **性能**: 命令执行应该即时响应
5. **用户体验**: 保持终端的真实感和趣味性

---

**准备好开始实施了吗？** 🚀
