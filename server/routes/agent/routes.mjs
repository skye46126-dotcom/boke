import { readJsonBody, sendJson } from '../../lib/http.mjs'

export function createAgentRoutes(context) {
  const { auth, services } = context

  function requireAgent(req) {
    auth.requireAgent(req)
  }

  return [
    {
      method: 'POST',
      pattern: /^\/api\/agent\/register$/,
      handler: async ({ req, res }) => {
        requireAgent(req)
        const body = await readJsonBody(req)
        const data = await services.feedService.registerAgent(body)
        sendJson(res, data.resolution === 'external_created' ? 201 : 200, { data })
      },
    },
    {
      method: 'GET',
      pattern: /^\/api\/agent\/me$/,
      handler: async ({ req, res, url }) => {
        requireAgent(req)
        const data = await services.feedService.getAgentSelf({
          external_framework: url.searchParams.get('external_framework') || url.searchParams.get('externalFramework'),
          external_agent_key: url.searchParams.get('external_agent_key') || url.searchParams.get('externalAgentKey'),
          agent_id: url.searchParams.get('agent_id') || url.searchParams.get('agentId'),
        })
        sendJson(res, 200, { data })
      },
    },
    {
      method: 'POST',
      pattern: /^\/api\/agent\/posts\/draft$/,
      handler: async ({ req, res }) => {
        requireAgent(req)
        const body = await readJsonBody(req)
        sendJson(res, 201, { data: await services.feedService.createAgentPost(body) })
      },
    },
    {
      method: 'POST',
      pattern: /^\/api\/agent\/feed\/posts$/,
      handler: async ({ req, res }) => {
        requireAgent(req)
        const body = await readJsonBody(req)
        sendJson(res, 201, { data: await services.feedService.createAgentPost(body) })
      },
    },
    {
      method: 'POST',
      pattern: /^\/api\/agent\/forum\/posts$/,
      handler: async ({ req, res }) => {
        requireAgent(req)
        const body = await readJsonBody(req)
        sendJson(res, 201, { data: await services.feedService.createAgentPost(body) })
      },
    },
    {
      method: 'POST',
      pattern: /^\/api\/agent\/feed\/posts\/([^/]+)\/comments$/,
      keys: ['postId'],
      handler: async ({ req, res, params }) => {
        requireAgent(req)
        const body = await readJsonBody(req)
        sendJson(res, 201, { data: await services.feedService.createAgentComment(params.postId, body) })
      },
    },
    {
      method: 'POST',
      pattern: /^\/api\/agent\/forum\/posts\/([^/]+)\/replies$/,
      keys: ['postId'],
      handler: async ({ req, res, params }) => {
        requireAgent(req)
        const body = await readJsonBody(req)
        sendJson(res, 201, { data: await services.feedService.createAgentComment(params.postId, body) })
      },
    },
    {
      method: 'POST',
      pattern: /^\/api\/agent\/feed\/posts\/([^/]+)\/submit-review$/,
      keys: ['postId'],
      handler: async ({ req, res, params }) => {
        requireAgent(req)
        sendJson(res, 200, { data: await services.feedService.submitForReview(params.postId) })
      },
    },
    {
      method: 'POST',
      pattern: /^\/api\/agent\/articles\/draft$/,
      handler: async ({ req, res }) => {
        requireAgent(req)
        const body = await readJsonBody(req)
        sendJson(res, 201, { data: await services.articleService.createAgentDraft(body) })
      },
    },
    {
      method: 'POST',
      pattern: /^\/api\/agent\/articles\/drafts$/,
      handler: async ({ req, res }) => {
        requireAgent(req)
        const body = await readJsonBody(req)
        sendJson(res, 201, { data: await services.articleService.createAgentDraft(body) })
      },
    },
    {
      method: 'POST',
      pattern: /^\/api\/agent\/articles\/drafts\/([^/]+)\/submit-review$/,
      keys: ['articleId'],
      handler: async ({ req, res, params }) => {
        requireAgent(req)
        const body = await readJsonBody(req)
        sendJson(res, 200, { data: await services.articleService.submitForReview(params.articleId, body.review_note || body.reviewNote || null) })
      },
    },
    {
      method: 'POST',
      pattern: /^\/api\/agent\/gallery\/albums$/,
      handler: async ({ req, res }) => {
        requireAgent(req)
        const body = await readJsonBody(req)
        sendJson(res, 201, { data: await services.galleryService.createAgentAlbum(body) })
      },
    },
    {
      method: 'POST',
      pattern: /^\/api\/agent\/gallery\/albums\/([^/]+)\/items$/,
      keys: ['albumId'],
      handler: async ({ req, res, params }) => {
        requireAgent(req)
        const body = await readJsonBody(req)
        sendJson(res, 201, { data: await services.galleryService.addAlbumItems(params.albumId, body) })
      },
    },
    {
      method: 'POST',
      pattern: /^\/api\/agent\/gallery\/albums\/([^/]+)\/submit-review$/,
      keys: ['albumId'],
      handler: async ({ req, res, params }) => {
        requireAgent(req)
        sendJson(res, 200, { data: await services.galleryService.submitAlbumForReview(params.albumId) })
      },
    },
  ]
}
