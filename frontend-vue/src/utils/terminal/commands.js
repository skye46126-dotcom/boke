import { personalInfo, socialLinks } from '@/data/portfolio'
import { jokes, quotes, helpText, bannerText, welcomeText } from './data'
import { guessGame } from './games'

export const createCommands = (router, route) => ({
    help: () => helpText,

    // Phase 1: 基础信息
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
    banner: bannerText,
    welcome: () => welcomeText,

    // Phase 3: 开发者彩蛋 & 系统模拟
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

    npm: (args) => {
        if (!args || !args.startsWith('install')) {
            return `Usage: npm install <package>
Example: npm install coffee`
        }

        return `📦 Analyzing dependencies...
⬇️  Downloading packages...
[████████████████████████████] 100%

📊 安装统计：
  • 添加了 1337 个包
  • 审计了 42069 个包
  • 发现 0 个漏洞
  
✅ 安装完成！（开玩笑的 😄）

💡 实际项目请使用真正的 npm`
    },

    git: (args) => {
        if (args === 'status' || !args) {
            return `On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   terminal.vue
        new file:   awesome_feature.js

nothing to commit, working tree clean

💡 这不是真的 Git 仓库哦
   想看真实代码？访问我的 GitHub!`
        }

        if (args.startsWith('commit')) {
            return `[main 8a2f9c] ${args.replace('commit -m ', '') || 'update'}
 2 files changed, 14 insertions(+), 2 deletions(-)
 create mode 100644 awesome_feature.js`
        }

        if (args === 'push') {
            return `Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Delta compression using up to 8 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 420 bytes | 420.00 KiB/s, done.
Total 3 (delta 1), reused 0 (delta 0)
To github.com:user/portfolio.git
   28a1c3..8a2f9c  main -> main`
        }

        return `usage: git <command>

These are common Git commands used in various situations:

   status     Show the working tree status
   commit     Record changes to the repository
   push       Update remote refs along with associated objects`
    },

    exit: () => {
        return `👋 Bye! 
(提示：按 ~ 键关闭终端)`
    },

    log: () => {
        router.push('/changelog')
        return `📜 跳转到更新日志...\n✅ 正在查看 Git History`
    },
    changelog: () => {
        router.push('/changelog')
        return `📜 跳转到更新日志...\n✅ 正在查看 Git History`
    },

    cat: (args) => {
        const files = {
            'contact': `
📧 Email: ${personalInfo.email}
🐙 GitHub: https://github.com
`,
            'about': `关于我 ... (查看 'about' 命令)`,
            'secret.txt': `🕵️ 你发现了秘密文件！
其实没什么秘密，就是觉得你很酷。`
        }
        return files[args] || (args ? `cat: ${args}: No such file or directory` : 'usage: cat <file>')
    },

    mkdir: () => `Permission denied: Read-only file system`,
    touch: () => `Permission denied: Read-only file system`,
    rm: () => `Permission denied: 你不能删除我的作品集！😡`,

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
})
