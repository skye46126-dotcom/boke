<template>
  <div class="terminal-container bg-gh-card border border-gh-border rounded-vp overflow-hidden shadow-vp-shadow-2">
    <!-- 终端头部 -->
    <div class="terminal-header bg-gh-bg px-4 py-2 border-b border-gh-border flex items-center gap-2">
      <div class="w-3 h-3 rounded-full bg-red-500"></div>
      <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
      <div class="w-3 h-3 rounded-full bg-green-500"></div>
      <span class="ml-2 text-sm text-gh-text-muted font-mono">zsh - interactive terminal</span>
    </div>
    
    <!-- 终端内容 -->
    <div class="terminal-body p-4 font-mono text-sm max-h-96 overflow-y-auto" ref="terminalBody">
      <!-- 历史命令 -->
      <div v-for="(line, index) in history" :key="index" class="mb-2">
        <div v-if="line.type === 'input'" class="text-vp-c-brand">
          <span class="text-gh-text-muted">$</span> {{ line.content }}
        </div>
        <div v-else :class="getOutputClass(line.style)" class="whitespace-pre-wrap">{{ line.content }}</div>
      </div>
      
      <!-- 当前输入 -->
      <div class="flex items-center">
        <span class="text-gh-text-muted mr-2">$</span>
        <input
          v-model="currentInput"
          @keyup.enter="handleCommand"
          @keyup.up="navigateHistory(-1)"
          @keyup.down="navigateHistory(1)"
          ref="terminalInput"
          class="flex-1 bg-transparent border-none outline-none text-gh-text font-mono"
          placeholder="输入 'help' 查看所有命令"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { personalInfo, socialLinks } from '@/data/portfolio'

const router = useRouter()
const route = useRoute()

const history = ref([
  { type: 'output', content: 'Welcome to my interactive terminal! 👨‍💻', style: 'success' },
  { type: 'output', content: 'Type "help" to see all available commands.\n', style: 'normal' }
])

const currentInput = ref('')
const terminalInput = ref(null)
const terminalBody = ref(null)

// 命令历史（用于↑↓导航）
const commandHistory = ref([])
const historyIndex = ref(-1)

// 游戏状态
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

💡 直接输入数字进行猜测，输入 'exit' 退出游戏`
  },
  
  guess(number) {
    const num = parseInt(number)
    if (isNaN(num) || num < 1 || num > 100) {
      return '❌ 请输入 1-100 之间的数字'
    }
    
    this.attempts++
    
    if (num === this.targetNumber) {
      const result = `📊 第 ${this.attempts} 次尝试
🎯 太棒了！你猜对了！
数字是 ${this.targetNumber}，你用了 ${this.attempts} 次尝试

✨ 想再玩一次？输入 'guess'`
      this.active = false
      return result
    }
    
    if (this.attempts >= this.maxAttempts) {
      const result = `📊 第 ${this.attempts} 次尝试
😢 游戏结束！你用完了所有机会
正确答案是 ${this.targetNumber}

🔄 再试一次？输入 'guess'`
      this.active = false
      return result
    }
    
    const hint = num < this.targetNumber ? '太小了' : '太大了'
    const remaining = this.maxAttempts - this.attempts
    return `📊 第 ${this.attempts} 次尝试
${num < this.targetNumber ? '⬆️' : '⬇️'} ${hint}！再试试
剩余机会：${remaining}`
  },
  
  exit() {
    this.active = false
    return '👋 退出游戏'
  }
}

// 笑话数据库
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

// 名言数据库
const quotes = [
  { text: "代码是写给人读的，只是顺便让机器执行。", author: "Harold Abelson", source: "SICP" },
  { text: "过早优化是万恶之源。", author: "Donald Knuth" },
  { text: "简单是可靠的前提。", author: "Edsger Dijkstra" },
  { text: "任何傻瓜都能写出计算机能理解的代码，优秀的程序员写出人能理解的代码。", author: "Martin Fowler" },
  { text: "先让它运行，再让它正确，最后让它快速。", author: "Kent Beck" },
  { text: "代码的可读性比编写速度更重要。", author: "Robert C. Martin" },
  { text: "软件设计有两种方式：一种是简洁到明显没有bug，另一种是复杂到没有明显的bug。", author: "C.A.R. Hoare" },
  { text: "聪明的程序员知道何时使用抽象，而真正优秀的程序员知道何时避免抽象。", author: "Bjarne Stroustrup" },
  { text: "调试的难度是写代码的两倍。因此，如果你尽可能聪明地写代码，那么你就不够聪明去调试它。", author: "Brian Kernighan" },
  { text: "测试只能证明bug的存在，而无法证明bug不存在。", author: "Edsger Dijkstra" },
  { text: "学习编程不仅教你如何思考计算机，更教你如何思考。", author: "Steve Jobs" },
  { text: "代码永远不会说谎，注释有时会。", author: "Ron Jeffries" },
  { text: "优秀的代码本身就是最好的文档。", author: "Steve McConnell" },
  { text: "重复是软件开发中最大的敌人。", author: "Andy Hunt" },
  { text: "编程不是打字，编程是思考。", author: "Rich Hickey" }
]

// 命令定义
const commands = {
  help: () => `Available commands:

