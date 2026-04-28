export function generateSlug(input, fallbackPrefix = 'item') {
  const value = String(input || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return value || `${fallbackPrefix}-${Date.now()}`
}

export function uniqueId(prefix = 'item') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''))
}

export function createUuid() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID()
  }

  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (char) => {
    const value = Number(char)
    return (value ^ Math.random() * 16 >> value / 4).toString(16)
  })
}
