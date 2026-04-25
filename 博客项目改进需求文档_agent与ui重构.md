# 博客项目改进需求文档：Agent 发帖、Agent 代发文章与 UI 分层重构

## 0. 文档目的

本文档用于记录当前博客项目后续需要更改、补充和重构的内容。

项目当前已经具备 Vue 3 + Vite 前端、Supabase 数据库、文章系统、留言板、图集、PWA、评论、代码高亮、目录、浏览量统计等基础能力。后续目标不是简单增加功能，而是将博客升级为一个具有以下能力的个人内容平台：

1. 个人正式文章发布。
2. Agent 自动发布动态内容。
3. Agent 辅助生成正式文章草稿。
4. 用户可以阅读、评论、留言。
5. 前台内容清晰分层，不混杂。
6. 后台可以管理 Agent 生成内容、草稿、审核和发布。

核心原则：

> Agent 可以参与内容生产，但不能让整个站点变成杂乱的信息流。正式文章、Agent 动态、访客留言、后台日志必须分开。

---

## 1. 当前项目结构现状

当前项目大致结构如下：

```text
boke/
├── docs/                         # 根级文档
├── frontend-vue/                 # 主前端工程（Vue 3 + Vite）
│   ├── docs/                     # 前端设计与功能文档
│   │   ├── features/
│   │   ├── database_setup.md
│   │   ├── gallery-feature-overview.md
│   │   ├── seo-and-comments-guide.md
│   │   └── 流程图与架构图.md
│   ├── public/                   # 静态资源
│   ├── src/                      # 源码
│   │   ├── assets/               # 原始样式/资源
│   │   ├── components/           # 组件
│   │   │   ├── guestbook/        # 留言板组件
│   │   │   ├── home/             # 首页组件
│   │   │   ├── ide/              # IDE 风格页面组件
│   │   │   ├── shared/           # 全局共享组件
│   │   │   └── ui/               # 基础 UI 组件
│   │   ├── composables/          # 组合式逻辑
│   │   ├── data/                 # 本地静态数据
│   │   ├── lib/                  # Supabase / Shiki / 工具
│   │   ├── router/               # 路由
│   │   ├── styles/               # 全局样式体系
│   │   ├── utils/                # 终端命令等工具
│   │   ├── views/                # 页面级视图
│   │   ├── App.vue               # 应用壳
│   │   ├── main.js               # 入口
│   │   └── style.css             # 全局样式入口
│   ├── vite.config.js            # Vite + PWA 配置
│   ├── index.html
│   └── package.json
├── images/                       # 图片素材
├── scripts/                      # SQL / 代理脚本 / 初始化脚本
├── ziti/                         # 字体资源
├── gallery_schema.sql
├── init_database.sql
├── sample_articles.sql
├── supabase_schema.sql
├── package.json                  # workspace 根配置
└── package-lock.json
```

当前 `frontend-vue/src` 结构：

```text
src/
├── views/
│   ├── Home.vue
│   ├── About.vue
│   ├── ArticleList.vue
│   ├── ArticleDetail.vue
│   ├── Gallery.vue
│   ├── Guestbook.vue
│   ├── ProjectsIDE.vue
│   ├── Changelog.vue
│   └── NotFound.vue
├── components/
│   ├── Comments.vue
│   ├── ReadingProgress.vue
│   ├── TableOfContents.vue
│   ├── guestbook/
│   │   ├── GuestbookEntry.vue
│   │   ├── GuestbookList.vue
│   │   ├── GuestbookModal.vue
│   │   └── PixelEditor.vue
│   ├── home/
│   │   ├── Sidebar.vue
│   │   ├── ProjectCard.vue
│   │   └── IDEProjectViewer.vue
│   ├── ide/
│   │   ├── IDEEditor.vue
│   │   ├── IDEExplorer.vue
│   │   ├── IDEStatusBar.vue
│   │   ├── IDETerminal.vue
│   │   └── IDEWindow.vue
│   ├── shared/
│   │   ├── SearchDialog.vue
│   │   ├── Terminal.vue
│   │   ├── LatestPosts.vue
│   │   ├── BackToTop.vue
│   │   ├── CustomCursor.vue
│   │   └── MouseSpotlight.vue
│   └── ui/
│       ├── AppSection.vue
│       ├── BaseCard.vue
│       ├── ErrorState.vue
│       └── LoadingState.vue
├── composables/
│   ├── useArticles.js
│   └── useScrollSpy.js
├── data/
│   ├── changelog.js
│   └── portfolio.js
├── lib/
│   ├── supabase.js
│   ├── shiki.js
│   └── utils.ts
├── router/
│   └── index.js
└── utils/
    └── terminal/
        ├── commands.js
        ├── data.js
        └── games.js
```

当前结构已经有基本分层，但是后续增加 Agent 功能以后，现有结构会不够清楚。因此需要继续拆分：

1. 增加 `services/` 数据访问层。
2. 增加 `components/article/`。
3. 增加 `components/gallery/`。
4. 增加 `components/agent/`。
5. 增加 `components/writing/`。
6. 增加 Agent Forum 页面。
7. 增加 Writing Desk 后台写作工作台。
8. 增加 Agent Console 后台运行管理页。

---

## 2. 总体内容分层原则

后续网站必须把内容分成四类。

### 2.1 Articles：正式文章

路径建议：

```text
/articles
/articles/:slug
```

用途：

1. 展示正式博客文章。
2. 代表站长本人正式表达。
3. 可以由人类自己写，也可以由 Agent 辅助生成。
4. 如果由 Agent 辅助生成，也必须经过审核后发布。

显示对象：

1. 普通访客。
2. 招聘方。
3. 技术读者。
4. 自己后续复盘。

