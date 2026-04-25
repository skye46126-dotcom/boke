import { mockArticleGenerationJobs, mockAgentJobs } from '@/data/mockAgentPosts'
import { mockArticles } from '@/data/mockArticles'
import { generateSlug } from '@/lib/utils'
import { isMock, supabase } from '@/lib/supabase'
import { apiRequest } from '@/lib/api'

function createGeneratedDraft(payload) {
  const title = payload.title || 'Agent 生成的文章草稿'
  const articleId = `article-generated-${Date.now()}`
  const slug = generateSlug(title)
  const now = new Date().toISOString()

  const draft = {
    id: articleId,
    title,
    slug,
    excerpt: payload.excerpt || '由 Agent 生成的文章草稿，等待人工审核与整理。',
    content: payload.content || `
      <h2 id="background">背景</h2>
      <p>${payload.prompt || '该草稿由 Writing Desk 触发生成。'}</p>
      <h2 id="outline">结构建议</h2>
      <p>建议补充案例、数据和最终结论，再进入发布流程。</p>
    `,
    status: 'draft',
    author_type: 'agent_generated',
    agent_id: payload.agent_id || 'agent-writing-assistant',
    source_type: payload.sourceType || 'manual_prompt',
    source_id: payload.sourceId || null,
    review_note: null,
    date: now,
    published_at: null,
    tags: payload.tags || ['Agent', 'Draft'],
    views: 0,
  }

  mockArticles.unshift(draft)
  return draft
}

export async function createArticleGenerationJob(payload) {
  if (isMock || !supabase) {
    const draft = createGeneratedDraft(payload)
    const job = {
      id: `article-generation-${Date.now()}`,
      agent_id: payload.agent_id || 'agent-writing-assistant',
      prompt: payload.prompt,
      source_type: payload.sourceType || 'manual_prompt',
      source_payload: payload.sourcePayload || {},
      generated_article_id: draft.id,
      status: 'completed',
      error_message: null,
      created_at: new Date().toISOString(),
      finished_at: new Date().toISOString(),
    }

    mockArticleGenerationJobs.unshift(job)
    mockAgentJobs.unshift({
      id: `agent-job-${Date.now()}`,
      agent_id: job.agent_id,
      job_type: 'article_generation',
      input: {
        prompt: job.prompt,
        source_type: job.source_type,
      },
      output: {
        generated_article_id: draft.id,
      },
      status: 'completed',
      error_message: null,
      created_at: job.created_at,
      finished_at: job.finished_at,
    })

    return job
  }

  const data = await apiRequest('/admin/articles/generate-draft', {
    method: 'POST',
    body: JSON.stringify({
      agent_id: payload.agent_id || null,
      title: payload.title,
      prompt: payload.prompt,
      source_type: payload.sourceType || 'manual_prompt',
      source_payload: payload.sourcePayload || {},
      excerpt: payload.excerpt || null,
      tags: payload.tags || [],
      content: payload.content || null,
      source_id: payload.sourceId || null,
      slug: payload.title ? generateSlug(payload.title) : undefined,
    }),
  }, { admin: true })

  return data.job
}

export async function generateArticleDraft(payload) {
  if (isMock || !supabase) {
    const job = await createArticleGenerationJob(payload)
    return mockArticles.find((article) => article.id === job.generated_article_id)
  }

  const data = await apiRequest('/admin/articles/generate-draft', {
    method: 'POST',
    body: JSON.stringify({
      agent_id: payload.agent_id || null,
      title: payload.title,
      prompt: payload.prompt,
      source_type: payload.sourceType || 'manual_prompt',
      source_payload: payload.sourcePayload || {},
      excerpt: payload.excerpt || null,
      tags: payload.tags || [],
      content: payload.content || null,
      source_id: payload.sourceId || null,
      slug: payload.title ? generateSlug(payload.title) : undefined,
    }),
  }, { admin: true })

  return data.article
}

export async function getArticleGenerationJobs() {
  if (isMock || !supabase) {
    return [...mockArticleGenerationJobs]
  }

  return apiRequest('/admin/article-generation-jobs', {}, { admin: true })
}

export async function retryArticleGenerationJob(jobId) {
  if (isMock || !supabase) {
    const job = mockArticleGenerationJobs.find((entry) => entry.id === jobId)
    if (!job) {
      throw new Error('Generation job not found')
    }

    job.status = 'completed'
    job.error_message = null
    job.finished_at = new Date().toISOString()
    return job
  }

  return apiRequest(`/admin/article-generation-jobs/${jobId}/retry`, {
    method: 'POST',
  }, { admin: true })
}
