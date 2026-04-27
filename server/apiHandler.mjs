import { createAppContextFromEnv } from './appContext.mjs'
import { notFound, parseRequestUrl, sendJson } from './lib/http.mjs'
import { createPublicRoutes } from './routes/public/routes.mjs'
import { createAgentRoutes } from './routes/agent/routes.mjs'
import { createAdminRoutes } from './routes/admin/routes.mjs'

const contextCache = new WeakMap()

export function getStatusCodeForError(error) {
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

  if (message.startsWith('Missing Supabase server configuration')) {
    return 500
  }

  if (message === 'Not found' || message.endsWith('not found')) {
    return 404
  }

  return 400
}

export function createApiRoutes(context) {
  return [
    ...createPublicRoutes(context),
    ...createAgentRoutes(context),
    ...createAdminRoutes(context),
  ]
}

export function matchRoute(routes, method, pathname) {
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

export async function handleNodeRequest(req, res, context) {
  if (!req.url || !req.method) {
    return notFound(res)
  }

  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true })
  }

  const routes = createApiRoutes(context)
  const url = parseRequestUrl(req.url, context.config.port)
  const match = matchRoute(routes, req.method, url.pathname)

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
}

function createFetchResponseAdapter() {
  let response = null
  let status = 200
  let headers = {}

  const res = {
    writeHead(nextStatus, nextHeaders = {}) {
      status = nextStatus
      headers = nextHeaders
    },
    end(body = '') {
      response = new Response(body, {
        status,
        headers,
      })
    },
  }

  return {
    res,
    getResponse() {
      return response || new Response('', { status: 204 })
    },
  }
}

function getContext(env) {
  if (!env || typeof env !== 'object') {
    return createAppContextFromEnv({})
  }

  if (!contextCache.has(env)) {
    contextCache.set(env, createAppContextFromEnv(env))
  }

  return contextCache.get(env)
}

export async function handleFetchRequest(request, env = {}) {
  if (request.method === 'OPTIONS') {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password, X-Agent-Token',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      },
    })
  }

  let context
  try {
    context = getContext(env)
  } catch (error) {
    return new Response(JSON.stringify({ error: error?.message || 'Request failed' }), {
      status: getStatusCodeForError(error),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }

  const routes = createApiRoutes(context)
  const url = new URL(request.url)
  const match = matchRoute(routes, request.method, url.pathname)
  const { res, getResponse } = createFetchResponseAdapter()

  if (!match) {
    notFound(res)
    return getResponse()
  }

  try {
    await match.route.handler({
      req: request,
      res,
      url,
      params: match.params,
      context,
    })
  } catch (error) {
    sendJson(res, getStatusCodeForError(error), { error: error?.message || 'Request failed' })
  }

  return getResponse()
}
