import { reactive } from 'vue'

function createProjectFile(name, type, content) {
    return { name, type, content }
}

function createWorkspaceProject(project) {
    return {
        id: project.id,
        name: project.name,
        title: project.name,
        folderName: project.folderName,
        status: project.status,
        summary: project.summary,
        description: project.summary,
        emoji: project.emoji,
        role: project.role,
        stack: project.stack,
        technologies: project.stack,
        progress: project.progress,
        links: project.links,
        github: project.github || null,
        demo: project.demo || null,
        updatedAt: project.updatedAt,
        files: project.files,
        terminalOutput: project.terminalOutput
    }
}

export const defaultSiteContent = {
    personalInfo: {
        name: 'chenc',
        title: '全栈开发者 / 产品驱动工程实践',
        tagline: '围绕内容平台、Agent 工作流与交互式作品集，把想法做成可维护的软件。',
        email: 'skye46126@gmail.com',
        avatar: '/images/avatar.jpg'
    },
    socialLinks: [
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
    ],
    navItems: [
        { id: 'about', label: 'About' },
        { id: 'projects', label: 'Projects' },
        { id: 'experience', label: 'Experience' },
        { id: 'blog', label: 'Latest Posts' },
        { id: 'agents', label: 'Agent Feed' },
        { id: 'tech-stack', label: 'Tech Stack' },
        { id: 'contact', label: 'Contact' }
    ],
    skills: [
        'Vue 3',
        'Vite',
        'Node.js',
        'JavaScript',
        'TypeScript',
        'Python',
        'PostgreSQL',
        'Supabase',
        'Tailwind CSS',
        'Shiki',
        'PWA'
    ],
    experiences: [
        {
            id: 'personal-content-platform',
            period: '2025 - 至今',
            title: '个人博客与内容平台迭代',
            company: 'boke / Independent Project',
            summary: '围绕个人博客、项目展示和 Agent Forum，持续搭建一个用于记录文章、项目进展和 Agent 协作内容的个人内容平台。',
            highlights: [
                '重构首页内容层级，拆分 About、Projects、Latest Posts、Agent Forum 和 Contact 等模块。',
                '设计 VSCode 风格 Projects IDE，用 README、Roadmap、Tech Stack 和 Build Log 组织项目展示。',
                '规划 Agent Forum、Writing Desk、Agent Console 等模块，逐步从 mock 数据迁移到真实内容管理。'
            ],
            stack: ['Vue 3', 'Vite', 'Tailwind CSS', 'Supabase', 'Node.js'],
            relatedProjectId: 'personal-content-platform',
            relatedFile: 'README.md',
            ctaLabel: 'Open in Project Workspace'
        },
        {
            id: 'android-app-practice',
            period: '2026 - 至今',
            title: '安卓 App 项目实践',
            company: 'Personal Project / Learning Project',
            summary: '围绕一个功能较完整的安卓 App 项目，梳理移动端页面组织、基础功能流和本地数据交互。',
            highlights: [
                '搭建或整理 App 的基础页面、功能入口和交互流程，形成可运行的移动端项目雏形。',
                '接触本地数据存储、页面跳转、状态展示等常见 App 开发问题。',
                '计划重新梳理项目功能、代码结构和 README 文档，将其整理为可展示的作品集项目。'
            ],
            stack: ['Android', 'Local Storage', 'UI Flow'],
            relatedProjectId: 'android-app-practice',
            relatedFile: 'README.md',
            ctaLabel: 'Open in Project Workspace'
        },
        {
            id: 'clawbot',
            period: '2026 - 至今',
            title: 'ClawBot 与 AI 硬件方案探索',
            company: 'Hardware Prototype Planning',
            summary: '围绕桌面 AI 机器人方向，拆解主控、屏幕、摄像头、联网能力和 Agent 接入方式，规划一个可演示的硬件原型路径。',
            highlights: [
                '梳理最小可实现版本，明确屏幕显示、摄像头输入、Agent 调用和基础动作反馈等核心模块。',
                '对比开发板、摄像头模块、舵机、电源等硬件方案，评估预算、复杂度和实现优先级。',
                '将硬件项目拆分为学习路径、功能路径和演示路径，避免一开始追求完整产品导致无法落地。'
            ],
            stack: ['ESP32', 'Camera Module', 'Agent API', 'Hardware MVP'],
            relatedProjectId: 'clawbot',
            relatedFile: 'README.md',
            ctaLabel: 'Open in Project Workspace'
        }
    ],
    projects: [
        createWorkspaceProject({
            id: 'personal-content-platform',
            name: '个人内容平台与 Agent 工作流',
            folderName: 'personal-content-platform',
            status: 'Refactoring',
            summary: '围绕博客、项目展示和 Agent Forum 持续搭建的个人内容平台，重点是把展示层、内容层和管理工作流清晰分开。',
            emoji: '📝',
            role: [
                'Product Structure',
                'Frontend Development',
                'Content Workflow',
                'Data Modeling'
            ],
            stack: ['Vue 3', 'Vite', 'Tailwind CSS', 'Supabase', 'Node.js'],
            progress: [
                { label: 'Structure', value: 85 },
                { label: 'Workspace', value: 78 },
                { label: 'Content Flow', value: 64 }
            ],
            links: [
                { label: 'Source Repo', url: 'https://github.com/skye46126-dotcom/boke' },
                { label: 'Build Notes', url: '/changelog' }
            ],
            github: 'https://github.com/skye46126-dotcom/boke',
            updatedAt: '2026-04',
            files: [
                createProjectFile('README.md', 'markdown', `# 个人内容平台与 Agent 工作流

围绕个人博客、项目展示和 Agent Forum 持续演进的内容平台。

## Why

目标不是把所有内容堆在一个主页里，而是逐步建立清晰的内容层级、项目入口和 Agent 协作边界。

## Core Modules

- About / Projects / Latest Posts / Contact
- Agent Forum / Writing Desk / Agent Console
- VSCode 风格 Projects Workspace
- 文章、项目与构建日志的内容管理路径

## My Role

我负责首页信息架构、项目工作区展示、内容工作流设计，以及 Supabase 与本地 API 的接入整理。

## Current Status

Refactoring

## Next Step

- 继续把 mock 内容迁移到真实内容管理
- 收紧 Agent Forum 与 Writing Desk 的职责边界
- 让 Projects IDE 默认打开更稳定的项目入口
`),
                createProjectFile('roadmap.md', 'markdown', `# Roadmap

## Phase 1: Surface

- 收紧首页模块顺序与信息密度
- 统一 Experience、Projects、Blog 的分工
- 减少模板化展示和重复叙事

## Phase 2: Workspace

- 用 README、Roadmap、Tech Stack、Build Log 组织项目展示
- 让工作区支持按项目和文件参数直接打开
- 继续优化移动端浏览结构

## Phase 3: Content Flow

- 逐步把 mock 数据迁移到真实内容管理
- 补齐 Agent 相关写入与审核链路
- 整理项目文档与构建日志节奏
`),
                createProjectFile('architecture.md', 'markdown', `# Architecture

## App Surface

- Home：实践路径与模块入口
- Projects Workspace：项目文档与进度浏览
- Articles：正式文章输出
- Agent Forum / Writing Desk：动态与内容工作流

## Data Flow

- 前端通过 composables 和 services 读取展示数据
- 站点内容通过统一的 site_content 数据源维护
- 管理操作由 server/index.mjs 承接写入

## Boundaries

- Experience 负责时间线摘要
- Projects 负责项目档案与文档浏览
- Blog / Build Log 负责过程记录
`),
                createProjectFile('stack.json', 'json', {
                    name: '个人内容平台与 Agent 工作流',
                    status: 'Refactoring',
                    role: ['Product Structure', 'Frontend Development', 'Content Workflow', 'Data Modeling'],
                    frontend: ['Vue 3', 'Vite', 'Tailwind CSS'],
                    backend: ['Node.js', 'Supabase'],
                    features: ['Projects Workspace', 'Latest Posts', 'Agent Forum', 'Writing Desk', 'Build Log']
                }),
                createProjectFile('build-log.md', 'markdown', `# Build Log

## 2026-04

- 把 Experience 文案改成三段真实实践路径
- 让 Experience 卡片直接跳到对应项目工作区
- 合并作品集展示逻辑到内容平台项目叙事中

## Notes

- 控制 Experience 卡片长度，避免信息压迫
- 让 Projects Workspace 负责更详细的项目说明
`)
            ],
            terminalOutput: [
                '> npm run inspect:project',
                'Loading project metadata...',
                'Checking modules...',
                'Home Surface ....... ready',
                'Projects IDE ....... ready',
                'Agent Forum ........ building',
                'Content Flow ....... refining',
                'Project status: Refactoring',
                'Next step: continue replacing mock content with managed content'
            ]
        }),
        createWorkspaceProject({
            id: 'android-app-practice',
            name: '安卓 App 项目实践',
            folderName: 'android-app-practice',
            status: 'Building',
            summary: '围绕一个功能较完整的安卓 App 项目整理页面结构、功能流和本地数据交互，当前以形成可展示的项目骨架为目标。',
            emoji: '📱',
            role: [
                'Mobile UI Practice',
                'App Flow Planning',
                'Local Data Exploration'
            ],
            stack: ['Android', 'Local Storage', 'Navigation', 'UI Flow'],
            progress: [
                { label: 'Screens', value: 62 },
                { label: 'Flow', value: 54 },
                { label: 'Docs', value: 38 }
            ],
            links: [
                { label: 'Build Notes', url: '/changelog' }
            ],
            updatedAt: '2026-04',
            files: [
                createProjectFile('README.md', 'markdown', `# 安卓 App 项目实践

一个围绕页面组织、基础功能流和本地数据交互持续整理的移动端练习项目。

## Why

重点不是一次做成完整产品，而是把常见的移动端页面结构、状态展示和本地数据问题走通。

## Core Modules

- App 首页与功能入口
- 页面跳转与基础功能流
- 本地数据读取与状态展示
- README 与项目整理文档

## My Role

我负责梳理页面结构、整理交互流程，并把项目逐步收敛成可展示的作品集条目。

## Current Status

Building

## Next Step

- 继续补齐关键页面之间的跳转关系
- 整理本地数据交互方式和状态说明
- 重新梳理 README 和代码结构
`),
                createProjectFile('roadmap.md', 'markdown', `# Roadmap

## Phase 1: App Skeleton

- 整理基础页面与功能入口
- 确定主要页面流转顺序
- 形成可运行的项目雏形

## Phase 2: Local Data

- 梳理本地数据存储方式
- 明确状态展示与回填逻辑
- 记录常见问题和调试路径

## Phase 3: Portfolio Readiness

- 重写 README
- 调整项目结构说明
- 形成适合展示的项目摘要
`),
                createProjectFile('ui-flow.md', 'markdown', `# UI Flow

## Focus

- 页面入口是否清楚
- 跳转链路是否顺畅
- 状态反馈是否足够明确

## Current Notes

- 先把基础功能流走通
- 暂不追求复杂动画和高级组件
- 优先保证项目结构可读
`),
                createProjectFile('stack.json', 'json', {
                    name: '安卓 App 项目实践',
                    status: 'Building',
                    role: ['Mobile UI Practice', 'App Flow Planning', 'Local Data Exploration'],
                    platform: ['Android'],
                    focus: ['Local Storage', 'Navigation', 'UI Flow'],
                    features: ['Page Structure', 'Feature Entry', 'State Display', 'README Cleanup']
                }),
                createProjectFile('build-log.md', 'markdown', `# Build Log

## 2026-04

- 重新定义项目的展示边界
- 把重点放回页面组织、功能流和本地数据交互
- 计划补齐 README 与代码结构说明
`)
            ],
            terminalOutput: [
                '> npm run inspect:project',
                'Loading project metadata...',
                'Checking modules...',
                'Screen Layout ...... ready',
                'Navigation Flow .... building',
                'Local Storage ...... exploring',
                'README Cleanup ..... planning',
                'Project status: Building',
                'Next step: tighten page flow and local data notes'
            ]
        }),
        createWorkspaceProject({
            id: 'clawbot',
            name: 'ClawBot 与 AI 硬件方案探索',
            folderName: 'clawbot',
            status: 'Planning',
            summary: '围绕桌面 AI 机器人方向拆解主控、摄像头、联网和 Agent 接入方式，当前以规划一个可演示的硬件 MVP 为目标。',
            emoji: '🤖',
            role: [
                'Hardware MVP Planning',
                'Component Research',
                'Demo Path Design'
            ],
            stack: ['ESP32', 'Camera Module', 'Agent API', 'Servo Control', 'Hardware MVP'],
            progress: [
                { label: 'Scope', value: 58 },
                { label: 'Hardware Options', value: 46 },
                { label: 'Demo Path', value: 34 }
            ],
            links: [
                { label: 'Build Notes', url: '/changelog' }
            ],
            updatedAt: '2026-04',
            files: [
                createProjectFile('README.md', 'markdown', `# ClawBot 与 AI 硬件方案探索

一个围绕桌面 AI 机器人方向的硬件原型规划项目。

## Why

目标是先找到最小可实现版本，而不是一开始就追求完整产品形态。

## Core Modules

- 屏幕显示与基础反馈
- 摄像头输入与联网能力
- Agent 调用路径
- 简单动作反馈与演示链路

## My Role

我负责拆解 MVP 范围、评估硬件方案，并把学习路径、功能路径和演示路径分开规划。

## Current Status

Planning

## Next Step

- 确定第一版主控与摄像头组合
- 评估电源、舵机和结构复杂度
- 收敛成可演示的硬件 MVP 路线
`),
                createProjectFile('roadmap.md', 'markdown', `# Roadmap

## Phase 1: MVP Scope

- 明确屏幕、摄像头、Agent 调用、动作反馈四个核心模块
- 只保留可演示所需的最小功能
- 形成第一版原型路径

## Phase 2: Hardware Selection

- 对比开发板和摄像头模块
- 评估舵机、电源和预算
- 排序实现优先级

## Phase 3: Demo Path

- 设计基础交互流程
- 整理功能路径与学习路径
- 避免过早追求完整产品
`),
                createProjectFile('hardware-notes.md', 'markdown', `# Hardware Notes

## Comparison Focus

- 主控算力是否足够
- 摄像头接入难度是否可控
- 动作反馈是否能先用简化方案验证

## Current Principle

- 先验证输入、输出和 Agent 调用
- 再考虑复杂结构件和完整外观
`),
                createProjectFile('stack.json', 'json', {
                    name: 'ClawBot 与 AI 硬件方案探索',
                    status: 'Planning',
                    role: ['Hardware MVP Planning', 'Component Research', 'Demo Path Design'],
                    hardware: ['ESP32', 'Camera Module', 'Servo Control'],
                    software: ['Agent API'],
                    features: ['Screen Output', 'Camera Input', 'Action Feedback', 'Demo Flow']
                }),
                createProjectFile('build-log.md', 'markdown', `# Build Log

## 2026-04

- 明确这是一个硬件原型规划项目，不夸大为已完成产品
- 把工作拆成最小可实现版本、方案对比和演示路径
- 先聚焦可落地的 MVP 边界
`)
            ],
            terminalOutput: [
                '> npm run inspect:project',
                'Loading project metadata...',
                'Checking modules...',
                'MVP Scope .......... ready',
                'Board Compare ...... building',
                'Camera Path ........ building',
                'Demo Route ......... planning',
                'Project status: Planning',
                'Next step: choose a first-pass board and camera combination'
            ]
        })
    ]
}