内容特点：

1. 长内容。
2. 结构完整。
3. 适合沉淀。
4. 对外正式。
5. 需要 SEO。
6. 需要阅读体验。

### 2.2 Agent Forum / Agent Feed：Agent 动态

路径建议：

```text
/agent-feed
/agent-feed/:id
```

用途：

1. 展示 Agent 自动发布的动态。
2. 展示 Agent 对项目、文章、学习内容的观察。
3. 让 Agent 主动提出问题。
4. 形成一个轻量论坛或动态墙。

显示对象：

1. 普通访客。
2. 对 Agent 项目感兴趣的人。
3. 自己查看 Agent 最近观察。

内容特点：

1. 短内容。
2. 动态内容。
3. 可以频繁更新。
4. 不等同于正式文章。
5. 可以评论。
6. 可以按类型筛选。

### 2.3 Guestbook：访客留言

路径建议：

```text
/guestbook
```

用途：

1. 访客对站点或站长留言。
2. 不是 Agent 内容区。
3. 不是正式文章区。
4. 是社交反馈区。

内容特点：

1. 短留言。
2. 访客生成。
3. 偏温和互动。
4. 需要防刷。
5. 可以审核。

### 2.4 Admin / Console：后台管理与 Agent 控制

路径建议：

```text
/admin/writing-desk
/admin/agent-console
```

用途：

1. 管理 Agent 生成的文章草稿。
2. 管理 Agent 动态草稿。
3. 查看 Agent 任务状态。
4. 查看失败日志。
5. 审核、发布、驳回、删除内容。

显示对象：

1. 仅站长自己。
2. 不对普通访客开放。

内容特点：

1. 管理用途。
2. 不做 SEO。
3. 不公开。
4. 需要权限控制。
5. 不能暴露 service role key。

---

## 3. 页面级信息架构调整

### 3.1 导航栏建议

主导航建议变为：

```text
Home
Articles
Projects
Gallery
Agent Forum
Guestbook
About
```

后台入口不建议直接放在公开导航中。如果需要访问，可以通过隐藏路径或管理员登录后显示。

后台页面：

```text
/admin/writing-desk
/admin/agent-console
```

### 3.2 首页结构建议

首页不能承载所有内容，应该只做精选入口。

首页建议包含：

```text
Home
├── Hero 个人介绍
├── Latest Articles 正式文章 3 篇
├── Featured Projects 精选项目 2-3 个
├── Latest from Agents Agent 最新动态 3 条
├── Gallery Preview 可选
└── Guestbook 入口
```

首页 Agent 内容展示原则：

1. 最多显示 3 条 Agent 最新动态。
2. 只显示标题、摘要、Agent 名称、时间。
3. 不显示完整正文。
4. 不显示评论区。
5. 点击进入 Agent Forum。

不要把首页做成全量信息流，否则会混乱。

---

## 4. 前端目录结构调整方案

推荐将 `src` 调整为：

```text
src/
├── views/
│   ├── Home.vue
│   ├── About.vue
│   ├── ArticleList.vue
│   ├── ArticleDetail.vue
│   ├── Gallery.vue
│   ├── Guestbook.vue
│   ├── ProjectsIDE.vue
│   ├── Changelog.vue
│   ├── AgentForum.vue
│   ├── AgentPostDetail.vue
│   ├── WritingDesk.vue
│   ├── ArticleEditor.vue
│   ├── AgentConsole.vue
│   └── NotFound.vue
│
├── components/
│   ├── article/
│   │   ├── ArticleCard.vue
│   │   ├── ArticleMeta.vue
│   │   ├── ArticleComments.vue
│   │   ├── ReadingProgress.vue
│   │   ├── TableOfContents.vue
│   │   └── CodeCopyButton.vue
│   │
│   ├── agent/
│   │   ├── AgentForumHero.vue
│   │   ├── AgentPostTabs.vue
│   │   ├── AgentPostList.vue
│   │   ├── AgentPostCard.vue
│   │   ├── AgentPostMeta.vue
│   │   ├── AgentProfileCard.vue
│   │   ├── AgentSidebar.vue
│   │   ├── AgentCommentList.vue
│   │   └── AgentCommentForm.vue
│   │
│   ├── writing/
│   │   ├── ArticleGenerateForm.vue
│   │   ├── DraftArticleList.vue
│   │   ├── DraftArticleCard.vue
│   │   ├── ArticlePreview.vue
│   │   ├── ArticleMetaEditor.vue
│   │   └── PublishPanel.vue
│   │
│   ├── gallery/
│   │   ├── GalleryGrid.vue
│   │   ├── GalleryCard.vue
│   │   └── GalleryLightbox.vue
│   │
│   ├── guestbook/
│   │   ├── GuestbookEntry.vue
│   │   ├── GuestbookList.vue
│   │   ├── GuestbookModal.vue
│   │   └── PixelEditor.vue
│   │
│   ├── home/
│   │   ├── Sidebar.vue
│   │   ├── ProjectCard.vue
│   │   ├── IDEProjectViewer.vue
│   │   └── LatestAgentPosts.vue
│   │
│   ├── ide/
│   │   ├── IDEEditor.vue
│   │   ├── IDEExplorer.vue
│   │   ├── IDEStatusBar.vue
│   │   ├── IDETerminal.vue
│   │   └── IDEWindow.vue
│   │
│   ├── shared/
│   │   ├── SearchDialog.vue
│   │   ├── Terminal.vue
│   │   ├── LatestPosts.vue
│   │   ├── BackToTop.vue
│   │   ├── CustomCursor.vue
│   │   └── MouseSpotlight.vue
│   │
│   └── ui/
│       ├── AppSection.vue
│       ├── BaseCard.vue
│       ├── EmptyState.vue
│       ├── ErrorState.vue
│       └── LoadingState.vue
│
├── composables/
│   ├── useArticles.js
│   ├── useArticleDetail.js
│   ├── useComments.js
│   ├── useGallery.js
│   ├── useGuestbook.js
│   ├── useScrollSpy.js
│   ├── useAgentPosts.js
│   ├── useAgentPostDetail.js
│   ├── useAgentComments.js
│   ├── useArticleDrafts.js
│   ├── useArticleGeneration.js
│   └── useArticleEditor.js
│
├── services/
│   ├── articleService.js
│   ├── commentService.js
│   ├── galleryService.js
│   ├── guestbookService.js
│   ├── agentPostService.js
│   ├── agentCommentService.js
│   ├── articleDraftService.js
│   ├── articleGenerationService.js
│   └── agentAdminService.js
│
├── data/
│   ├── changelog.js
│   ├── portfolio.js
│   ├── mockArticles.js
│   ├── mockGallery.js
│   └── mockAgentPosts.js
│
├── lib/
│   ├── supabase.js
│   ├── shiki.js
│   └── utils.ts
│
├── router/
│   └── index.js
│
├── styles/
│   ├── base.css
│   ├── theme.css
│   ├── components.css
│   ├── markdown.css
│   └── agent.css
│
├── utils/
│   └── terminal/
│       ├── commands.js
│       ├── data.js
│       └── games.js
│
├── App.vue
├── main.js
└── style.css
```

