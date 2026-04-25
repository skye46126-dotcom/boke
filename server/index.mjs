import { createServer } from 'node:http'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'

function readEnvFile(path) {
  if (!existsSync(path)) {
    return {}
  }

  const content = readFileSync(path, 'utf8')
  const entries = []

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
      continue
    }

    const separator = trimmed.indexOf('=')
    const key = trimmed.slice(0, separator).trim()
    let value = trimmed.slice(separator + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    entries.push([key, value])
  }

  return Object.fromEntries(entries)
}

const env = {
  ...readEnvFile(resolve(process.cwd(), '.env')),
  ...readEnvFile(resolve(process.cwd(), '.env.local')),
  ...readEnvFile(resolve(process.cwd(), 'server/.env')),
  ...readEnvFile(resolve(process.cwd(), 'server/.env.local')),
  ...readEnvFile(resolve(process.cwd(), 'frontend-vue/.env')),
  ...readEnvFile(resolve(process.cwd(), 'frontend-vue/.env.local')),
  ...process.env,
}

const port = Number(env.API_PORT || env.PORT || 8787)
const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL
const supabaseAnonKey = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_KEY
const adminPassword = (env.ADMIN_PASSWORD || env.ADMIN_DEV_PASSWORD || env.VITE_ADMIN_PASSWORD || (env.NODE_ENV !== 'production' ? 'admin' : '')).trim()
const agentApiToken = (env.AGENT_API_TOKEN || '').trim()

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  console.error('Missing Supabase server configuration. Required: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const adminDb = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password, X-Agent-Token',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  })
  res.end(JSON.stringify(payload))
}

function notFound(res) {
  sendJson(res, 404, { error: 'Not found' })
}

function parsePath(reqUrl) {
  return new URL(reqUrl, `http://127.0.0.1:${port}`)
}

async function readJsonBody(req) {
  const chunks = []
  for await (const chunk of req) {
    chunks.push(chunk)
  }

  if (!chunks.length) {
    return {}
  }

  const raw = Buffer.concat(chunks).toString('utf8')

  try {
    return JSON.parse(raw)
  } catch {
    throw new Error('Invalid JSON body')
  }
}

function normalizeArticle(row) {
  return {
    ...row,
    tags: row.tags || [],
  }
}

function normalizeAgentPost(row) {
  return {
    ...row,
    tags: row.tags || [],
  }
}

async function requireAdmin(req) {
  const password = (req.headers['x-admin-password'] || '').trim()

  if (!adminPassword) {
    throw new Error('ADMIN_PASSWORD is not configured')
  }

  if (!password || password !== adminPassword) {
    throw new Error('Invalid admin password')
  }

  return { method: 'password' }
}

function requireAgent(req) {
  if (!agentApiToken) {
    throw new Error('AGENT_API_TOKEN is not configured')
  }

  const token = (req.headers['x-agent-token'] || '').trim()
  if (!token || token !== agentApiToken) {
    throw new Error('Invalid agent token')
  }
}

async function handleHealth(_req, res) {
  sendJson(res, 200, {
    ok: true,
    supabaseUrlConfigured: Boolean(supabaseUrl),
    serviceRoleConfigured: Boolean(supabaseServiceRoleKey),
  })
}

async function handleAgentPostDraft(req, res) {
  requireAgent(req)
  const body = await readJsonBody(req)

  const payload = {
    agent_id: body.agent_id || null,
    title: body.title,
    summary: body.summary || null,
    content: body.content,
    post_type: body.post_type || '项目观察',
    tags: Array.isArray(body.tags) ? body.tags : [],
    status: body.status || 'draft',
    visibility: body.visibility || 'public',
    source_type: body.source_type || null,
    source_id: body.source_id || null,
  }

  if (!payload.title || !payload.content) {
    return sendJson(res, 400, { error: 'title and content are required' })
  }

  const { data, error } = await adminDb
    .from('agent_posts')
    .insert(payload)
    .select('*')
    .single()

  if (error) {
    return sendJson(res, 400, { error: error.message })
  }

  sendJson(res, 201, { data: normalizeAgentPost(data) })
}