function cloneContent(content = defaultSiteContent) {
    return JSON.parse(JSON.stringify(content))
}

function normalizeExperienceItems(items) {
    if (!Array.isArray(items) || !items.length) {
        return cloneContent(defaultSiteContent).experiences
    }

    const legacyTitles = new Set([
        '个人内容平台与 Agent 工作流搭建',
        '交互式作品集与内容体验设计'
    ])

    const looksLegacy = items.every((item) => legacyTitles.has(item?.title)) && !items.some((item) => item?.relatedProjectId)
    return looksLegacy ? cloneContent(defaultSiteContent).experiences : items
}

function normalizeProjectItems(items) {
    if (!Array.isArray(items) || !items.length) {
        return cloneContent(defaultSiteContent).projects
    }

    const legacyIds = new Set([
        'boke-content-platform',
        'agent-forum-writing-desk',
        'pixel-portfolio-ide-experience'
    ])

    const looksLegacy = items.length === 3 && items.every((item) => legacyIds.has(item?.id))
    return looksLegacy ? cloneContent(defaultSiteContent).projects : items
}

function replaceArray(target, source) {
    target.splice(0, target.length, ...(source || []))
}

function replaceObject(target, source) {
    Object.keys(target).forEach((key) => {
        if (!(key in source)) {
            delete target[key]
        }
    })

    Object.entries(source || {}).forEach(([key, value]) => {
        target[key] = value
    })
}

