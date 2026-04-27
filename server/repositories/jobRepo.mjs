export function createJobRepository(adminDb) {
  return {
    async createArticleGenerationJob(payload) {
      const { data, error } = await adminDb
        .from('article_generation_jobs')
        .insert(payload)
        .select('*')
        .single()

      if (error) {
        throw error
      }

      return data
    },

    async listAgentJobs() {
      const { data, error } = await adminDb
        .from('agent_jobs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    },

    async retryAgentJob(id) {
      const { data, error } = await adminDb
        .from('agent_jobs')
        .update({
          status: 'pending',
          error_message: null,
          finished_at: null,
        })
        .eq('id', id)
        .select('*')
        .single()

      if (error) {
        throw error
      }

      return data
    },

    async listArticleGenerationJobs() {
      const { data, error } = await adminDb
        .from('article_generation_jobs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    },

    async retryArticleGenerationJob(id) {
      const { data, error } = await adminDb
        .from('article_generation_jobs')
        .update({
          status: 'pending',
          error_message: null,
          finished_at: null,
        })
        .eq('id', id)
        .select('*')
        .single()

      if (error) {
        throw error
      }

      return data
    },
  }
}