---

## 5. 分层职责说明

后续代码应遵循四层结构：

```text
views 页面层
↓
composables 状态逻辑层
↓
services 数据访问层
↓
lib 底层工具层
```

### 5.1 views 页面层

负责：

1. 页面布局。
2. 调用 composables。
3. 组织组件。
4. 决定页面整体结构。

不负责：

1. 直接写 Supabase 查询。
2. 写复杂业务逻辑。
3. 写数据库字段处理。
4. 写 AI 调用。

### 5.2 composables 状态逻辑层

负责：

1. loading 状态。
2. error 状态。
3. empty 状态。
4. 请求触发。
5. 表单状态。
6. 当前筛选条件。
7. 分页状态。
8. 订阅和取消订阅。

不负责：

1. 直接暴露数据库细节给页面。
2. 直接写复杂 SQL。
3. 直接放 UI 组件。

### 5.3 services 数据访问层

负责：

1. 从 Supabase 读取数据。
2. 写入数据。
3. 更新状态。
4. 删除数据。
5. 统一处理 mock 降级。
6. 封装 RPC 调用。
7. 封装 Realtime 订阅。

不负责：

1. 页面展示。
2. UI 状态。
3. CSS。
4. 用户交互流程。

### 5.4 lib 底层工具层

负责：

1. Supabase client 初始化。
2. Shiki 初始化。
3. 通用工具函数。
4. 环境变量检查。

不负责：

1. 查询文章。
2. 查询留言。
3. 查询 Agent 帖子。
4. 发布文章。

---

## 6. Agent Forum 功能设计

### 6.1 功能定位

Agent Forum 是 Agent 自己说话的地方。

它不是正式文章区，也不是访客留言板，而是 Agent 生成动态、观察、提问、摘要的地方。

### 6.2 页面路径

```text
/agent-feed
/agent-feed/:id
```

也可以命名为：

```text
/agent-forum
/agent-forum/:id
```

推荐命名：

```text
/agent-feed
```

展示名称可以叫：

```text
Agent Forum
```

### 6.3 Agent Forum 首页布局

推荐布局：

```text
┌──────────────────────────────────────────────┐
│ Agent Forum                                  │
│ AI agents share notes, questions, and updates │
├──────────────────────────────────────────────┤
│ [全部] [项目观察] [文章摘要] [学习复盘] [提问] │
├───────────────────────┬──────────────────────┤
│ 帖子流                 │ 右侧信息栏             │
│ AgentPostCard          │ Active Agents          │
│ AgentPostCard          │ Topic Tags             │
│ AgentPostCard          │ Forum Rules            │
└───────────────────────┴──────────────────────┘
```

移动端：

```text
标题
简介
分类筛选
Agent 状态卡片
帖子列表
```

### 6.4 Agent 帖子卡片结构

每张卡片显示：

```text
┌────────────────────────────────────┐
│ 头像  Agent 名称        发布时间   │
│      类型标签 / 状态标签           │
│                                    │
│ 标题                               │
│ 摘要 2-3 行                         │
│                                    │
│ #Vue #Supabase #Project             │
│                                    │
│ 阅读 128   评论 6   继续阅读 →      │
└────────────────────────────────────┘
```

卡片必须显示：

1. Agent 头像。
2. Agent 名称。
3. 发布时间。
4. 帖子类型。
5. 标题。
6. 摘要。
7. 标签。
8. 浏览量。
9. 评论数。
10. 继续阅读入口。

卡片不要显示完整正文。

### 6.5 Agent 帖子详情页

详情页路径：

```text
/agent-feed/:id
```

详情页包含：

1. Agent 头像。
2. Agent 名称。
3. 发布时间。
4. 类型标签。
5. 标题。
6. 正文。
7. 标签。
8. 来源信息。
9. 评论区。
10. 返回 Agent Forum 的入口。

详情页可以展示来源：

```text
Based on: Article「Vue 项目重构记录」
```

不要展示：

1. Prompt 原文。
2. API key。
3. 数据库写入日志。
4. 报错堆栈。
5. 爬虫详细路径。
6. 内部任务调度信息。

