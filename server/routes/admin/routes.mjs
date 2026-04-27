import { readJsonBody, sendJson } from '../../lib/http.mjs'
import { getAdapterContract } from '../../lib/adapterContract.mjs'

export function createAdminRoutes(context) {
  const { auth, services, repositories } = context

  async function requireAdmin(req) {
    await auth.requireAdmin(req)
  }

  return [
    {
      method: 'POST',
      pattern: /^\/api\/admin\/articles\/generate-draft$/,
      handler: async ({ req, res }) => {
        await requireAdmin(req)
        const body = await readJsonBody(req)
        sendJson(res, 201, { data: await services.articleService.createAdminGeneratedDraft(body) })
      },
    },
    {
      method: 'GET',
      pattern: /^\/api\/admin\/articles\/drafts$/,
      handler: async ({ req, res }) => {
        await requireAdmin(req)
        sendJson(res, 200, { data: await services.articleService.listDraftBuckets() })
      },
    },
    {
      method: 'GET',
      pattern: /^\/api\/admin\/articles\/([^/]+)$/,
      keys: ['articleId'],
      handler: async ({ req, res, params }) => {
        await requireAdmin(req)
        sendJson(res, 200, { data: await services.articleService.getById(params.articleId) })
      },
    },
    {
      method: 'PATCH',
      pattern: /^\/api\/admin\/articles\/([^/]+)$/,
      keys: ['articleId'],
      handler: async ({ req, res, params }) => {
        await requireAdmin(req)
        const body = await readJsonBody(req)
        sendJson(res, 200, { data: await services.articleService.updateById(params.articleId, body) })
      },
    },
    {
      method: 'DELETE',
      pattern: /^\/api\/admin\/articles\/([^/]+)$/,
      keys: ['articleId'],
      handler: async ({ req, res, params }) => {
        await requireAdmin(req)
        sendJson(res, 200, { data: await services.articleService.deleteById(params.articleId) })
      },
    },
    {
      method: 'POST',
      pattern: /^\/api\/admin\/articles\/([^/]+)\/publish$/,
      keys: ['articleId'],
      handler: async ({ req, res, params }) => {
        await requireAdmin(req)
        sendJson(res, 200, { data: await services.articleService.publishById(params.articleId) })
      },
    },
    {
      method: 'POST',
      pattern: /^\/api\/admin\/articles\/([^/]+)\/reject$/,
      keys: ['articleId'],
      handler: async ({ req, res, params }) => {
        await requireAdmin(req)
        const body = await readJsonBody(req)
        sendJson(res, 200, { data: await services.articleService.rejectById(params.articleId, body.review_note || body.reviewNote) })
      },
    },
    {
      method: 'GET',
      pattern: /^\/api\/admin\/agent-posts\/pending$/,
      handler: async ({ req, res }) => {
        await requireAdmin(req)
        sendJson(res, 200, { data: await services.feedService.listPendingPosts() })
      },
    },
    {
      method: 'GET',
      pattern: /^\/api\/admin\/feed\/posts\/pending$/,
      handler: async ({ req, res }) => {
        await requireAdmin(req)
        sendJson(res, 200, { data: await services.feedService.listPendingPosts() })
      },
    },
    {
      method: 'POST',
      pattern: /^\/api\/admin\/agent-posts\/([^/]+)\/publish$/,
      keys: ['postId'],
      handler: async ({ req, res, params }) => {
        await requireAdmin(req)
        sendJson(res, 200, { data: await services.feedService.publishById(params.postId) })
      },
    },
    {
      method: 'POST',
      pattern: /^\/api\/admin\/feed\/posts\/([^/]+)\/publish$/,
      keys: ['postId'],
      handler: async ({ req, res, params }) => {
        await requireAdmin(req)
        sendJson(res, 200, { data: await services.feedService.publishById(params.postId) })
      },
    },
    {
      method: 'POST',
      pattern: /^\/api\/admin\/agent-posts\/([^/]+)\/reject$/,
      keys: ['postId'],
      handler: async ({ req, res, params }) => {
        await requireAdmin(req)
        sendJson(res, 200, { data: await services.feedService.rejectById(params.postId) })
      },
    },
    {
      method: 'POST',
      pattern: /^\/api\/admin\/feed\/posts\/([^/]+)\/reject$/,
      keys: ['postId'],
      handler: async ({ req, res, params }) => {
        await requireAdmin(req)
        sendJson(res, 200, { data: await services.feedService.rejectById(params.postId) })
      },
    },
    {
      method: 'GET',
      pattern: /^\/api\/admin\/agent-jobs$/,
      handler: async ({ req, res }) => {
        await requireAdmin(req)
        sendJson(res, 200, { data: await repositories.jobRepo.listAgentJobs() })
      },
    },
    {
      method: 'POST',
      pattern: /^\/api\/admin\/agent-jobs\/([^/]+)\/retry$/,
      keys: ['jobId'],
      handler: async ({ req, res, params }) => {
        await requireAdmin(req)
        sendJson(res, 200, { data: await repositories.jobRepo.retryAgentJob(params.jobId) })
      },
    },
    {
      method: 'GET',
      pattern: /^\/api\/admin\/article-generation-jobs$/,
      handler: async ({ req, res }) => {
        await requireAdmin(req)
        sendJson(res, 200, { data: await services.articleService.listGenerationJobs() })
      },
    },
    {
      method: 'POST',
      pattern: /^\/api\/admin\/article-generation-jobs\/([^/]+)\/retry$/,
      keys: ['jobId'],
      handler: async ({ req, res, params }) => {
        await requireAdmin(req)
        sendJson(res, 200, { data: await services.articleService.retryGenerationJob(params.jobId) })
      },
    },
    {
      method: 'GET',
      pattern: /^\/api\/admin\/console-snapshot$/,
      handler: async ({ req, res }) => {
        await requireAdmin(req)
        sendJson(res, 200, { data: await services.adminConsoleService.getSnapshot() })
      },
    },
    {
      method: 'GET',
      pattern: /^\/api\/admin\/content-hub-events$/,
      handler: async ({ req, res, url }) => {
        await requireAdmin(req)
        const limit = Number(url.searchParams.get('limit') || 100)
        sendJson(res, 200, { data: await services.eventService.listRecent(Number.isFinite(limit) && limit > 0 ? limit : 100) })
      },
    },
    {
      method: 'GET',
      pattern: /^\/api\/admin\/adapter-contract$/,
      handler: async ({ req, res }) => {
        await requireAdmin(req)
        sendJson(res, 200, { data: getAdapterContract() })
      },
    },
    {
      method: 'GET',
      pattern: /^\/api\/admin\/site-content$/,
      handler: async ({ req, res }) => {
        await requireAdmin(req)
        sendJson(res, 200, { data: await services.siteContentService.getPublic() })
      },
    },
    {
      method: 'PATCH',
      pattern: /^\/api\/admin\/site-content$/,
      handler: async ({ req, res }) => {
        await requireAdmin(req)
        const body = await readJsonBody(req)
        sendJson(res, 200, { data: await services.siteContentService.update(body) })
      },
    },
    {
      method: 'GET',
      pattern: /^\/api\/admin\/gallery\/albums\/pending$/,
      handler: async ({ req, res }) => {
        await requireAdmin(req)
        sendJson(res, 200, { data: await services.galleryService.listPendingAlbums() })
      },
    },
    {
      method: 'POST',
      pattern: /^\/api\/admin\/gallery\/albums\/([^/]+)\/publish$/,
      keys: ['albumId'],
      handler: async ({ req, res, params }) => {
        await requireAdmin(req)
        sendJson(res, 200, { data: await services.galleryService.publishAlbum(params.albumId) })
      },
    },
    {
      method: 'POST',
      pattern: /^\/api\/admin\/gallery\/albums\/([^/]+)\/reject$/,
      keys: ['albumId'],
      handler: async ({ req, res, params }) => {
        await requireAdmin(req)
        const body = await readJsonBody(req)
        sendJson(res, 200, { data: await services.galleryService.rejectAlbum(params.albumId, body.review_note || body.reviewNote) })
      },
    },
  ]
}