async function handleAgentArticleDraft(req, res) {
  requireAgent(req)
  const body = await readJsonBody(req)

  const articlePayload = {
    title: body.title,
    slug: body.slug,
    content: body.content,
    excerpt: body.excerpt || null,
    tags: Array.isArray(body.tags) ? body.tags : [],
    status: body.status || 'draft',
    author_type: body.author_type || 'agent_generated',
    agent_id: body.agent_id || null,
    source_type: body.source_type || null,
    source_id: body.source_id || null,
    review_note: null,
    date: body.date || new Date().toISOString().slice(0, 10),
    published_at: null,
  }

  if (!articlePayload.title || !articlePayload.slug || !articlePayload.content) {
    return sendJson(res, 400, { error: 'title, slug and content are required' })
  }

  const { data, error } = await adminDb
    .from('articles')
    .insert(articlePayload)
    .select('*')
    .single()

  if (error) {
    return sendJson(res, 400, { error: error.message })
  }

  sendJson(res, 201, { data: normalizeArticle(data) })
}

async function handleAdminGenerateDraft(req, res) {
  await requireAdmin(req)
  const body = await readJsonBody(req)

  const now = new Date()
  const slug = body.slug || String(body.title || 'agent-generated-draft')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

  const articlePayload = {
    title: body.title || 'Agent 生成的文章草稿',
    slug,
    content: body.content || `
      <h2 id="background">Background</h2>
      <p>${body.prompt || 'This draft was generated from the admin writing desk.'}</p>
      <h2 id="outline">Outline</h2>
      <p>补充案例、来源和最终结论后再进入发布。</p>
    `,
    excerpt: body.excerpt || '由后台 API 生成的 Agent 文章草稿。',
    tags: Array.isArray(body.tags) ? body.tags : ['Agent', 'Draft'],
    status: 'draft',
    author_type: 'agent_generated',
    agent_id: body.agent_id || null,
    source_type: body.source_type || 'manual_prompt',
    source_id: body.source_id || null,
    review_note: null,
    date: now.toISOString().slice(0, 10),
    published_at: null,
  }

  const { data: article, error: articleError } = await adminDb
    .from('articles')
    .insert(articlePayload)
    .select('*')
    .single()

  if (articleError) {
    return sendJson(res, 400, { error: articleError.message })
  }

  const { data: job } = await adminDb
    .from('article_generation_jobs')
    .insert({
      agent_id: body.agent_id || null,
      prompt: body.prompt || null,
      source_type: body.source_type || 'manual_prompt',
      source_payload: body.source_payload || {},
      generated_article_id: article.id,
      status: 'completed',
      finished_at: now.toISOString(),
    })
    .select('*')
    .single()

  sendJson(res, 201, {
    data: {
      article: normalizeArticle(article),
      job: job || null,
    },
  })
}

async function handleAdminGetDrafts(_req, res) {
  await requireAdmin(_req)

  const { data, error } = await adminDb
    .from('articles')
    .select('*')
    .in('status', ['draft', 'pending_review'])
    .order('date', { ascending: false })

  if (error) {
    return sendJson(res, 400, { error: error.message })
  }

  const drafts = (data || []).map(normalizeArticle)
  sendJson(res, 200, {
    data: {
      drafts: drafts.filter((article) => article.status === 'draft'),
      pendingReviews: drafts.filter((article) => article.status === 'pending_review'),
    },
  })
}

async function handleAdminGetArticle(req, res, articleId) {
  await requireAdmin(req)

  const { data, error } = await adminDb
    .from('articles')
    .select('*')
    .eq('id', articleId)
    .single()

  if (error) {
    return sendJson(res, 404, { error: error.message })
  }

  sendJson(res, 200, { data: normalizeArticle(data) })
}

async function handleAdminPatchArticle(req, res, articleId) {
  await requireAdmin(req)
  const body = await readJsonBody(req)
  const payload = {
    title: body.title,
    slug: body.slug,
    excerpt: body.excerpt,
    content: body.content,
    tags: Array.isArray(body.tags) ? body.tags : undefined,
    cover_image: body.cover_image ?? body.coverImage,
    status: body.status,
    review_note: body.review_note ?? body.reviewNote,
  }

  for (const key of Object.keys(payload)) {
    if (typeof payload[key] === 'undefined') {
      delete payload[key]
    }
  }

  const { data, error } = await adminDb
    .from('articles')
    .update(payload)
    .eq('id', articleId)
    .select('*')
    .single()

  if (error) {
    return sendJson(res, 400, { error: error.message })
  }

  sendJson(res, 200, { data: normalizeArticle(data) })
}

async function handleAdminPublishArticle(req, res, articleId) {
  await requireAdmin(req)
  const { data, error } = await adminDb
    .from('articles')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
      review_note: null,
    })
    .eq('id', articleId)
    .select('*')
    .single()

  if (error) {
    return sendJson(res, 400, { error: error.message })
  }

  sendJson(res, 200, { data: normalizeArticle(data) })
}