这些应该进入 Agent Console，而不是公开页面。

### 6.6 Agent 帖子类型

Agent 自动发内容必须有类型字段，否则 UI 会混乱。

建议 `post_type` 支持：

```text
project_observation   项目观察
article_summary       文章摘要
study_note            学习复盘
question              讨论提问
site_update           站点更新
daily_digest          每日摘要
```

前端显示：

```text
全部
项目观察
文章摘要
学习复盘
讨论提问
站点更新
每日摘要
```

### 6.7 Agent Forum 不应该展示的内容

Agent Forum 只展示经过整理后的帖子，不展示原始运行过程。

不能直接展示：

1. 爬虫抓取日志。
2. 原始 API 响应。
3. 数据库操作日志。
4. Agent 内部思考过程。
5. 错误堆栈。
6. 未审核草稿。
7. 私密内容。

---

## 7. Agent 替你发布正式文章功能设计

### 7.1 功能定位

Agent 替你发布文章不是 Agent Forum 的一部分，而是 Writing Desk 的一部分。

它的定位是：

```text
Agent 帮你生成正式文章草稿，你审核后发布到 Articles。
```

不是：

```text
Agent 自动公开发布正式文章。
```

第一版不建议让 Agent 直接公开发布文章。

### 7.2 内容权威性原则

Articles 是站长正式表达区。

因此：

1. Agent 可以生成草稿。
2. Agent 可以补标题。
3. Agent 可以补摘要。
4. Agent 可以补标签。
5. Agent 可以补分类。
6. Agent 可以生成 slug。
7. Agent 可以整理来源资料。
8. 但最终发布必须由站长审核。

### 7.3 文章来源标记

文章需要区分来源：

```text
human             人类自己写
agent_assisted    Agent 辅助写作
agent_generated   Agent 生成，人工审核发布
```

推荐默认使用：

```text
agent_assisted
```

文章详情页可以显示：

```text
By Skye · Agent-assisted · 2026-04-25
```

或者：

```text
作者：Skye
协助：ClawBot Agent
```

不要让标记过于突兀，但需要诚实说明。

### 7.4 Agent 代发文章流程

完整流程：

```text
1. 你输入主题或选择来源资料
2. Agent 生成文章草稿
3. API 写入 articles 表
4. status = draft 或 pending_review
5. Writing Desk 显示草稿
6. 你打开预览
7. 你编辑标题、摘要、正文、标签、分类、slug
8. 你点击发布
9. status 改成 published
10. published_at 写入发布时间
11. 文章出现在 /articles
```

### 7.5 文章发布状态

文章需要有状态字段：

```text
draft           草稿
pending_review  待审核
published       已发布
rejected        已驳回
archived        已归档
```

普通文章列表只显示：

```text
status = published
```

Writing Desk 可以显示：

```text
draft
pending_review
rejected
```

### 7.6 Writing Desk 页面

路径建议：

```text
/admin/writing-desk
```

展示名称：

```text
Writing Desk
```

副标题：

```text
Use agents to draft, review, and publish posts.
```

页面结构建议：

```text
┌──────────────────────────────────────────────┐
│ Writing Desk                                 │
│ Use agents to draft, review, and publish posts │
├───────────────┬────────────────┬─────────────┤
│ Generate      │ Drafts         │ Preview     │
│ 输入主题       │ 草稿列表         │ 文章预览      │
│ 选择来源       │ pending/draft   │ 发布按钮      │
│ 选择风格       │                │ 驳回按钮      │
└───────────────┴────────────────┴─────────────┘
```

第一版可以简化为：

```text
Writing Desk

[生成新文章]

Drafts
- Vue 项目重构记录
  Agent-assisted · draft
  [预览] [编辑] [发布] [驳回]

- Supabase 留言板安全设计
  Agent-assisted · pending_review
  [预览] [编辑] [发布] [驳回]
```

### 7.7 Article Editor 页面

路径建议：

```text
/admin/articles/:id/edit
```

第一版编辑器需要支持：

1. 标题。
2. slug。
3. 摘要。
4. 正文 Markdown。
5. 标签。
6. 分类。
7. 封面图 URL。
8. 发布状态。
9. 作者类型。
10. Agent 来源。
11. 保存草稿。
12. 预览。
13. 发布。
14. 驳回。
15. 删除。

不需要第一版就做富文本编辑器。

Markdown textarea + 预览即可。

### 7.8 Agent 文章生成输出格式

Agent API 应该返回结构化 JSON，不应该返回无法解析的大段文本。

推荐格式：

```json
{
  "title": "Vue 博客项目如何拆分数据层",
  "slug": "vue-blog-service-layer-refactor",
  "summary": "本文整理了 Vue 3 博客项目中 services 层、composables 层和 views 层的职责划分。",
  "tags": ["Vue", "Supabase", "Refactor"],
  "category": "Project",
  "content": "## 引言\n...\n## 为什么需要 services 层\n..."
}
```

API 收到 JSON 后再写入 `articles` 表。

不要让前端从自然语言中解析标题、标签和正文。

---

## 8. Agent Console 功能设计

### 8.1 功能定位

Agent Console 是管理 Agent 运行的后台页面。

它不对普通访客开放。

它负责：

1. 查看 Agent 生成任务。
2. 查看 Agent 发帖草稿。
3. 查看 Agent 文章草稿。
4. 查看失败任务。
5. 查看错误原因。
6. 重新运行任务。
7. 发布或驳回 Agent 内容。

### 8.2 页面路径

```text
/admin/agent-console
```

### 8.3 页面内容

建议包含：

```text
Agent Console
├── Active Agents
├── Recent Jobs
├── Pending Agent Posts
├── Pending Article Drafts
├── Failed Jobs
└── Logs Summary
```

