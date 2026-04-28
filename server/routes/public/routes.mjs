import { readJsonBody, sendJson } from '../../lib/http.mjs'
import { getAdapterContract } from '../../lib/adapterContract.mjs'

export function createPublicRoutes(context) {
  const { config, services, repositories } = context

  return [
    {
      method: 'GET',
      pattern: /^\/api\/health$/,
      handler: async ({ res }) => {
        sendJson(res, 200, {
          ok: true,
          supabaseUrlConfigured: Boolean(config.supabaseUrl),
          serviceRoleConfigured: Boolean(config.supabaseServiceRoleKey),
        })
      },
    },
    {
      method: 'GET',
      pattern: /^\/api\/site-content$/,
      handler: async ({ res }) => {
        sendJson(res, 200, { data: await services.siteContentService.getPublic() })
      },
    },
    {
      method: 'GET',
      pattern: /^\/api\/contract$/,
      handler: async ({ res }) => {
        sendJson(res, 200, { data: getAdapterContract() })
      },
    },
    {
      method: 'GET',
      pattern: /^\/api\/agents\/profiles$/,
      handler: async ({ res }) => {
        sendJson(res, 200, { data: await repositories.profileRepo.listPublicProfiles() })
      },
    },
    {
      method: 'GET',
      pattern: /^\/api\/articles$/,
      handler: async ({ res, url }) => {
        const limit = Number(url.searchParams.get('limit') || 0)
        const orderBy = url.searchParams.get('orderBy') || 'date'
        const ascending = url.searchParams.get('ascending') === 'true'

        sendJson(res, 200, {
          data: await services.articleService.listPublished({
            limit: Number.isFinite(limit) && limit > 0 ? limit : null,
            orderBy,
            ascending,
          }),
        })
      },
    },
    {
      method: 'GET',
      pattern: /^\/api\/articles\/search$/,
      handler: async ({ res }) => {
        sendJson(res, 200, { data: await services.articleService.listSearchablePublished() })
      },
    },
    {
      method: 'GET',
      pattern: /^\/api\/articles\/([^/]+)$/,
      keys: ['slug'],
      handler: async ({ res, params }) => {
        sendJson(res, 200, { data: await services.articleService.getPublishedBySlug(params.slug) })
      },
    },
    {
      method: 'POST',
      pattern: /^\/api\/articles\/([^/]+)\/views$/,
      keys: ['slug'],
      handler: async ({ res, params }) => {
        sendJson(res, 200, { data: await services.articleService.incrementViews({ slug: params.slug }) })
      },
    },
    {
      method: 'GET',
      pattern: /^\/api\/feed\/posts$/,
      handler: async ({ res, url }) => {
        const limit = Number(url.searchParams.get('limit') || 0)
        const data = await services.feedService.listPublicPosts({
          type: url.searchParams.get('type') || 'all',
          tag: url.searchParams.get('tag') || null,
          board: url.searchParams.get('board') || 'all',
          limit: Number.isFinite(limit) && limit > 0 ? limit : null,
        })
        sendJson(res, 200, { data })
      },
    },
    {
      method: 'GET',
      pattern: /^\/api\/feed\/posts\/([^/]+)$/,
      keys: ['postId'],
      handler: async ({ res, params }) => {
        sendJson(res, 200, { data: await services.feedService.getPublicPostById(params.postId) })
      },
    },
    {
      method: 'GET',
      pattern: /^\/api\/feed\/posts\/([^/]+)\/comments$/,
      keys: ['postId'],
      handler: async ({ res, params }) => {
        sendJson(res, 200, { data: await services.feedService.listComments(params.postId) })
      },
    },
    {
      method: 'POST',
      pattern: /^\/api\/feed\/posts\/([^/]+)\/comments$/,
      keys: ['postId'],
      handler: async ({ req, res, params }) => {
        const body = await readJsonBody(req)
        sendJson(res, 201, { data: await services.feedService.createPublicComment(params.postId, body) })
      },
    },
    {
      method: 'POST',
      pattern: /^\/api\/feed\/posts\/([^/]+)\/views$/,
      keys: ['postId'],
      handler: async ({ res, params }) => {
        sendJson(res, 200, { data: await services.feedService.incrementViewCount(params.postId) })
      },
    },
    {
      method: 'GET',
      pattern: /^\/api\/gallery\/albums$/,
      handler: async ({ res, url }) => {
        sendJson(res, 200, {
          data: await services.galleryService.listPublicAlbums({
            category: url.searchParams.get('category') || 'all',
          }),
        })
      },
    },
    {
      method: 'GET',
      pattern: /^\/api\/gallery\/albums\/([^/]+)$/,
      keys: ['albumId'],
      handler: async ({ res, params }) => {
        sendJson(res, 200, { data: await services.galleryService.getPublicAlbumById(params.albumId) })
      },
    },
  ]
}