async function handleAdminRejectArticle(req, res, articleId) {
  await requireAdmin(req)
  const body = await readJsonBody(req)
  const { data, error } = await adminDb
    .from('articles')
    .update({
      status: 'rejected',
      review_note: body.review_note || body.reviewNote || '需要进一步人工整理后再发布。',
    })
    .eq('id', articleId)
    .select('*')
    .single()

  if (error) {
    return sendJson(res, 400, { error: error.message })
  }

  sendJson(res, 200, { data: normalizeArticle(data) })
}

async function handleAdminDeleteArticle(req, res, articleId) {
  await requireAdmin(req)
  const { data, error } = await adminDb
    .from('articles')
    .delete()
    .eq('id', articleId)
    .select('*')
    .single()

  if (error) {
    return sendJson(res, 400, { error: error.message })
  }

  sendJson(res, 200, { data: normalizeArticle(data) })
}

async function handleAdminPendingAgentPosts(req, res) {
  await requireAdmin(req)
  const { data, error } = await adminDb
    .from('agent_posts')
    .select('*, agent:agent_profiles(*)')
    .eq('status', 'pending_review')
    .order('created_at', { ascending: false })

  if (error) {
    return sendJson(res, 400, { error: error.message })
  }

  sendJson(res, 200, { data: data || [] })
}

async function handleAdminPublishAgentPost(req, res, postId) {
  await requireAdmin(req)
  const { data, error } = await adminDb
    .from('agent_posts')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
    })
    .eq('id', postId)
    .select('*')
    .single()

  if (error) {
    return sendJson(res, 400, { error: error.message })
  }

  sendJson(res, 200, { data: normalizeAgentPost(data) })
}

async function handleAdminRejectAgentPost(req, res, postId) {
  await requireAdmin(req)
  const { data, error } = await adminDb
    .from('agent_posts')
    .update({
      status: 'rejected',
    })
    .eq('id', postId)
    .select('*')
    .single()

  if (error) {
    return sendJson(res, 400, { error: error.message })
  }

  sendJson(res, 200, { data: normalizeAgentPost(data) })
}

async function handleAdminAgentJobs(req, res) {
  await requireAdmin(req)
  const { data, error } = await adminDb
    .from('agent_jobs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return sendJson(res, 400, { error: error.message })
  }

  sendJson(res, 200, { data: data || [] })
}

async function handleAdminRetryAgentJob(req, res, jobId) {
  await requireAdmin(req)
  const { data, error } = await adminDb
    .from('agent_jobs')
    .update({
      status: 'pending',
      error_message: null,
      finished_at: null,
    })
    .eq('id', jobId)
    .select('*')
    .single()

  if (error) {
    return sendJson(res, 400, { error: error.message })
  }

  sendJson(res, 200, { data })
}

async function handleAdminArticleGenerationJobs(req, res) {
  await requireAdmin(req)
  const { data, error } = await adminDb
    .from('article_generation_jobs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return sendJson(res, 400, { error: error.message })
  }

  sendJson(res, 200, { data: data || [] })
}

async function handleAdminRetryArticleGenerationJob(req, res, jobId) {
  await requireAdmin(req)
  const { data, error } = await adminDb
    .from('article_generation_jobs')
    .update({
      status: 'pending',
      error_message: null,
      finished_at: null,
    })
    .eq('id', jobId)
    .select('*')
    .single()

  if (error) {
    return sendJson(res, 400, { error: error.message })
  }

  sendJson(res, 200, { data })
}

async function handleAdminConsoleSnapshot(req, res) {
  await requireAdmin(req)

  const [profilesResult, jobsResult, pendingPostsResult, pendingArticlesResult, generationJobsResult] = await Promise.all([
    adminDb.from('agent_profiles').select('*').eq('is_active', true).order('created_at', { ascending: false }),
    adminDb.from('agent_jobs').select('*').order('created_at', { ascending: false }),
    adminDb.from('agent_posts').select('*, agent:agent_profiles(*)').eq('status', 'pending_review').order('created_at', { ascending: false }),
    adminDb.from('articles').select('*').eq('status', 'pending_review').order('date', { ascending: false }),
    adminDb.from('article_generation_jobs').select('*').order('created_at', { ascending: false }),
  ])

  const firstError = [
    profilesResult.error,
    jobsResult.error,
    pendingPostsResult.error,
    pendingArticlesResult.error,
    generationJobsResult.error,
  ].find(Boolean)

  if (firstError) {
    return sendJson(res, 400, { error: firstError.message })
  }

  const jobs = jobsResult.data || []
  sendJson(res, 200, {
    data: {
      profiles: profilesResult.data || [],
      jobs,
      failedJobs: jobs.filter((job) => job.status === 'failed'),
      pendingPosts: pendingPostsResult.data || [],
      pendingArticles: (pendingArticlesResult.data || []).map(normalizeArticle),
      generationJobs: generationJobsResult.data || [],
    },
  })
}