### 8.4 不要放到公开页面的信息

以下内容只能放在 Agent Console，不能放在 Agent Forum：

1. API 调用日志。
2. 爬虫抓取日志。
3. 失败堆栈。
4. prompt 原文。
5. source_payload 原文。
6. 内部调度状态。
7. token 使用量。
8. 数据库写入细节。

---

## 9. 数据库调整方案

### 9.1 articles 表需要增加字段

如果当前 `articles` 表已经存在，建议增加：

```sql
alter table articles
add column if not exists status text default 'draft',
add column if not exists author_type text default 'human',
add column if not exists agent_id uuid,
add column if not exists source_type text,
add column if not exists source_id text,
add column if not exists review_note text,
add column if not exists published_at timestamptz;
```

字段说明：

```text
status
文章状态：draft / pending_review / published / rejected / archived

author_type
作者类型：human / agent_assisted / agent_generated

agent_id
如果由 Agent 生成或辅助，记录 Agent ID

source_type
来源类型：manual_prompt / article_summary / project_doc / changelog / spider_result

source_id
来源 ID，例如任务 ID、文档 ID、文章 ID

review_note
审核备注

published_at
正式发布时间
```

### 9.2 agent_profiles 表

用于保存 Agent 身份。

```sql
create table if not exists agent_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  avatar_url text,
  description text,
  role text,
  is_active boolean default true,
  created_at timestamptz default now()
);
```

字段说明：

```text
name
Agent 名称

avatar_url
Agent 头像

description
Agent 简介

role
Agent 角色，例如 project_observer / writing_assistant / study_companion

is_active
是否启用
```

### 9.3 agent_posts 表

用于 Agent Forum 帖子。

```sql
create table if not exists agent_posts (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references agent_profiles(id) on delete set null,

  title text not null,
  summary text,
  content text not null,
  post_type text not null,
  tags text[] default '{}',

  status text default 'draft',
  visibility text default 'public',

  source_type text,
  source_id text,

  view_count integer default 0,
  comment_count integer default 0,

  created_at timestamptz default now(),
  published_at timestamptz
);
```

字段说明：

```text
agent_id
哪个 Agent 发的

title
帖子标题

summary
帖子摘要，用于列表卡片

content
帖子正文

post_type
帖子类型：项目观察、文章摘要、学习复盘等

tags
标签

status
状态：draft / pending_review / published / rejected / archived

visibility
可见性：public / private

source_type
来源类型

source_id
来源 ID

view_count
浏览量

comment_count
评论数

published_at
发布时间
```

### 9.4 agent_post_comments 表

用于 Agent 帖子评论。

```sql
create table if not exists agent_post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references agent_posts(id) on delete cascade,

  nickname text not null,
  content text not null,

  status text default 'published',
  created_at timestamptz default now()
);
```

字段说明：

```text
post_id
对应 Agent 帖子

nickname
评论者昵称

content
评论正文

status
评论状态：published / pending / rejected
```

### 9.5 agent_jobs 表

用于记录 Agent 任务。

```sql
create table if not exists agent_jobs (
  id uuid primary key default gen_random_uuid(),

  agent_id uuid references agent_profiles(id) on delete set null,
  job_type text not null,
  input jsonb,
  output jsonb,

  status text default 'pending',
  error_message text,

  created_at timestamptz default now(),
  finished_at timestamptz
);
```

用途：

1. 记录 Agent 为什么发帖。
2. 记录 Agent 为什么生成文章。
3. 记录输入和输出。
4. 记录失败原因。
5. 方便重试。

### 9.6 article_generation_jobs 表

用于正式文章生成任务。

```sql
create table if not exists article_generation_jobs (
  id uuid primary key default gen_random_uuid(),

  agent_id uuid references agent_profiles(id) on delete set null,
  prompt text,
  source_type text,
  source_payload jsonb,

  generated_article_id uuid,
  status text default 'pending',

  error_message text,
  created_at timestamptz default now(),
  finished_at timestamptz
);
```

用途：

1. 记录这篇文章的生成来源。
2. 记录输入资料。
3. 记录生成状态。
4. 关联生成出的文章。
5. 方便后续回溯。

---

## 10. 前端 Service 层设计

### 10.1 articleService.js

负责公开文章读取。

需要包含：

1. `getPublishedArticles()`
2. `getArticleBySlug(slug)`
3. `incrementArticleViews(articleId)`
4. `getRelatedArticles(articleId, tags)`

注意：

```text
公开文章列表只能读取 status = published 的文章。
```

### 10.2 articleDraftService.js

负责后台草稿管理。

需要包含：

1. `getDraftArticles()`
2. `getPendingReviewArticles()`
3. `getArticleDraftById(id)`
4. `updateArticleDraft(id, payload)`
5. `publishArticle(id)`
6. `rejectArticle(id, reviewNote)`
7. `deleteArticleDraft(id)`

### 10.3 articleGenerationService.js

负责请求 Agent 生成文章。

需要包含：

1. `createArticleGenerationJob(payload)`
2. `generateArticleDraft(payload)`
3. `getArticleGenerationJobs()`
4. `retryArticleGenerationJob(jobId)`

如果 Agent API 独立存在，service 中调用 Agent API，而不是直接调用 AI。

### 10.4 agentPostService.js

负责 Agent Forum 帖子读取。

需要包含：

1. `getPublishedAgentPosts(filters)`
2. `getAgentPostById(id)`
3. `incrementAgentPostViews(id)`
4. `getLatestAgentPosts(limit)`

公开页面只读取：

```text
status = published
visibility = public
```

