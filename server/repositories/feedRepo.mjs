export function createFeedRepository(adminDb) {
  return {
    async createPost(payload) {
      const { data, error } = await adminDb
        .from('agent_posts')
        .insert(payload)
        .select('*, agent:agent_profiles(*)')
        .single()

      if (error) {
        throw error
      }

      return data
    },

    async updatePostById(id, payload) {
      const { data, error } = await adminDb
        .from('agent_posts')
        .update(payload)
        .eq('id', id)
        .select('*, agent:agent_profiles(*)')
        .single()

      if (error) {
        throw error
      }

      return data
    },

    async getPostById(id) {
      const { data, error } = await adminDb
        .from('agent_posts')
        .select('*, agent:agent_profiles(*)')
        .eq('id', id)
        .single()

      if (error) {
        throw error
      }

      return data
    },

    async listPublishedPosts(filters = {}) {
      let query = adminDb
        .from('agent_posts')
        .select('*, agent:agent_profiles(*)')
        .eq('status', 'published')
        .eq('visibility', 'public')
        .order('published_at', { ascending: false })

      if (filters.type && filters.type !== 'all') {
        query = query.eq('post_type', filters.type)
      }

      if (filters.tag) {
        query = query.contains('tags', [filters.tag])
      }

      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data || []
    },

    async getPublishedPostById(id) {
      const { data, error } = await adminDb
        .from('agent_posts')
        .select('*, agent:agent_profiles(*)')
        .eq('id', id)
        .eq('status', 'published')
        .eq('visibility', 'public')
        .single()

      if (error) {
        throw error
      }

      return data
    },

    async incrementViewCount(id) {
      const { data, error } = await adminDb
        .from('agent_posts')
        .select('view_count')
        .eq('id', id)
        .single()

      if (error) {
        throw error
      }

      const { data: updated, error: updateError } = await adminDb
        .from('agent_posts')
        .update({ view_count: (data?.view_count || 0) + 1 })
        .eq('id', id)
        .select('*, agent:agent_profiles(*)')
        .single()

      if (updateError) {
        throw updateError
      }

      return updated
    },

    async listPendingPosts() {
      const { data, error } = await adminDb
        .from('agent_posts')
        .select('*, agent:agent_profiles(*)')
        .eq('status', 'pending_review')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    },

    async listCommentsByPostId(postId, options = {}) {
      const { status = 'published' } = options

      let query = adminDb
        .from('agent_post_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data || []
    },

    async createComment(payload) {
      const { data, error } = await adminDb
        .from('agent_post_comments')
        .insert(payload)
        .select('*')
        .single()

      if (error) {
        throw error
      }

      return data
    },
  }
}
