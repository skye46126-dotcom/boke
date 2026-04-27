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
