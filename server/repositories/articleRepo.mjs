export function createArticleRepository(adminDb) {
  return {
    async listPublished(options = {}) {
      const {
        orderBy = 'date',
        ascending = false,
        limit = null,
        select = '*',
      } = options

      let query = adminDb
        .from('articles')
        .select(select)
        .eq('status', 'published')
        .order(orderBy, { ascending })

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data || []
    },

    async getPublishedBySlug(slug) {
      const { data, error } = await adminDb
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (error) {
        throw error
      }

      return data
    },

    async create(payload) {
      const { data, error } = await adminDb
        .from('articles')
        .insert(payload)
        .select('*, agent:agent_profiles(*)')
        .single()

      if (error) {
        throw error
      }

      return data
    },

    async listByStatuses(statuses, options = {}) {
      const {
        orderBy = 'date',
        ascending = false,
      } = options

      const { data, error } = await adminDb
        .from('articles')
        .select('*')
        .in('status', statuses)
        .order(orderBy, { ascending })

      if (error) {
        throw error
      }

      return data || []
    },

    async listPendingReviews() {
      const { data, error } = await adminDb
        .from('articles')
        .select('*, agent:agent_profiles(*)')
        .eq('status', 'pending_review')
        .order('date', { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    },

    async getById(id) {
      const { data, error } = await adminDb
        .from('articles')
        .select('*, agent:agent_profiles(*)')
        .eq('id', id)
        .single()

      if (error) {
        throw error
      }

      return data
    },

    async incrementViewsByIdOrSlug({ id = null, slug = null }) {
      const column = slug ? 'slug' : 'id'
      const value = slug || id

      const { data, error } = await adminDb
        .from('articles')
        .select('views')
        .eq(column, value)
        .single()

      if (error) {
        throw error
      }

      const { data: updated, error: updateError } = await adminDb
        .from('articles')
        .update({ views: (data?.views || 0) + 1 })
        .eq(column, value)
        .select('*, agent:agent_profiles(*)')
        .single()

      if (updateError) {
        throw updateError
      }

      return updated
    },

    async updateById(id, payload) {
      const { data, error } = await adminDb
        .from('articles')
        .update(payload)
        .eq('id', id)
        .select('*, agent:agent_profiles(*)')
        .single()

      if (error) {
        throw error
      }

      return data
    },

    async deleteById(id) {
      const { data, error } = await adminDb
        .from('articles')
        .delete()
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