📋 基础信息
  help        显示此帮助信息
  whoami      显示当前用户信息
  about       关于我
  skills      我的技能栈
  contact     联系方式

📁 导航命令
  ls          列出网站结构
  cd [path]   跳转到页面
  pwd         显示当前路径
  tree        显示网站结构树
  open [url]  打开链接

🎮 互动功能
  calc [expr] 简单计算器
  echo [text] 回显文字
  guess       猜数字游戏
  joke        随机编程笑话
  quote       励志名言

🎨 视觉效果
  banner      显示ASCII艺术字
  welcome     欢迎信息

🔧 开发者彩蛋
  sudo [cmd]  权限笑话
  vim         Vim笑话
  npm install 假的安装动画
  git status  假的Git状态

⚙️  系统命令
  date        显示当前日期时间
  social      显示社交链接
  clear       清空终端

💡 提示：使用 ↑↓ 浏览历史命令
`,

  // Phase 1: 基础命令
  whoami: () => {
    const { name, title, email } = personalInfo
    return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  👤 ${name}
  💼 ${title}
  📧 ${email}
  🌐 当前位置：个人作品集
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
  },

  date: () => {
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
    const greeting = hour < 6 ? '深夜时分' : 
                     hour < 12 ? '早上好' :
                     hour < 14 ? '中午好' :
                     hour < 18 ? '下午好' : '晚上好'
    
    return `📅 ${dateStr}
⏰ ${weekday}
🌙 ${greeting}!`
  },

  ls: (args) => {
    const items = [
      { name: 'about', type: 'dir', desc: '关于我' },
      { name: 'projects', type: 'dir', desc: '我的项目' },
      { name: 'articles', type: 'dir', desc: '技术博客' },
      { name: 'gallery', type: 'dir', desc: '相册' },
      { name: 'contact', type: 'file', desc: '联系方式' }
    ]
    
    if (args === '-l') {
      return items.map(item => {
        const perm = item.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--'
        return `${perm}  ${item.name.padEnd(12)} ${item.desc}`
      }).join('\n')
    }
    
    return items.map(item => {
      const icon = item.type === 'dir' ? '📁' : '📄'
      return `${icon} ${item.name.padEnd(12)} ${item.desc}`
    }).join('\n')
  },

  social: () => {
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
  },

  joke: () => {
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)]
    return `━━━━━━━━━━━━━━━━━━━━━━━━━━
${randomJoke}
━━━━━━━━━━━━━━━━━━━━━━━━━━

😄 再来一个？输入 'joke'`
  },

  // Phase 2: 视觉效果
  banner: () => {
    const name = (personalInfo.name || 'YOUR NAME').toUpperCase()
    return `
╔═══════════════════════════════════════╗
║                                       ║
║        ${name.padEnd(26)}       ║
║        ${personalInfo.title.toUpperCase().padEnd(26)}       ║
║                                       ║
╚═══════════════════════════════════════╝`
  },

  welcome: () => `╔════════════════════════════════════════╗
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
╚════════════════════════════════════════╝`,

  // Phase 3: 开发者彩蛋
  sudo: (args) => `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  权限被拒绝！

Nice try! 但这是我的作品集，不是你的服务器 😏

