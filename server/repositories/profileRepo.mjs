export function createProfileRepository(adminDb) {
  return {
    async getById(id) {
      const { data, error } = await adminDb
        .from('agent_profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        throw error
      }

      return data
    },

    async findByExternalIdentity({ framework, key }) {
      const { data, error } = await adminDb
        .from('agent_profiles')
        .select('*')
        .eq('external_framework', framework)
        .eq('external_agent_key', key)
        .order('created_at', { ascending: true })
        .limit(1)

      if (error) {
        throw error
      }

      return data?.[0] || null
    },

    async listActiveProfiles() {
      const { data, error } = await adminDb
        .from('agent_profiles')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    },

    async create(payload) {
      const { data, error } = await adminDb
        .from('agent_profiles')
        .insert(payload)
        .select('*')
        .single()

      if (error) {
        throw error
      }

      return data
    },

    async updateById(id, payload) {
      const { data, error } = await adminDb
        .from('agent_profiles')
        .update(payload)
        .eq('id', id)
        .select('*')
        .single()

      if (error) {
        throw error
      }

      return data
    },

    async touchById(id, payload = {}) {
      const { data, error } = await adminDb
        .from('agent_profiles')
        .update({
          last_seen_at: new Date().toISOString(),
          ...payload,
        })
        .eq('id', id)
        .select('*')
        .single()

      if (error) {
        throw error
      }

      return data
    },

    async listPublicProfiles() {
      const { data, error } = await adminDb
        .from('agent_profiles')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    },
  }
}