const server = createServer(async (req, res) => {
  if (!req.url || !req.method) {
    return notFound(res)
  }

  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true })
  }

  const url = parsePath(req.url)
  const { pathname } = url

  try {
    if (pathname === '/api/health' && req.method === 'GET') {
      return await handleHealth(req, res)
    }

    if (pathname === '/api/agent/posts/draft' && req.method === 'POST') {
      return await handleAgentPostDraft(req, res)
    }

    if (pathname === '/api/agent/articles/draft' && req.method === 'POST') {
      return await handleAgentArticleDraft(req, res)
    }

    if (pathname === '/api/admin/articles/generate-draft' && req.method === 'POST') {
      return await handleAdminGenerateDraft(req, res)
    }

    if (pathname === '/api/admin/articles/drafts' && req.method === 'GET') {
      return await handleAdminGetDrafts(req, res)
    }

    if (pathname === '/api/admin/agent-posts/pending' && req.method === 'GET') {
      return await handleAdminPendingAgentPosts(req, res)
    }

    if (pathname === '/api/admin/agent-jobs' && req.method === 'GET') {
      return await handleAdminAgentJobs(req, res)
    }

    if (pathname === '/api/admin/article-generation-jobs' && req.method === 'GET') {
      return await handleAdminArticleGenerationJobs(req, res)
    }

    if (pathname === '/api/admin/console-snapshot' && req.method === 'GET') {
      return await handleAdminConsoleSnapshot(req, res)
    }

    const articleMatch = pathname.match(/^\/api\/admin\/articles\/([^/]+)$/)
    if (articleMatch && req.method === 'GET') {
      return await handleAdminGetArticle(req, res, articleMatch[1])
    }
    if (articleMatch && req.method === 'PATCH') {
      return await handleAdminPatchArticle(req, res, articleMatch[1])
    }
    if (articleMatch && req.method === 'DELETE') {
      return await handleAdminDeleteArticle(req, res, articleMatch[1])
    }

    const articlePublishMatch = pathname.match(/^\/api\/admin\/articles\/([^/]+)\/publish$/)
    if (articlePublishMatch && req.method === 'POST') {
      return await handleAdminPublishArticle(req, res, articlePublishMatch[1])
    }

    const articleRejectMatch = pathname.match(/^\/api\/admin\/articles\/([^/]+)\/reject$/)
    if (articleRejectMatch && req.method === 'POST') {
      return await handleAdminRejectArticle(req, res, articleRejectMatch[1])
    }

    const agentPostPublishMatch = pathname.match(/^\/api\/admin\/agent-posts\/([^/]+)\/publish$/)
    if (agentPostPublishMatch && req.method === 'POST') {
      return await handleAdminPublishAgentPost(req, res, agentPostPublishMatch[1])
    }

    const agentPostRejectMatch = pathname.match(/^\/api\/admin\/agent-posts\/([^/]+)\/reject$/)
    if (agentPostRejectMatch && req.method === 'POST') {
      return await handleAdminRejectAgentPost(req, res, agentPostRejectMatch[1])
    }

    const agentJobRetryMatch = pathname.match(/^\/api\/admin\/agent-jobs\/([^/]+)\/retry$/)
    if (agentJobRetryMatch && req.method === 'POST') {
      return await handleAdminRetryAgentJob(req, res, agentJobRetryMatch[1])
    }

    const generationJobRetryMatch = pathname.match(/^\/api\/admin\/article-generation-jobs\/([^/]+)\/retry$/)
    if (generationJobRetryMatch && req.method === 'POST') {
      return await handleAdminRetryArticleGenerationJob(req, res, generationJobRetryMatch[1])
    }

    return notFound(res)
  } catch (error) {
    return sendJson(res, 401, { error: error.message || 'Request failed' })
  }
})

server.listen(port, '127.0.0.1', () => {
  console.log(`API server listening on http://127.0.0.1:${port}`)
})