[root@portfolio]# Operation not permitted
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 提示：这里没有 root 权限
（所有操作都已被记录 📝）`,

  vim: () => `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  启动 Vim...
  
  ~                                     
  ~   VIM - Vi IMproved                 
  ~   version 9.0                       
  ~   by Bram Moolenaar                 
  ~                                     
  
  提示：按 ESC 然后输入 :q! 退出
  
  或者... 你可以直接重启电脑 😉
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 开玩笑的！输入其他命令继续`,

  'npm install': () => `📦 Analyzing dependencies...
⬇️  Downloading packages...
[████████████████████████████] 100%

📊 安装统计：
  • 添加了 1337 个包
  • 审计了 42069 个包
  • 发现 0 个漏洞
  
✅ 安装完成！（开玩笑的 😄）

💡 实际项目请使用真正的 npm`,

  'git status': () => `On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   terminal.vue
        new file:   awesome_feature.js

nothing to commit, working tree clean

💡 这不是真的 Git 仓库哦
   想看真实代码？访问我的 GitHub!`,

  // Phase 4: 互动功能
  calc: (expression) => {
    if (!expression) {
      return '用法：calc <expression>\n例如：calc 2+2'
    }
    
    const cleaned = expression.replace(/\s/g, '')
    if (!/^[0-9+\-*/().\s]+$/.test(cleaned)) {
      return '❌ 无效的表达式\n支持的运算：+ - * / ( )'
    }
    
    try {
      const result = new Function(`return ${cleaned}`)()
      if (typeof result !== 'number' || !isFinite(result)) {
        return '❌ 计算结果无效'
      }
      return `= ${result}`
    } catch (e) {
      return '❌ 无效的表达式'
    }
  },

  echo: (text) => text || '',

  guess: (args) => {
    if (!args) {
      return guessGame.start()
    }
    if (args === 'exit') {
      return guessGame.exit()
    }
    if (guessGame.active) {
      return guessGame.guess(args)
    }
    return guessGame.start()
  },

  quote: () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
    const sourceText = randomQuote.source ? `, ${randomQuote.source}` : ''
    return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💭 "${randomQuote.text}"
    
    —— ${randomQuote.author}${sourceText}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ 想要更多灵感？再次输入 'quote'`
  },

  // Phase 5: 导航命令
  cd: (path) => {
    const routes = {
      'about': { path: '/', desc: '关于我' },
      'projects': { path: '/#projects', desc: 'Projects 部分' },
      'articles': { path: '/articles', desc: '文章列表' },
      'gallery': { path: '/gallery', desc: '相册' },
      '..': { path: '/', desc: '上级目录' },
      '/': { path: '/', desc: '根目录' },
      '~': { path: '/', desc: '主目录' }
    }
    
    if (!path) {
      return '用法：cd <directory>\n可用目录：about, projects, articles, gallery'
    }
    
    const target = routes[path.toLowerCase()]
    
    if (!target) {
      const available = Object.keys(routes).filter(k => !['..', '/', '~'].includes(k))
      return `❌ 目录不存在: ${path}\n可用目录：${available.join(', ')}`
    }
    
    if (target.path.includes('#')) {
      const [route, hash] = target.path.split('#')
      router.push(route).then(() => {
        setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      })
    } else {
      router.push(target.path)
    }
    
    return `📂 跳转到 ${target.path}...\n✅ 已到达 ${target.desc}`
  },

  pwd: () => {
    const pathMap = {
      '/': '/home',
      '/articles': '/home/articles',
      '/gallery': '/home/gallery'
    }
    return pathMap[route.path] || '/home'
  },

  tree: () => `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/
├── 📄 Home (首页)
├── 📁 About (关于我)
│   ├── 💼 Experience
│   ├── 🎯 Skills
│   └── 💻 Terminal
├── 📁 Projects (项目)
│   └── 🚀 Featured Projects
├── 📁 Articles (博客)
│   ├── 🏷️  Categories
│   └── 🔍 Search
├── 📁 Gallery (相册)
│   └── 🖼️  Photos
└── 📄 Contact (联系)
    ├── 📧 Email
    ├── 🐙 GitHub
    └── 💼 LinkedIn
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

  open: (target) => {
    if (!target) {
      return '用法：open <url|platform>\n例如：open github'
    }
    
    if (target.startsWith('http://') || target.startsWith('https://')) {
      window.open(target, '_blank')
      return `🌐 打开链接...\n✅ 正在跳转到 ${target}`
    }
    
    const shortcuts = {
      'github': socialLinks.find(l => l.name === 'GitHub')?.url,
      'linkedin': socialLinks.find(l => l.name === 'LinkedIn')?.url,
      'twitter': socialLinks.find(l => l.name === 'Twitter')?.url,
      'email': socialLinks.find(l => l.name === 'Email')?.url,
      'blog': '/articles',
      'portfolio': '/'
    }
    
    const url = shortcuts[target.toLowerCase()]
    
    if (!url) {
      return `❌ 未知目标: ${target}\n可用选项：${Object.keys(shortcuts).join(', ')}`
    }
    
    if (url.startsWith('/')) {
      router.push(url)
      return `📂 跳转页面...\n✅ 正在前往 ${url}`
    } else {
      window.open(url, '_blank')
      return `🌐 打开 ${target}...\n✅ 正在跳转到 ${url}`
    }
  },

  // 保留原有命令
  about: () => `Hi! I'm a full-stack developer passionate about:
  • Clean code
  • Open source
  • Building great products`,
  
  skills: () => `Technical Skills:
  • Frontend: Vue.js, React, Tailwind CSS
  • Backend: Node.js, Python
  • Database: PostgreSQL, Supabase
  • Tools: Git, Docker, Zsh`,
  
  projects: () => `Featured Projects:
  [1] 📝 Blog System - Vue 3 + Supabase
  [2] 🎮 Pixel Portfolio - Interactive portfolio
  [3] 🔧 CLI Tools - Custom Zsh plugins
  
  Visit /#projects for more details.`,
  
  contact: () => {
    const email = socialLinks.find(l => l.name === 'Email')?.url || 'your@email.com'
    const github = socialLinks.find(l => l.name === 'GitHub')?.url || 'https://github.com'
    return `Contact Me:
  📧 Email: ${email}
  🐙 GitHub: ${github}`
  },
  
  clear: () => 'CLEAR'
}

