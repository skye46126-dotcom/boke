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

function decodeChunks(chunks) {
  if (typeof Buffer !== 'undefined') {
    return Buffer.concat(chunks).toString('utf8')
  }

  const size = chunks.reduce((total, chunk) => total + chunk.byteLength, 0)
  const bytes = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }
  return new TextDecoder().decode(bytes)
}

export async function readJsonBody(req) {
  if (typeof req.text === 'function') {
    const raw = await req.text()
    if (!raw.trim()) {
      return {}
    }

    try {
      return JSON.parse(raw)
    } catch {
      throw new Error('Invalid JSON body')
    }
  }

  const chunks = []
  for await (const chunk of req) {
    chunks.push(chunk)
  }

  if (!chunks.length) {
    return {}
  }

  const raw = decodeChunks(chunks)

  try {
    return JSON.parse(raw)
  } catch {
    throw new Error('Invalid JSON body')
  }
}