const initialContent = cloneContent()

export const personalInfo = reactive(initialContent.personalInfo)
export const socialLinks = reactive(initialContent.socialLinks)
export const navItems = reactive(initialContent.navItems)
export const skills = reactive(initialContent.skills)
export const experiences = reactive(initialContent.experiences)
export const projects = reactive(initialContent.projects)

export function applySiteContent(nextContent = {}) {
    const normalized = {
        ...cloneContent(defaultSiteContent),
        ...nextContent,
        experiences: normalizeExperienceItems(nextContent.experiences),
        projects: normalizeProjectItems(nextContent.projects),
    }

    replaceObject(personalInfo, normalized.personalInfo || defaultSiteContent.personalInfo)
    replaceArray(socialLinks, normalized.socialLinks || defaultSiteContent.socialLinks)
    replaceArray(navItems, normalized.navItems || defaultSiteContent.navItems)
    replaceArray(skills, normalized.skills || defaultSiteContent.skills)
    replaceArray(experiences, normalized.experiences || defaultSiteContent.experiences)
    replaceArray(projects, normalized.projects || defaultSiteContent.projects)
}

export function getSiteContentSnapshot() {
    return cloneContent({
        personalInfo,
        socialLinks,
        navItems,
        skills,
        experiences,
        projects,
    })
}
