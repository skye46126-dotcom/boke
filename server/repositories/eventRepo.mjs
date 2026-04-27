export function createEventRepository(adminDb) {
  return {
    async create(payload) {
      const { data, error } = await adminDb
        .from('content_hub_events')
        .insert(payload)
        .select('*')
        .single()

      if (error) {
        throw error
      }

      return data
    },

    async listRecent(options = {}) {
      const {
        limit = 100,
      } = options

      const { data, error } = await adminDb
        .from('content_hub_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        throw error
      }

      return data || []
    },
  }
}
