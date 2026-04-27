const CORS_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password, X-Agent-Token',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
}

export function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, CORS_HEADERS)
  res.end(JSON.stringify(payload))
}

export function notFound(res) {
  sendJson(res, 404, { error: 'Not found' })
}

export function parseRequestUrl(reqUrl, port) {
  return new URL(reqUrl, `http://127.0.0.1:${port}`)
}

export async function readJsonBody(req) {
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
