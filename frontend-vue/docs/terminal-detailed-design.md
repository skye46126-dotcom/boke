# Terminal 完整版增强 - 详细设计文档

**版本**: 1.0  
**命令总数**: 19个新命令（当前6个 + 19个 = 25个总命令）  
**预计实施时间**: 100分钟

---

## 目录

1. [命令分类与优先级](#命令分类与优先级)
2. [数据结构设计](#数据结构设计)
3. [命令详细规格](#命令详细规格)
4. [交互流程设计](#交互流程设计)
5. [技术实现方案](#技术实现方案)
6. [边界情况处理](#边界情况处理)
7. [测试计划](#测试计划)

---

## 命令分类与优先级

### Phase 1: 基础实用命令（5个）

| 命令 | 功能 | 复杂度 | 依赖 |
|------|------|--------|------|
| `whoami` | 显示当前用户信息 | ⭐ 简单 | portfolio.js |
| `date` | 显示当前日期时间 | ⭐ 简单 | - |
| `ls` | 列出网站结构 | ⭐⭐ 中等 | - |
| `social` | 显示社交链接 | ⭐ 简单 | portfolio.js |
| `joke` | 随机编程笑话 | ⭐⭐ 中等 | 笑话数据库 |

### Phase 2: 视觉效果命令（2个）

| 命令 | 功能 | 复杂度 | 依赖 |
|------|------|--------|------|
| `banner` | ASCII 艺术字 | ⭐⭐⭐ 复杂 | ASCII 生成器 |
| `welcome` | 欢迎信息 | ⭐ 简单 | - |

### Phase 3: 开发者彩蛋（4个）

| 命令 | 功能 | 复杂度 | 依赖 |
|------|------|--------|------|
| `sudo` | 权限笑话 | ⭐ 简单 | - |
| `vim` | Vim 笑话 | ⭐ 简单 | - |
| `npm install` | 假安装动画 | ⭐⭐ 中等 | 定时器 |
| `git status` | 假 Git 状态 | ⭐ 简单 | - |

### Phase 4: 互动功能（4个）

| 命令 | 功能 | 复杂度 | 依赖 |
|------|------|--------|------|
| `calc` | 简单计算器 | ⭐⭐ 中等 | 表达式解析 |
| `echo` | 回显文字 | ⭐ 简单 | - |
| `guess` | 猜数字游戏 | ⭐⭐⭐ 复杂 | 游戏状态 |
| `quote` | 励志名言 | ⭐⭐ 中等 | 名言数据库 |

### Phase 5: 导航增强（4个）

| 命令 | 功能 | 复杂度 | 依赖 |
|------|------|--------|------|
| `cd` | 页面跳转 | ⭐⭐⭐ 复杂 | Vue Router |
| `pwd` | 显示当前路径 | ⭐⭐ 中等 | Vue Router |
| `tree` | 网站结构树 | ⭐⭐ 中等 | - |
| `open` | 打开链接 | ⭐⭐ 中等 | - |

---

## 数据结构设计

### 1. 命令注册表

```javascript
const commands = {
  // 命令名: { handler, description, usage, category }
  'whoami': {
    handler: () => executeWhoami(),
    description: '显示当前用户信息',
    usage: 'whoami',
    category: 'info',
    aliases: ['who']
  },
  'calc': {
    handler: (args) => executeCalc(args),
    description: '简单计算器',
    usage: 'calc <expression>',
    category: 'utility',
    needsArgs: true
  }
  // ... 更多命令
}
```

### 2. 游戏状态管理

```javascript
const gameState = reactive({
  // 猜数字游戏
  guess: {
    active: false,
    targetNumber: null,
    attempts: 0,
    maxAttempts: 10
  },
  
  // 其他游戏状态...
})
```

### 3. 笑话与名言数据库

```javascript
const jokes = [
  {
    id: 1,
    text: "为什么程序员总是分不清万圣节和圣诞节？\n因为 Oct 31 == Dec 25 🎃🎄",
    category: "pun"
  },
  {
    id: 2,
    text: "如何生成随机字符串？\n让新手退出 Vim 😄",
    category: "vim"
  },
  // 更多笑话...
]

const quotes = [
  {
    text: "代码是写给人读的，只是顺便让机器执行。",
    author: "Harold Abelson",
    source: "SICP"
  },
  // 更多名言...
]
```

### 4. 输出格式化

```javascript
const outputTypes = {
  SUCCESS: 'success',   // 绿色
  ERROR: 'error',       // 红色
  INFO: 'info',         // 蓝色
  WARNING: 'warning',   // 黄色
  NORMAL: 'normal'      // 默认
}

const formatOutput = (content, type = 'normal') => ({
  type,
  content,
  timestamp: Date.now()
})
```

---

## 命令详细规格

### Phase 1: 基础实用命令

#### 1. `whoami`

**功能描述**：显示当前用户的基本信息

**输入**：无参数

**输出示例**：
```
$ whoami
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  👤 Your Name
  💼 Full Stack Developer
  📧 your@email.com
  🌐 https://yoursite.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**实现逻辑**：
```javascript
const whoami = () => {
  const { name, title, email } = personalInfo
  return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  👤 ${name}
  💼 ${title}
  📧 ${email}
  🌐 当前位置：个人作品集
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
}
```

**边界情况**：
- 如果 personalInfo 未定义，显示默认信息
- 支持 `who` 作为别名

---

#### 2. `date`

**功能描述**：显示当前日期和时间

**输入**：无参数

**输出示例**：
```
$ date
📅 2024-01-25 23:45:30 CST
⏰ 星期四
🌙 晚上好！
```

**实现逻辑**：
```javascript
const date = () => {
  const now = new Date()
  const dateStr = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
  
  const weekday = now.toLocaleDateString('zh-CN', { weekday: 'long' })
  const hour = now.getHours()
  const greeting = hour < 6 ? '深夜' : 
                   hour < 12 ? '早上好' :
                   hour < 14 ? '中午好' :
                   hour < 18 ? '下午好' : '晚上好'
  
  return `📅 ${dateStr}
⏰ ${weekday}
🌙 ${greeting}!`
}
```

**扩展功能**：
- `date -u` 显示 UTC 时间
- `date -iso` 显示 ISO 格式

---

#### 3. `ls`

**功能描述**：列出网站的"目录"结构

**输入**：可选参数 `-l` (详细信息)

**输出示例**：
```
$ ls
📁 about/      关于我
📁 projects/   我的项目
📁 articles/   技术博客
📁 gallery/    相册
📄 contact     联系方式

$ ls -l
drwxr-xr-x  about/      关于我的个人介绍
drwxr-xr-x  projects/   精选项目展示
drwxr-xr-x  articles/   技术文章与教程
drwxr-xr-x  gallery/    照片与作品集
-rw-r--r--  contact     联系方式和社交链接
```

**实现逻辑**：
```javascript
const ls = (args) => {
  const items = [
    { name: 'about', type: 'dir', desc: '关于我' },
    { name: 'projects', type: 'dir', desc: '我的项目' },
    { name: 'articles', type: 'dir', desc: '技术博客' },
    { name: 'gallery', type: 'dir', desc: '相册' },
    { name: 'contact', type: 'file', desc: '联系方式' }
  ]
  
  if (args === '-l') {
    return items.map(item => {
      const icon = item.type === 'dir' ? '📁' : '📄'
      const perm = item.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--'
      return `${perm}  ${item.name.padEnd(12)} ${item.desc}`
    }).join('\n')
  }
  
  return items.map(item => {
    const icon = item.type === 'dir' ? '📁' : '📄'
    return `${icon} ${item.name.padEnd(12)} ${item.desc}`
  }).join('\n')
}
```

---

#### 4. `social`

**功能描述**：显示所有社交链接

**输入**：无参数

**输出示例**：
```
$ social
━━━━━━━━━━━━━━━━━━━━━━━━━━
  📱 社交链接
━━━━━━━━━━━━━━━━━━━━━━━━━━
🐙 GitHub:   https://github.com/username
🐦 Twitter:  https://twitter.com/username
💼 LinkedIn: https://linkedin.com/in/username
📧 Email:    your@email.com

💡 点击链接访问或输入 'open [platform]'
```

**实现逻辑**：
```javascript
const social = () => {
  const links = socialLinks.map(link => {
    const icons = {
      github: '🐙',
      twitter: '🐦',
      linkedin: '💼',
      email: '📧'
    }
    const icon = icons[link.icon] || '🔗'
    return `${icon} ${link.name.padEnd(9)} ${link.url}`
  })
  
  return `━━━━━━━━━━━━━━━━━━━━━━━━━━
  📱 社交链接
━━━━━━━━━━━━━━━━━━━━━━━━━━
${links.join('\n')}

💡 点击链接访问或输入 'open [platform]'`
}
```

---

#### 5. `joke`

**功能描述**：显示随机编程笑话

**输入**：无参数

**输出示例**：
```
$ joke
━━━━━━━━━━━━━━━━━━━━━━━━━━
为什么程序员总是分不清万圣节和圣诞节？

因为 Oct 31 == Dec 25 🎃🎄
━━━━━━━━━━━━━━━━━━━━━━━━━━

😄 再来一个？输入 'joke'
```

**笑话数据库**（20条）：
```javascript
const jokes = [
  "为什么程序员总是分不清万圣节和圣诞节？\n因为 Oct 31 == Dec 25 🎃🎄",
  
  "如何生成随机字符串？\n让新手退出 Vim 😄",
  
  "程序员的三大谎言：\n1. 这个bug很快就能修好\n2. 代码我都写好了，就差测试了\n3. 这次绝对不会出问题",
  
  "为什么程序员喜欢黑暗？\n因为光会吸引bug 🐛",
  
  "真相只有一个：\n不是代码有问题，就是需求有问题",
  
  "编程是一门艺术：\n把咖啡转换成代码的艺术 ☕→💻",
  
  "程序员的日常：\n99% 的时间在调试\n1% 的时间在想怎么调试",
  
  "为什么要写注释？\n因为6个月后的你就是另一个人",
  
  "Stack Overflow：\n程序员的第二大脑 🧠",
  
  "复制粘贴是一门技术活：\n知道从哪复制才是关键 📋",
  
  "代码审查的真相：\n找出别人代码里的bug很容易\n找出自己的... 😅",
  
  "测试环境 vs 生产环境：\n神秘的不同表现 🤔",
  
  "键盘上最常用的组合键：\nCtrl+C, Ctrl+V, Ctrl+Z",
  
  "完美的代码：\n只存在于面试题中 📝",
  
  "程序员的梦想：\n一次编译通过 ✨",
  
  "Bug的生命周期：\n产生 → 发现 → 修复 → 引入新bug → 循环",
  
  "前端 vs 后端：\n一个让你看得见，一个让你摸不着",
  
  "为什么叫'全栈'？\n因为前后端的bug都得修 😭",
  
  "最可怕的代码：\nTODO: 临时代码，记得删除\n// 写于2015年",
  
  "代码注释的最高境界：\n// 这里有魔法，不要动 🪄"
]
```

**实现逻辑**：
```javascript
const joke = () => {
  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)]
  return `━━━━━━━━━━━━━━━━━━━━━━━━━━
${randomJoke}
━━━━━━━━━━━━━━━━━━━━━━━━━━

😄 再来一个？输入 'joke'`
}
```

---

### Phase 2: 视觉效果命令

#### 6. `banner`

**功能描述**：显示 ASCII 艺术字（用户名）

**输入**：无参数

**输出示例**：
```
$ banner

╔═══════════════════════════════════════╗
║                                       ║
║   ██╗   ██╗ ██████╗ ██╗   ██╗██████╗ ║
║   ╚██╗ ██╔╝██╔═══██╗██║   ██║██╔══██╗║
║    ╚████╔╝ ██║   ██║██║   ██║██████╔╝║
║     ╚██╔╝  ██║   ██║██║   ██║██╔══██╗║
║      ██║   ╚██████╔╝╚██████╔╝██║  ██║║
║                                       ║
║         FULL STACK DEVELOPER          ║
║                                       ║
╚═══════════════════════════════════════╝
```

**ASCII 字符映射**：
```javascript
const asciiLetters = {
  'A': [
    '  ██████╗ ',
    ' ██╔══██╗',
    ' ███████║',
    ' ██╔══██║',
    ' ██║  ██║'
  ],
  'B': [
    ' ██████╗ ',
    ' ██╔══██╗',
    ' ██████╔╝',
    ' ██╔══██╗',
    ' ██████╔╝'
  ],
  // ... 完整的 A-Z 映射
}
```

**实现逻辑**：
```javascript
const banner = () => {
  const name = personalInfo.name.toUpperCase()
  const lines = ['', '', '', '', '']
  
  for (const char of name) {
    if (char === ' ') {
      lines.forEach((_, i) => lines[i] += '  ')
    } else if (asciiLetters[char]) {
      asciiLetters[char].forEach((line, i) => {
        lines[i] += line + ' '
      })
    }
  }
  
  const border = '═'.repeat(lines[0].length + 4)
  return `
╔${border}╗
║  ${' '.repeat(lines[0].length)}  ║
${lines.map(line => `║  ${line}  ║`).join('\n')}
║  ${' '.repeat(lines[0].length)}  ║
║  ${personalInfo.title.toUpperCase().padEnd(lines[0].length)}  ║
║  ${' '.repeat(lines[0].length)}  ║
╚${border}╝`
}
```

---

#### 7. `welcome`

**功能描述**：显示欢迎信息和导航提示

**输出示例**：
```
$ welcome
╔════════════════════════════════════════╗
║                                        ║
║  🎉 Welcome to My Portfolio! 🎉        ║
║                                        ║
║  快速开始：                             ║
║  • 输入 'help' 查看所有命令             ║
║  • 输入 'about' 了解更多                ║
║  • 输入 'projects' 查看我的项目         ║
║  • 输入 'joke' 来点乐子 😄              ║
║                                        ║
║  提示：使用 ↑↓ 浏览历史命令             ║
║                                        ║
╚════════════════════════════════════════╝
```

---

### Phase 3: 开发者彩蛋

#### 8. `sudo [command]`

**功能描述**：幽默的权限提示

**输入示例**：
```
sudo rm -rf /
sudo make me a sandwich
sudo anything
```

**输出示例**：
```
$ sudo rm -rf /
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  权限被拒绝！

Nice try! 但这是我的作品集，不是你的服务器 😏

[root@portfolio]# Operation not permitted
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 提示：这里没有 root 权限
（所有操作都已被记录 📝）
```

**实现逻辑**：
```javascript
const sudo = (args) => {
  const responses = {
    'rm -rf /': '😱 Nice try! 但数据是安全的...',
    'make me a sandwich': '🥪 好的！这是你的三明治... 开玩笑的',
    'default': '⚠️  权限被拒绝！'
  }
  
  const response = responses[args] || responses.default
  
  return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${response}

[root@portfolio]# Operation not permitted
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 提示：这里没有 root 权限
（所有操作都已被记录 📝）`
}
```

---

#### 9. `vim`

**输出示例**：
```
$ vim
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  启动 Vim...
  
  ~                                     
  ~                                     
  ~   VIM - Vi IMproved                 
  ~                                     
  ~   version 9.0                       
  ~   by Bram Moolenaar                 
  ~                                     
  ~                                     
  
  提示：按 ESC 然后输入 :q! 退出
  
  或者... 你可以直接重启电脑 😉
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 想学 Vim？输入 'help vim'
```

---

#### 10. `npm install`

**功能描述**：假的 npm 安装进度条

**输出示例**：
```
$ npm install
📦 Analyzing dependencies...
⬇️  Downloading packages...
[████████████████████████████] 100%

📊 安装统计：
  • 添加了 1337 个包
  • 审计了 42069 个包
  • 发现 0 个漏洞
  • 节省了 3.7GB 磁盘空间

✅ 安装完成！（开玩笑的 😄）

💡 实际项目请使用真正的 npm
```

**实现逻辑**（带动画）：
```javascript
const npmInstall = async () => {
  // 显示初始信息
  addOutput('📦 Analyzing dependencies...')
  await sleep(500)
  
  addOutput('⬇️  Downloading packages...')
  
  // 模拟进度条
  for (let i = 0; i <= 100; i += 10) {
    const filled = '█'.repeat(i / 10 * 28)
    const empty = '░'.repeat(28 - filled.length)
    updateLastOutput(`[${filled}${empty}] ${i}%`)
    await sleep(100)
  }
  
  await sleep(300)
  
  return `📊 安装统计：
  • 添加了 1337 个包
  • 审计了 42069 个包
  • 发现 0 个漏洞
  
✅ 安装完成！（开玩笑的 😄）`
}
```

---

#### 11. `git status`

**输出示例**：
```
$ git status
On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   terminal.vue
        new file:   awesome_feature.js

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        .env.local

nothing to commit, working tree clean

💡 这不是真的 Git 仓库哦
   想看真实代码？访问我的 GitHub!
```

---

### Phase 4: 互动功能

#### 12. `calc [expression]`

**功能描述**：安全的数学表达式计算器

**输入示例**：
```
calc 2+2
calc 100*5
calc (10+20)*3
calc sqrt(16)
```

**输出示例**：
```
$ calc 2+2
= 4

$ calc 100*5
= 500

$ calc (10+20)*3
= 90

$ calc sqrt(16)
❌ 高级函数暂不支持
支持的运算：+ - * / ( )
```

**安全实现**（不使用 eval）：
```javascript
const calc = (expression) => {
  // 移除空格
  const cleaned = expression.replace(/\s/g, '')
  
  // 验证只包含安全字符
  if (!/^[0-9+\-*/().\s]+$/.test(cleaned)) {
    return '❌ 无效的表达式\n支持的运算：+ - * / ( )'
  }
  
  try {
    // 使用 Function 构造器（相对安全）
    const result = new Function(`return ${cleaned}`)()
    
    if (typeof result !== 'number' || !isFinite(result)) {
      return '❌ 计算结果无效'
    }
    
    return `= ${result}`
  } catch (e) {
    return '❌ 无效的表达式'
  }
}
```

---

#### 13. `echo [text]`

**功能描述**：回显文字（支持特殊参数）

**输入示例**：
```
echo Hello World
echo -n Test (不换行)
echo -e "Line1\nLine2" (支持转义)
```

**输出示例**：
```
$ echo Hello World
Hello World

$ echo I love coding
I love coding

$ echo
(空行)
```

---

#### 14. `guess`

**功能描述**：猜数字游戏（1-100）

**游戏流程**：
```
$ guess
🎲 开始猜数字游戏！
我想了一个 1-100 之间的数字
你有 10 次机会，开始吧！

输入你的猜测：

$ 50
📊 第 1 次尝试
❌ 太小了！再试试

$ 75
📊 第 2 次尝试
❌ 太大了！调小一点

$ 60
📊 第 3 次尝试
🎯 太棒了！你猜对了！
数字是 60，你用了 3 次尝试

想再玩一次？输入 'guess'
```

**游戏状态管理**：
```javascript
const guessGame = {
  active: false,
  targetNumber: null,
  attempts: 0,
  maxAttempts: 10,
  
  start() {
    this.active = true
    this.targetNumber = Math.floor(Math.random() * 100) + 1
    this.attempts = 0
    return `🎲 开始猜数字游戏！
我想了一个 1-100 之间的数字
你有 ${this.maxAttempts} 次机会，开始吧！
    
输入数字进行猜测`
  },
  
  guess(number) {
    if (!this.active) {
      return '❌ 游戏未开始，输入 guess 开始'
    }
    
    const num = parseInt(number)
    if (isNaN(num) || num < 1 || num > 100) {
      return '❌ 请输入 1-100 之间的数字'
    }
    
    this.attempts++
    
    if (num === this.targetNumber) {
      const result = `📊 第 ${this.attempts} 次尝试
🎯 太棒了！你猜对了！
数字是 ${this.targetNumber}，你用了 ${this.attempts} 次尝试

想再玩一次？输入 'guess'`
      this.active = false
      return result
    }
    
    if (this.attempts >= this.maxAttempts) {
      const result = `📊 第 ${this.attempts} 次尝试
😢 游戏结束！你用完了所有机会
正确答案是 ${this.targetNumber}

再试一次？输入 'guess'`
      this.active = false
      return result
    }
    
    const hint = num < this.targetNumber ? '太小了' : '太大了'
    return `📊 第 ${this.attempts} 次尝试
❌ ${hint}！再试试
剩余机会：${this.maxAttempts - this.attempts}`
  }
}
```

---

#### 15. `quote`

**功能描述**：显示随机励志名言

**名言数据库**（15条）：
```javascript
const quotes = [
  {
    text: "代码是写给人读的，只是顺便让机器执行。",
    author: "Harold Abelson",
    source: "SICP"
  },
  {
    text: "过早优化是万恶之源。",
    author: "Donald Knuth"
  },
  {
    text: "简单是可靠的前提。",
    author: "Edsger Dijkstra"
  },
  {
    text: "任何傻瓜都能写出计算机能理解的代码，优秀的程序员写出人能理解的代码。",
    author: "Martin Fowler"
  },
  {
    text: "先让它运行，再让它正确，最后让它快速。",
    author: "Kent Beck"
  },
  {
    text: "代码的可读性比编写速度更重要。",
    author: "Robert C. Martin"
  },
  {
    text: "软件设计有两种方式：一种是简洁到明显没有bug，另一种是复杂到没有明显的bug。",
    author: "C.A.R. Hoare"
  },
  {
    text: "聪明的程序员知道何时使用抽象，而真正优秀的程序员知道何时避免抽象。",
    author: "Bjarne Stroustrup"
  },
  {
    text: "调试的难度是写代码的两倍。因此，如果你尽可能聪明地写代码，那么你就不够聪明去调试它。",
    author: "Brian Kernighan"
  },
  {
    text: "测试只能证明bug的存在，而无法证明bug不存在。",
    author: "Edsger Dijkstra"
  },
  {
    text: "学习编程不仅教你如何思考计算机，更教你如何思考。",
    author: "Steve Jobs"
  },
  {
    text: "代码永远不会说谎，注释有时会。",
    author: "Ron Jeffries"
  },
  {
    text: "优秀的代码本身就是最好的文档。",
    author: "Steve McConnell"
  },
  {
    text: "重复是软件开发中最大的敌人。",
    author: "Andy Hunt"
  },
  {
    text: "编程不是打字，编程是思考。",
    author: "Rich Hickey"
  }
]
```

**输出示例**：
```
$ quote
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💭 "代码是写给人读的，
    只是顺便让机器执行。"
    
    —— Harold Abelson, SICP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ 想要更多灵感？再次输入 'quote'
```

---

### Phase 5: 导航增强

#### 16. `cd [path]`

**功能描述**："切换目录"（实际是页面跳转）

**输入示例**：
```
cd projects
cd articles
cd ..
cd /
```

**输出示例**：
```
$ cd projects
📂 跳转到 /projects...
✅ 已到达 Projects 页面

$ cd ..
📂 返回上级目录...
✅ 已到达首页

$ cd nonexistent
❌ 目录不存在: nonexistent
可用目录：about, projects, articles, gallery
```

**实现逻辑**：
```javascript
const cd = (path, router) => {
  const routes = {
    'about': { path: '/', desc: '关于我' },
    'projects': { path: '/#projects', desc: 'Projects 页面' },
    'articles': { path: '/articles', desc: '文章列表' },
    'gallery': { path: '/gallery', desc: '相册' },
    '..': { path: '/', desc: '上级目录' },
    '/': { path: '/', desc: '根目录' },
    '~': { path: '/', desc: '主目录' }
  }
  
  const target = routes[path]
  
  if (!target) {
    const available = Object.keys(routes).filter(k => !['..', '/', '~'].includes(k))
    return `❌ 目录不存在: ${path}
可用目录：${available.join(', ')}`
  }
  
  // 执行路由跳转
  if (target.path.includes('#')) {
    // hash 跳转
    const [route, hash] = target.path.split('#')
    router.push(route).then(() => {
      if (hash) {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
      }
    })
  } else {
    router.push(target.path)
  }
  
  return `📂 跳转到 ${target.path}...
✅ 已到达 ${target.desc}`
}
```

---

#### 17. `pwd`

**功能描述**：显示当前"路径"（基于路由）

**输出示例**：
```
$ pwd
/home/projects

$ pwd
/home
```

**实现逻辑**：
```javascript
const pwd = (route) => {
  const pathMap = {
    '/': '/home',
    '/articles': '/home/articles',
    '/gallery': '/home/gallery'
  }
  
  return pathMap[route.path] || '/home'
}
```

---

#### 18. `tree`

**功能描述**：显示网站结构树

**输出示例**：
```
$ tree
/
├── 📄 Home (首页)
├── 📁 About (关于我)
│   ├── 💼 Experience
│   ├── 🎯 Skills
│   └── 💻 Terminal
├── 📁 Projects (项目)
│   ├── 📝 Blog System
│   ├── 💻 Terminal Portfolio
│   └── 🎮 Pixel Games
├── 📁 Articles (博客)
│   ├── 🏷️  Categories
│   └── 🔍 Search
├── 📁 Gallery (相册)
│   └── 🖼️  Photos
└── 📄 Contact (联系)
    ├── 📧 Email
    ├── 🐙 GitHub
    └── 💼 LinkedIn
```

---

#### 19. `open [target]`

**功能描述**：打开链接或跳转页面

**输入示例**：
```
open github
open linkedin
open blog
open https://example.com
```

**输出示例**：
```
$ open github
🌐 打开 GitHub...
✅ 正在跳转到 https://github.com/username

$ open linkedin
🌐 打开 LinkedIn...
✅ 正在跳转到 https://linkedin.com/in/username

$ open invalidlink
❌ 未知目标: invalidlink
可用选项：github, linkedin, twitter, email, blog
```

**实现逻辑**：
```javascript
const open = (target) => {
  // 如果是完整URL
  if (target.startsWith('http://') || target.startsWith('https://')) {
    window.open(target, '_blank')
    return `🌐 打开链接...
✅ 正在跳转到 ${target}`
  }
  
  // 预定义的快捷方式
  const shortcuts = {
    'github': socialLinks.find(l => l.name === 'GitHub')?.url,
    'linkedin': socialLinks.find(l => l.name === 'LinkedIn')?.url,
    'twitter': socialLinks.find(l => l.name === 'Twitter')?.url,
    'blog': '/articles',
    'portfolio': '/'
  }
  
  const url = shortcuts[target.toLowerCase()]
  
  if (!url) {
    return `❌ 未知目标: ${target}
可用选项：${Object.keys(shortcuts).join(', ')}`
  }
  
  if (url.startsWith('/')) {
    // 内部路由
    router.push(url)
    return `📂 跳转页面...
✅ 正在前往 ${url}`
  } else {
    // 外部链接
    window.open(url, '_blank')
    return `🌐 打开 ${target}...
✅ 正在跳转到 ${url}`
  }
}
```

---

## 交互流程设计

### 命令解析流程

```
用户输入
   ↓
去除首尾空格
   ↓
分割命令和参数
   ↓
查找命令处理器
   ├─ 存在 → 执行
   │          ↓
   │    验证参数
   │          ↓
   │    执行逻辑
   │          ↓
   │    格式化输出
   │          ↓
   │    添加到历史
   │
   └─ 不存在 → 显示错误
                ↓
            建议相似命令
```

### 游戏状态管理

```javascript
// 全局游戏状态
const gameStates = reactive({
  guess: {
    active: false,
    targetNumber: null,
    attempts: 0
  }
})

// 状态检查
const handleCommand = (input) => {
  // 如果游戏激活，数字输入被游戏捕获
  if (gameStates.guess.active && /^\d+$/.test(input)) {
    return guessGame.guess(input)
  }
  
  // 否则正常处理命令
  return normalCommandHandler(input)
}
```

---

## 技术实现方案

### 1. 组件增强

```vue
<script setup>
import { ref, reactive, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { personalInfo, socialLinks } from '@/data/portfolio'

// 注入 router
const router = useRouter()
const route = useRoute()

// 命令历史
const history = ref([...])

// 游戏状态
const gameStates = reactive({...})

// 命令处理器
const commands = {
  // 需要 router 的命令
  cd: (args) => cd(args, router),
  pwd: () => pwd(route),
  open: (args) => open(args, router),
  
  // 异步命令
  'npm install': async () => await npmInstall(),
  
  // 游戏命令
  guess: (args) => {
    if (!args) return guessGame.start()
    return guessGame.guess(args)
  },
  
  // 其他命令...
}
</script>
```

### 2. 助手函数

```javascript
// 随机选择
const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)]

// 延迟
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// 格式化输出
const formatOutput = (content, type = 'normal') => ({
  type,
  content,
  timestamp: Date.now()
})

// 相似命令建议（Levenshtein距离）
const suggestCommand = (input) => {
  const commandList = Object.keys(commands)
  const similar = commandList
    .map(cmd => ({
      cmd,
      distance: levenshteinDistance(input, cmd)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3)
    .filter(item => item.distance < 3)
  
  if (similar.length > 0) {
    return `你是不是想输入：${similar.map(s => s.cmd).join(', ')}?`
  }
  return ''
}
```

---

## 边界情况处理

### 1. 输入验证

```javascript
// 空输入
if (!input.trim()) return

// 超长输入
if (input.length > 200) {
  return '❌ 输入过长（最多200字符）'
}

// 特殊字符过滤
const sanitized = input.replace(/[<>{}]/g, '')
```

### 2. 错误处理

```javascript
try {
  const output = commands[cmd](args)
  addOutput(output)
} catch (error) {
  console.error('Command error:', error)
  addOutput(`❌ 命令执行出错: ${error.message}`)
}
```

### 3. 游戏状态冲突

```javascript
// 确保同时只有一个游戏激活
const startGame = (gameName) => {
  // 重置所有游戏状态
  Object.keys(gameStates).forEach(key => {
    gameStates[key].active = false
  })
  
  // 激活目标游戏
  gameStates[gameName].active = true
}
```

---

## 测试计划

### 单元测试场景

#### 基础命令
- [ ] `whoami` - 显示正确的个人信息
- [ ] `date` - 显示当前日期时间
- [ ] `ls` - 列出目录结构
- [ ] `ls -l` - 显示详细信息
- [ ] `social` - 显示所有社交链接
- [ ] `joke` - 随机选择笑话

#### 计算器
- [ ] `calc 2+2` → 4
- [ ] `calc 100*5` → 500
- [ ] `calc (10+20)*3` → 90
- [ ] `calc abc` → 错误信息
- [ ] `calc eval('alert()')` → 安全拒绝

#### 游戏
- [ ] `guess` - 开始游戏
- [ ] `guess` + 数字 - 猜测
- [ ] 猜对 - 显示祝贺
- [ ] 用完次数 - 游戏结束
- [ ] 重新开始 - 重置状态

#### 导航
- [ ] `cd projects` - 跳转
- [ ] `cd nonexistent` - 错误提示
- [ ] `pwd` - 显示当前路径
- [ ] `open github` - 打开链接

### 集成测试
- [ ] 命令历史记录
- [ ] ↑↓ 浏览历史
- [ ] 清空终端
- [ ] 长时间使用（内存泄漏）

---

## 实施检查清单

### Phase 1: 基础命令
- [ ] whoami
- [ ] date
- [ ] ls (含 -l 参数)
- [ ] social
- [ ] joke (含20条笑话)

### Phase 2: 视觉
- [ ] banner (ASCII 艺术)
- [ ] welcome

### Phase 3: 彩蛋
- [ ] sudo
- [ ] vim
- [ ] npm install (含动画)
- [ ] git status

### Phase 4: 互动
- [ ] calc (安全实现)
- [ ] echo
- [ ] guess (完整游戏逻辑)
- [ ] quote (含15条名言)

### Phase 5: 导航
- [ ] cd (含 router 注入)
- [ ] pwd
- [ ] tree
- [ ] open

### 增强功能
- [ ] 更新 help 命令
- [ ] 命令历史（↑↓）
- [ ] Tab 补全
- [ ] 彩色输出

---

## 预估工作量

| Phase | 命令数 | 预计时间 |
|-------|-------|---------|
| Phase 1 | 5 | 15分钟 |
| Phase 2 | 2 | 20分钟 |
| Phase 3 | 4 | 15分钟 |
| Phase 4 | 4 | 30分钟 |
| Phase 5 | 4 | 20分钟 |
| **总计** | **19** | **100分钟** |

---

**准备好开始实施了吗？** 🚀

请确认后，我将按 Phase 顺序依次实现所有命令！
