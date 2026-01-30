// Personal Information
export const personalInfo = {
    name: 'chenc',
    title: 'Full-Stack Developer && Product Manager',
    tagline: 'Building the web, one line at a time.',
    email: 'skye46126@gmail.com',
    avatar: '/images/avatar.jpg'
}

// Social Links
export const socialLinks = [
    {
        name: 'GitHub',
        url: 'https://github.com/skye46126-dotcom',
        icon: 'github',
        ariaLabel: 'Visit GitHub profile'
    },
    {
        name: 'Twitter',
        url: 'https://x.com/skyechenyue',
        icon: 'twitter',
        ariaLabel: 'Visit Twitter profile'
    },
    {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/tom-skye-4062883a5/',
        icon: 'linkedin',
        ariaLabel: 'Visit LinkedIn profile'
    },
    {
        name: 'Email',
        url: 'mailto:skye46126@gmail.com',
        icon: 'email',
        ariaLabel: 'Send email'
    }
]

// Navigation Items
export const navItems = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' }
]

// Skills
export const skills = [
    'Vue.js',
    'React',
    'TypeScript',
    'Node.js',
    'Python',
    'PostgreSQL',
    'Supabase',
    'Tailwind CSS',
    'Rust',
    'C++'
]

// Work Experience
export const experiences = [
    {
        period: '2024-Present',
        title: 'Senior Frontend Developer',
        company: 'Tech Company A',
        description: [
            '负责核心产品的前端架构设计和技术选型',
            '带领团队完成从 Vue 2 到 Vue 3 的迁移，提升开发效率 30%',
            '性能优化使首屏加载速度提升 50%，用户留存率提高 20%'
        ],
        technologies: ['Vue.js', 'TypeScript', 'Vite', 'Pinia', 'Element Plus']
    },
    {
        period: '2022-2024',
        title: 'Frontend Developer',
        company: 'Startup B',
        description: [
            '开发电商平台前端系统，实现响应式设计和国际化支持',
            '编写自动化测试，测试覆盖率达 80%',
            '参与 Code Review，维护团队代码质量'
        ],
        technologies: ['React', 'Next.js', 'Tailwind CSS', 'Jest', 'Zustand']
    }
]

// Featured Projects
export const projects = [
    {
        title: 'Personal Blog System',
        description: '使用 Vue 3 + Supabase 构建的全栈博客系统，支持 Markdown 编辑、代码高亮、评论系统等功能。',
        emoji: '📝',
        technologies: ['Vue 3', 'Vite', 'Supabase', 'Tailwind CSS'],
        github: 'https://github.com',
        demo: 'https://example.com'
    },
    {
        title: 'Interactive Terminal',
        description: '模拟终端界面的 Vue 组件，支持自定义命令和主题，可用于个人网站增加交互性。',
        emoji: '💻',
        technologies: ['Vue', 'TypeScript', 'CSS'],
        github: 'https://github.com',
        demo: null
    }
]
