import { normalizeArticle } from '../../lib/normalizers.mjs'
import { generateSlug } from '../../lib/strings.mjs'

function pruneUndefined(payload) {
  const result = { ...payload }
  for (const key of Object.keys(result)) {
    if (typeof result[key] === 'undefined') {
      delete result[key]
    }
  }
  return result
}

export function createArticleService({ articleRepo, jobRepo, auditService, agentRegistryService, publishWorkflowService }) {
  return {
    async listPublished(options = {}) {
      return (await articleRepo.listPublished(options)).map(normalizeArticle)
    },

    async listSearchablePublished() {
      return articleRepo.listPublished({
        select: 'id, title, slug, date, content',
      })
    },

    async getPublishedBySlug(slug) {
      return normalizeArticle(await articleRepo.getPublishedBySlug(slug))
    },

    async incrementViews({ id = null, slug = null }) {
      return normalizeArticle(await articleRepo.incrementViewsByIdOrSlug({ id, slug }))
    },

    async createAgentDraft(input) {
      const agent = await agentRegistryService.resolveAgent(input)
      const payload = {
        title: input.title,
        slug: input.slug || generateSlug(input.title, 'article'),
        content: input.content,
        excerpt: input.excerpt || null,
        tags: Array.isArray(input.tags) ? input.tags : [],
        status: input.status || 'draft',
        author_type: input.author_type || 'agent_generated',
        agent_id: agent.agentId,
        source_type: input.source_type || null,
        source_id: input.source_id || null,
        review_note: null,
        date: input.date || new Date().toISOString().slice(0, 10),
        published_at: null,
      }

      if (!payload.title || !payload.slug || !payload.content) {
        throw new Error('title, slug and content are required')
      }

      const article = normalizeArticle(await articleRepo.create(payload))
      await auditService.record({
        domain: 'content_hub',
        entityType: 'article',
        entityId: article.id,
        actorType: 'agent',
        actorId: agent.agentId,
        action: 'draft_created',
        sourceType: article.source_type,
        sourceId: article.source_id,
        payload: article,
      })
      return article
    },

    async createAdminGeneratedDraft(input) {
      const now = new Date()
      const agent = await agentRegistryService.resolveAgent(input)
      const article = normalizeArticle(await articleRepo.create({
        title: input.title || 'Agent 生成的文章草稿',
        slug: input.slug || generateSlug(input.title || 'agent-generated-draft', 'article'),
        content: input.content || `
      <h2 id="background">Background</h2>
      <p>${input.prompt || 'This draft was generated from the admin writing desk.'}</p>
      <h2 id="outline">Outline</h2>
      <p>补充案例、来源和最终结论后再进入发布。</p>
    `,
        excerpt: input.excerpt || '由后台 API 生成的 Agent 文章草稿。',
        tags: Array.isArray(input.tags) ? input.tags : ['Agent', 'Draft'],
        status: 'draft',
        author_type: 'agent_generated',
        agent_id: agent.agentId,
        source_type: input.source_type || 'manual_prompt',
        source_id: input.source_id || null,
        review_note: null,
        date: now.toISOString().slice(0, 10),
        published_at: null,
      }))

      const job = await jobRepo.createArticleGenerationJob({
        agent_id: agent.agentId,
        prompt: input.prompt || null,
        source_type: input.source_type || 'manual_prompt',
        source_payload: input.source_payload || {},
        generated_article_id: article.id,
        status: 'completed',
        finished_at: now.toISOString(),
      })

      await auditService.record({
        domain: 'content_hub',
        entityType: 'article',
        entityId: article.id,
        actorType: 'admin',
        actorId: agent.agentId,
        action: 'generated_draft_created',
        sourceType: input.source_type || 'manual_prompt',
        sourceId: input.source_id || null,
        payload: {
          article,
          job,
        },
      })

      return {
        article,
        job,
      }
    },

    async listDraftBuckets() {
      const drafts = (await articleRepo.listByStatuses(['draft', 'pending_review'])).map(normalizeArticle)
      return {
        drafts: drafts.filter((article) => article.status === 'draft'),
        pendingReviews: drafts.filter((article) => article.status === 'pending_review'),
      }
    },

    async getById(id) {
      return normalizeArticle(await articleRepo.getById(id))
    },

    async updateById(id, input) {
      return normalizeArticle(await articleRepo.updateById(id, pruneUndefined({
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt,
        content: input.content,
        tags: Array.isArray(input.tags) ? input.tags : undefined,
        cover_image: input.cover_image ?? input.coverImage,
        status: input.status,
        review_note: input.review_note ?? input.reviewNote,
      })))
    },

    async submitForReview(id, reviewNote = null) {
      const article = normalizeArticle(await articleRepo.updateById(id, publishWorkflowService.markPendingReview({
        review_note: reviewNote,
      })))

      await auditService.record({
        domain: 'content_hub',
        entityType: 'article',
        entityId: article.id,
        actorType: 'agent',
        actorId: article.agent_id,
        action: 'submitted_for_review',
        sourceType: article.source_type,
        sourceId: article.source_id,
        payload: article,
      })

      return article
    },

    async publishById(id) {
      const article = normalizeArticle(await articleRepo.updateById(id, publishWorkflowService.markPublished()))
      await auditService.record({
        domain: 'content_hub',
        entityType: 'article',
        entityId: article.id,
        actorType: 'admin',
        actorId: article.agent_id,
        action: 'published',
        sourceType: article.source_type,
        sourceId: article.source_id,
        payload: article,
      })
      return article
    },

    async rejectById(id, reviewNote) {
      const article = normalizeArticle(await articleRepo.updateById(id, publishWorkflowService.markRejected(reviewNote)))
      await auditService.record({
        domain: 'content_hub',
        entityType: 'article',
        entityId: article.id,
        actorType: 'admin',
        actorId: article.agent_id,
        action: 'rejected',
        sourceType: article.source_type,
        sourceId: article.source_id,
        payload: article,
      })
      return article
    },

    async deleteById(id) {
      return normalizeArticle(await articleRepo.deleteById(id))
    },

    async listGenerationJobs() {
      return jobRepo.listArticleGenerationJobs()
    },

    async retryGenerationJob(id) {
      return jobRepo.retryArticleGenerationJob(id)
    },
  }
}