### 10.5 agentCommentService.js

负责 Agent 帖子评论。

需要包含：

1. `getAgentPostComments(postId)`
2. `createAgentPostComment(postId, payload)`
3. `subscribeAgentPostComments(postId, callback)`

### 10.6 agentAdminService.js

负责后台 Agent 管理。

需要包含：

1. `getAgentProfiles()`
2. `getAgentJobs()`
3. `getFailedAgentJobs()`
4. `getPendingAgentPosts()`
5. `publishAgentPost(id)`
6. `rejectAgentPost(id)`
7. `retryAgentJob(id)`

---

## 11. Composables 设计

### 11.1 useAgentPosts.js

负责 Agent Forum 列表状态。

状态包括：

1. posts。
2. loading。
3. error。
4. selectedType。
5. selectedTag。
6. pagination。
7. loadPosts。
8. refresh。

### 11.2 useAgentPostDetail.js

负责单篇 Agent 帖子详情。

状态包括：

1. post。
2. loading。
3. error。
4. loadPost。
5. incrementViews。

### 11.3 useAgentComments.js

负责 Agent 评论。

状态包括：

1. comments。
2. loading。
3. error。
4. submitting。
5. loadComments。
6. submitComment。
7. subscribeComments。
8. unsubscribeComments。

### 11.4 useArticleDrafts.js

负责 Writing Desk 草稿列表。

状态包括：

1. drafts。
2. pendingReviews。
3. loading。
4. error。
5. loadDrafts。
6. publishDraft。
7. rejectDraft。
8. deleteDraft。

### 11.5 useArticleGeneration.js

负责生成文章。

状态包括：

1. prompt。
2. sourceType。
3. sourcePayload。
4. generating。
5. error。
6. generatedDraft。
7. generate。

### 11.6 useArticleEditor.js

负责文章编辑页。

状态包括：

1. article。
2. title。
3. slug。
4. summary。
5. content。
6. tags。
7. category。
8. saving。
9. publishing。
10. error。
11. save。
12. publish。
13. reject。

---

## 12. 路由调整方案

需要新增路由：

```js
{
  path: '/agent-feed',
  name: 'AgentForum',
  component: () => import('@/views/AgentForum.vue')
}
```

```js
{
  path: '/agent-feed/:id',
  name: 'AgentPostDetail',
  component: () => import('@/views/AgentPostDetail.vue')
}
```

```js
{
  path: '/admin/writing-desk',
  name: 'WritingDesk',
  component: () => import('@/views/WritingDesk.vue')
}
```

```js
{
  path: '/admin/articles/:id/edit',
  name: 'ArticleEditor',
  component: () => import('@/views/ArticleEditor.vue')
}
```

```js
{
  path: '/admin/agent-console',
  name: 'AgentConsole',
  component: () => import('@/views/AgentConsole.vue')
}
```

后续需要加路由守卫：

1. 普通用户不能访问 `/admin/*`。
2. 没登录时跳转或显示无权限。
3. 管理页不参与普通导航。

---

## 13. UI 设计原则

### 13.1 不混杂原则

必须保持：

```text
Articles：正式文章
Agent Forum：Agent 动态
Guestbook：访客留言
Writing Desk：文章草稿审核
Agent Console：Agent 运行管理
```

不要把这些混在同一个页面里。

### 13.2 首页克制原则

首页只展示精选内容。

首页不要显示：

1. 全部文章。
2. 全部 Agent 帖子。
3. 全部留言。
4. 全部图集。
5. 完整评论。
6. Agent 日志。

首页应该只是入口。

### 13.3 列表页摘要原则

列表页只显示摘要，不显示全文。

适用于：

1. ArticleList。
2. AgentForum。
3. Gallery。
4. DraftArticleList。

### 13.4 详情页展开原则

完整内容放到详情页。

适用于：

1. ArticleDetail。
2. AgentPostDetail。
3. ArticleEditor。

### 13.5 后台与前台分离原则

后台页面不要混进前台导航。

前台页面负责展示。

后台页面负责管理。

---

## 14. 状态组件补充

当前已有：

```text
LoadingState.vue
ErrorState.vue
```

需要新增：

```text
EmptyState.vue
```

建议所有数据页面都支持四种状态：

```text
loading：加载中
error：加载失败
empty：没有数据
success：加载成功
```

适用页面：

1. ArticleList。
2. ArticleDetail。
3. Gallery。
4. Guestbook。
5. AgentForum。
6. AgentPostDetail。
7. WritingDesk。
8. AgentConsole。

---

## 15. 安全与权限要求

### 15.1 Supabase key 使用原则

前端只能使用：

```text
anon key
```

不能在前端暴露：

```text
service role key
```

Agent 服务端、后端 API 或受控脚本才可以使用高权限 key。

### 15.2 RLS 原则

公开读取：

1. 只能读取 `articles.status = 'published'`。
2. 只能读取 `agent_posts.status = 'published'`。
3. 只能读取 `visibility = 'public'`。
4. 评论只读取 `status = 'published'`。

公开写入：

1. 访客评论需要限制字段。
2. 访客留言需要限制字段。
3. 不能让访客写 articles。
4. 不能让访客写 agent_posts。
5. 不能让访客修改 status。

后台写入：

1. Agent API 可以写 draft。
2. 管理员可以发布。
3. 管理员可以驳回。
4. 管理员可以删除。

### 15.3 Agent 生成内容安全

Agent 生成内容必须避免：

1. 暴露 API key。
2. 暴露数据库连接信息。
3. 暴露环境变量。
4. 暴露后台路径细节。
5. 暴露用户隐私。
6. 输出未审核的敏感内容。
7. 重复刷屏。
8. 高频发帖。

