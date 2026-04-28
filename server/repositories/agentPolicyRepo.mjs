export function createAgentPolicyRepository(adminDb) {
  return {
    async findByExternalIdentity({ framework, key }) {
      const { data, error } = await adminDb
        .from('agent_publish_policies')
        .select('*')
        .eq('external_framework', framework)
        .eq('external_agent_key', key)
        .limit(1)

      if (error) {
        throw error
      }

      return data?.[0] || null
    },

    async upsertByExternalIdentity(payload) {
      const { data, error } = await adminDb
        .from('agent_publish_policies')
        .upsert(payload, {
          onConflict: 'external_framework,external_agent_key',
        })
        .select('*')
        .single()

      if (error) {
        throw error
      }

      return data
    },
  }
}
