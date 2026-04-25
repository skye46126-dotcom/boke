import { getAdminApiHeaders } from '@/lib/adminAuth'

const apiBase = import.meta.env.VITE_API_BASE_URL || '/api'

export async function apiRequest(path, options = {}, config = {}) {
  const headers = new Headers(options.headers || {})

  if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  if (config.admin) {
    const adminHeaders = await getAdminApiHeaders()
    for (const [key, value] of Object.entries(adminHeaders)) {
      headers.set(key, value)
    }
  }

  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers,
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.error || `API request failed with status ${response.status}`)
  }

  return payload.data ?? payload
}
