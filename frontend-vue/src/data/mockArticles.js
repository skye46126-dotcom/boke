export const mockArticles = [
  {
    id: 'article-published-1',
    title: 'Vue 3 + Tailwind CSS 重构指南',
    slug: 'vue3-tailwind-refactor-guide',
    content: `
      <h2 id="overview">概览</h2>
      <p>这是一篇用于功能骨架演示的正式文章，保留了文章区与 Agent 内容区的边界。</p>
      <h2 id="service-layer">Service 层拆分</h2>
      <p>页面只负责布局，查询逻辑收敛到 services，状态流转放在 composables。</p>
    `,
    excerpt: '将文章读取逻辑迁移到 service 层，并为后续写作台和 Agent 动态做结构预留。',
    status: 'published',
    author_type: 'human',
    tags: ['Vue 3', 'Tailwind CSS', 'Architecture'],
    date: '2026-01-20',
    published_at: '2026-01-20T10:00:00Z',
    views: 126,
  },
  {
    id: 'article-published-2',
    title: 'GitHub 风格博客设计实现',
    slug: 'github-style-blog-design',
    content: `
      <h2 id="design">设计方向</h2>
      <p>文章区继续承担正式表达，列表页只展示摘要，详情页展示完整内容。</p>
      <h2 id="seo">公开内容</h2>
      <p>正式文章默认面向 SEO 和外部读者，因此必须只展示 published 状态。</p>
    `,
    excerpt: '让 Articles 专注正式文章表达，同时为后台审核和草稿状态打基础。',
    status: 'published',
    author_type: 'human',
    tags: ['Design', 'CSS', 'GitHub'],
    date: '2026-01-18',
    published_at: '2026-01-18T08:30:00Z',
    views: 84,
  },
  {
    id: 'article-published-3',
    title: '构建交互式终端组件',
    slug: 'interactive-terminal-component',
    content: `
      <h2 id="terminal">终端交互</h2>
      <p>终端仍然保留在公开站点中，但不承担后台审核或 Agent 任务管理职责。</p>
      <h2 id="boundary">内容边界</h2>
      <p>Guestbook、Agent Forum、Articles、Writing Desk 分开，才能避免首页失控。</p>
    `,
    excerpt: '交互式终端仍保留在前台，但后台工作流不混入公开浏览路径。',
    status: 'published',
    author_type: 'human',
    tags: ['Vue 3', 'Components', 'UI'],
    date: '2026-01-25',
    published_at: '2026-01-25T14:15:00Z',
    views: 203,
  },
  {
    id: 'article-draft-1',
    title: 'Agent 代写文章工作流草稿',
    slug: 'agent-writing-workflow-draft',
    content: `
      <h2 id="draft">草稿说明</h2>
      <p>这篇文章由 Agent 基于项目需求文档生成，当前仍处于草稿状态。</p>
    `,
    excerpt: '用于演示 Writing Desk 中的草稿列表。',
    status: 'draft',
    author_type: 'agent_assisted',
    agent_id: 'agent-writing-assistant',
    source_type: 'project_doc',
    source_id: 'doc-agent-ui-refactor',
    review_note: null,
    date: '2026-04-24',
    published_at: null,
    views: 0,
    tags: ['Agent', 'Workflow', 'Draft'],
  },
  {
    id: 'article-review-1',
    title: '博客内容分层与 Agent 发布规范',
    slug: 'content-boundary-review',
    content: `
      <h2 id="review">待审核内容</h2>
      <p>这是一篇待审核文章，用于演示 pending_review 状态。</p>
    `,
    excerpt: '用于演示待审核文章列表。',
    status: 'pending_review',
    author_type: 'agent_generated',
    agent_id: 'agent-project-observer',
    source_type: 'project_doc',
    source_id: 'doc-agent-ui-refactor',
    review_note: '需要补充真实案例后再发布。',
    date: '2026-04-23',
    published_at: null,
    views: 0,
    tags: ['Review', 'Agent', 'Governance'],
  },
]