const getOutputClass = (style) => {
  const classes = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  }
  return classes[style] || 'text-gh-text'
}

const handleCommand = () => {
  const input = currentInput.value.trim()
  if (!input) return
  
  // 保存到命令历史
  commandHistory.value.unshift(input)
  historyIndex.value = -1
  
  history.value.push({ type: 'input', content: input })
  
  // 猜数字游戏特殊处理
  if (guessGame.active && /^\d+$/.test(input)) {
    const output = guessGame.guess(input)
    history.value.push({ type: 'output', content: output + '\n', style: 'normal' })
    currentInput.value = ''
    scrollToBottom()
    return
  }
  
  if (input.toLowerCase() === 'exit' && guessGame.active) {
    const output = guessGame.exit()
    history.value.push({ type: 'output', content: output + '\n', style: 'normal' })
    currentInput.value = ''
    scrollToBottom()
    return
  }
  
  // 解析命令和参数
  const parts = input.split(' ')
  const cmd = parts[0].toLowerCase()
  const args = parts.slice(1).join(' ')
  
  if (commands[cmd]) {
    const output = commands[cmd](args)
    if (output === 'CLEAR') {
      history.value = []
    } else {
      history.value.push({ type: 'output', content: output + '\n', style: 'normal' })
    }
  } else {
    history.value.push({ 
      type: 'output', 
      content: `Command not found: ${input}\nType 'help' for available commands.\n`,
      style: 'error'
    })
  }
  
  currentInput.value = ''
  scrollToBottom()
}

const navigateHistory = (direction) => {
  if (commandHistory.value.length === 0) return
  
  const newIndex = historyIndex.value + direction
  if (newIndex < -1) {
    historyIndex.value = -1
    currentInput.value = ''
    return
  }
  if (newIndex >= commandHistory.value.length) {
    return
  }
  
  historyIndex.value = newIndex
  if (newIndex === -1) {
    currentInput.value = ''
  } else {
    currentInput.value = commandHistory.value[newIndex]
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (terminalBody.value) {
      terminalBody.value.scrollTop = terminalBody.value.scrollHeight
    }
  })
}

onMounted(() => {
  terminalInput.value?.focus()
})
</script>
