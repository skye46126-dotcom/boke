import { createServer } from 'node:http'
import { createAppContext } from './appContext.mjs'
import { notFound, parseRequestUrl, sendJson } from './lib/http.mjs'
import { createPublicRoutes } from './routes/public/routes.mjs'
import { createAgentRoutes } from './routes/agent/routes.mjs'
import { createAdminRoutes } from './routes/admin/routes.mjs'

const context = createAppContext()
const {
  config,
} = context

const routes = [
  ...createPublicRoutes(context),
  ...createAgentRoutes(context),
  ...createAdminRoutes(context),
]

function getStatusCodeForError(error) {
  const message = String(error?.message || '')

  if (
    message === 'Invalid admin password' ||
    message === 'Invalid agent token' ||
    message === 'ADMIN_PASSWORD is not configured' ||
    message === 'AGENT_API_TOKEN is not configured'
  ) {
    return 401
  }

  if (
    message.includes('required') ||
    message === 'Invalid JSON body' ||
    message.includes('not ready')
  ) {
    return 400
  }

  if (message === 'Not found' || message.endsWith('not found')) {
    return 404
  }

  return 400
}

function matchRoute(method, pathname) {
  for (const route of routes) {
    if (route.method !== method) {
      continue
    }

    const match = pathname.match(route.pattern)
    if (!match) {
      continue
    }

    const params = {}
    for (const [index, key] of (route.keys || []).entries()) {
      params[key] = match[index + 1]
    }

    return {
      route,
      params,
    }
  }

  return null
}

const server = createServer(async (req, res) => {
  if (!req.url || !req.method) {
    return notFound(res)
  }

  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true })
  }

  const url = parseRequestUrl(req.url, config.port)
  const match = matchRoute(req.method, url.pathname)

  if (!match) {
    return notFound(res)
  }

  try {
    await match.route.handler({
      req,
      res,
      url,
      params: match.params,
      context,
    })
  } catch (error) {
    return sendJson(res, getStatusCodeForError(error), { error: error?.message || 'Request failed' })
  }
})

server.listen(config.port, '127.0.0.1', () => {
  console.log(`API server listening on http://127.0.0.1:${config.port}`)
})