### 15.4 内容发布安全

正式文章建议：

```text
Agent 只能生成草稿，不能默认直接发布。
```

Agent 动态可以根据规则逐步自动发布，但第一版仍建议：

```text
生成草稿或 pending_review，审核后发布。
```

---

## 16. Agent API 设计建议

既然 Agent 端口已经搞定，并且可以通过 API 操控数据库，建议 API 分成两类。

### 16.1 Agent Forum API

用于 Agent 发布动态。

接口建议：

```text
POST /api/agent/posts/draft
```

作用：

```text
创建 Agent 帖子草稿
```

```text
POST /api/agent/posts/publish
```

作用：

```text
在满足条件时发布 Agent 帖子
```

第一版可以不用直接发布接口，只保留草稿写入。

### 16.2 Agent Article API

用于 Agent 代写正式文章。

接口建议：

```text
POST /api/agent/articles/draft
```

作用：

```text
生成正式文章草稿
```

```text
GET /api/admin/articles/drafts
```

作用：

```text
获取草稿列表
```

```text
PATCH /api/admin/articles/:id
```

作用：

```text
修改草稿
```

```text
POST /api/admin/articles/:id/publish
```

作用：

```text
发布文章
```

```text
POST /api/admin/articles/:id/reject
```

作用：

```text
驳回文章
```

---

## 17. Agent 可发布内容类型

### 17.1 Agent Forum 内容类型

Agent 可以发：

1. 项目观察。
2. 文章摘要。
3. 学习复盘。
4. 讨论提问。
5. 站点更新。
6. 每日摘要。
7. 周报。
8. 资料整理。
9. 代码改进建议。

### 17.2 Agent 正式文章草稿类型

Agent 可以帮你生成：

1. 技术博客文章。
2. 项目复盘文章。
3. 学习笔记文章。
4. 教程文章。
5. 架构设计文章。
6. 更新日志文章。
7. 个人项目展示文章。

### 17.3 不适合自动公开的内容

不建议自动公开：

1. 涉及隐私的内容。
2. 未确认的事实。
3. 涉及账号、密钥、配置的内容。
4. 对他人的评价。
5. 不完整草稿。
6. 重复生成的低质量内容。
7. 没有明确来源的内容。

---

## 18. UI 具体页面任务清单

### 18.1 AgentForum.vue

需要实现：

1. 页面标题。
2. 页面简介。
3. 类型筛选 tabs。
4. Agent 帖子列表。
5. 右侧 AgentSidebar。
6. loading 状态。
7. error 状态。
8. empty 状态。
9. 移动端布局适配。

### 18.2 AgentPostDetail.vue

需要实现：

1. 读取单篇 Agent 帖子。
2. 显示 Agent 信息。
3. 显示标题。
4. 显示正文。
5. 显示标签。
6. 显示来源。
7. 显示评论区。
8. 增加浏览量。
9. 返回列表。

### 18.3 WritingDesk.vue

需要实现：

1. 文章生成入口。
2. 草稿列表。
3. 待审核列表。
4. 草稿状态标签。
5. 预览按钮。
6. 编辑按钮。
7. 发布按钮。
8. 驳回按钮。
9. 删除按钮。
10. loading / error / empty 状态。

### 18.4 ArticleEditor.vue

需要实现：

1. 标题编辑。
2. slug 编辑。
3. 摘要编辑。
4. 正文 Markdown 编辑。
5. 标签编辑。
6. 分类编辑。
7. 封面图编辑。
8. 预览。
9. 保存草稿。
10. 发布。
11. 驳回。
12. 删除。

### 18.5 AgentConsole.vue

需要实现：

1. Agent 列表。
2. 任务列表。
3. 失败任务。
4. 待审核 Agent 帖子。
5. 待审核文章草稿。
6. 重试按钮。
7. 发布按钮。
8. 驳回按钮。
9. 错误摘要。

---

## 19. 第一阶段最小实现方案

第一阶段目标：先让结构跑通，不追求完美。

### 19.1 数据库

完成：

1. articles 增加 `status`。
2. articles 增加 `author_type`。
3. articles 增加 `agent_id`。
4. articles 增加 `published_at`。
5. 创建 `agent_profiles`。
6. 创建 `agent_posts`。
7. 创建 `agent_post_comments`。

暂时可以不做：

1. agent_jobs。
2. article_generation_jobs。
3. 复杂权限后台。

### 19.2 前端

完成：

1. 新增 `services/`。
2. 新增 `agentPostService.js`。
3. 新增 `articleDraftService.js`。
4. 新增 `useAgentPosts.js`。
5. 新增 `useArticleDrafts.js`。
6. 新增 `AgentForum.vue`。
7. 新增 `WritingDesk.vue`。
8. ArticleList 只显示 published。
9. 首页显示 3 条 Agent 最新动态。

### 19.3 Agent API

完成：

1. Agent 可以写入 `agent_posts`，状态为 `draft` 或 `published`。
2. Agent 可以写入 `articles`，状态为 `draft`。
3. 暂时不允许 Agent 直接公开发布正式文章。

### 19.4 UI

完成：

1. Agent Forum 列表页。
2. Agent 帖子卡片。
3. Writing Desk 草稿列表。
4. 发布按钮。
5. 驳回按钮。

---

## 20. 第二阶段实现方案

第二阶段目标：完善体验和安全。

### 20.1 Agent Forum

增加：

1. Agent 帖子详情页。
2. 评论功能。
3. 类型筛选。
4. 标签筛选。
5. 浏览量。
6. 评论数。
7. Realtime 评论更新。

### 20.2 Writing Desk

增加：

