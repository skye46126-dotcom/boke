import { personalInfo, socialLinks } from '@/data/portfolio'

export const jokes = [
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

export const quotes = [
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

export const helpText = `Available commands:

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
`

export const bannerText = () => {
    const name = (personalInfo.name || 'YOUR NAME').toUpperCase()
    return `
╔═══════════════════════════════════════╗
║                                       ║
║        ${name.padEnd(26)}       ║
║        ${personalInfo.title.toUpperCase().padEnd(26)}       ║
║                                       ║
╚═══════════════════════════════════════╝`
}

export const welcomeText = `╔════════════════════════════════════════╗
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
╚════════════════════════════════════════╝`
