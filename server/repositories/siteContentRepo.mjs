export function createSiteContentRepository(adminDb) {
  return {
    async getSingleton() {
      const { data, error } = await adminDb
        .from('site_content')
        .select('*')
        .eq('id', 1)
        .single()

      if (error) {
        throw error
      }

      return data
    },

    async upsertSingleton(payload) {
      const { data, error } = await adminDb
        .from('site_content')
        .upsert({
          id: 1,
          ...payload,
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