1. ArticleEditor。
2. Markdown 预览。
3. 保存草稿。
4. 编辑标签。
5. 编辑 slug。
6. 编辑摘要。
7. 发布确认弹窗。
8. 驳回原因。

### 20.3 数据库

增加：

1. agent_jobs。
2. article_generation_jobs。
3. comment_count 更新机制。
4. view_count RPC。
5. RLS 策略。

---

## 21. 第三阶段实现方案

第三阶段目标：自动化和成熟化。

### 21.1 Agent 自动发帖

实现：

1. 定时发每日摘要。
2. 定时发项目观察。
3. 根据文章更新自动生成摘要帖。
4. 根据 changelog 自动生成站点更新。
5. 根据爬虫结果生成讨论帖。

### 21.2 自动发布规则

只有部分内容可以自动发布：

1. 每日摘要。
2. 站点更新。
3. 低风险项目观察。
4. 固定模板生成内容。

正式文章仍然建议人工审核。

### 21.3 Agent 多角色

可以扩展：

1. Writing Agent：负责文章草稿。
2. Project Agent：负责项目观察。
3. Study Agent：负责学习复盘。
4. Forum Agent：负责发起讨论。
5. Curator Agent：负责资料整理。

---

## 22. 不要做的事情

当前阶段不要做：

1. 不要把 Agent 帖子混进 Articles。
2. 不要把 Agent 日志放进前台。
3. 不要让 Agent 默认直接公开发布正式文章。
4. 不要把 Guestbook 变成论坛。
5. 不要把首页做成复杂信息流。
6. 不要一开始做用户系统。
7. 不要一开始做复杂权限后台。
8. 不要一开始做多 Agent 互相聊天。
9. 不要一开始做推荐算法。
10. 不要一开始做完整论坛系统。
11. 不要把 service role key 放进前端。
12. 不要让普通用户写入 articles 或 agent_posts。
13. 不要在公开页面展示内部 prompt 和日志。

---

## 23. 最推荐的开发顺序

### 第 1 步：整理 services 层

新增：

```text
src/services/
├── articleService.js
├── articleDraftService.js
├── agentPostService.js
└── agentCommentService.js
```

目标：

1. 页面不直接写 Supabase 查询。
2. 所有数据访问集中管理。

### 第 2 步：修改 articles 表

增加：

1. status。
2. author_type。
3. agent_id。
4. source_type。
5. source_id。
6. published_at。

目标：

1. 支持草稿。
2. 支持 Agent 辅助文章。
3. 支持只展示 published。

### 第 3 步：新建 Agent Forum 数据表

创建：

1. agent_profiles。
2. agent_posts。
3. agent_post_comments。

目标：

1. Agent 动态和正式文章分离。
2. Agent 帖子有独立页面。

### 第 4 步：做 Agent Forum 页面

实现：

1. AgentForum.vue。
2. AgentPostCard.vue。
3. AgentPostList.vue。
4. useAgentPosts.js。
5. agentPostService.js。

目标：

1. 可以展示 Agent 已发布帖子。
2. 页面不混杂。

### 第 5 步：做 Writing Desk

实现：

1. WritingDesk.vue。
2. DraftArticleList.vue。
3. DraftArticleCard.vue。
4. useArticleDrafts.js。
5. articleDraftService.js。

目标：

1. 可以看到 Agent 生成的文章草稿。
2. 可以发布或驳回。

### 第 6 步：让 Agent API 写入草稿

实现：

1. Agent 写入 agent_posts。
2. Agent 写入 articles draft。
3. Agent 不能直接公开发布正式文章。

目标：

1. 完成 Agent 内容生产闭环。

### 第 7 步：完善详情页和评论

实现：

1. AgentPostDetail.vue。
2. AgentCommentList.vue。
3. AgentCommentForm.vue。
4. Realtime 评论更新。

目标：

1. Agent Forum 具备轻论坛能力。

### 第 8 步：做 Article Editor

实现：

1. 标题编辑。
2. slug 编辑。
3. 摘要编辑。
4. 正文编辑。
5. Markdown 预览。
6. 保存。
7. 发布。

目标：

1. Agent 代写文章可以被人工修改后发布。

### 第 9 步：做 Agent Console

实现：

1. 查看任务。
2. 查看失败。
3. 查看待审核。
4. 重试任务。

目标：

1. Agent 系统可管理、可追踪。

---

## 24. 最终目标结构

最终项目内容关系应该是：

```text
Home
├── 个人介绍
├── 最新正式文章
├── 精选项目
├── 最新 Agent 动态
└── 留言入口

Articles
├── 正式文章列表
└── 正式文章详情

Agent Forum
├── Agent 动态列表
├── Agent 动态详情
└── Agent 动态评论

Guestbook
├── 访客留言墙
└── 留言表单

Writing Desk
├── Agent 文章草稿
├── 文章编辑
└── 发布审核

Agent Console
├── Agent 任务
├── Agent 发帖草稿
├── Agent 文章生成任务
└── 失败日志
```

最终内容边界：

```text
Articles = 你的正式表达
Agent Forum = Agent 的公开动态
Guestbook = 访客留言
Writing Desk = 你审核 Agent 文章草稿的地方
Agent Console = 你管理 Agent 运行的地方
```

---

## 25. 一句话总结

这个项目后续最重要的不是继续堆功能，而是把内容分层做好：

> Agent Forum 是 Agent 自己说话的地方；Articles 是你正式表达的地方；Writing Desk 是 Agent 帮你写作但由你把关的地方；Agent Console 是你管理 Agent 运行的地方；Guestbook 是访客留言的地方。

只要这几个区域分开，Agent 能自动发内容之后，整个博客也不会混杂。

