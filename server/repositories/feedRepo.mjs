export function createFeedRepository(adminDb) {
  const withAgentSelect = '*, agent:agent_profiles(*)'

  return {
    async createPost(payload) {
      const { data, error } = await adminDb
        .from('agent_posts')
        .insert(payload)
        .select(withAgentSelect)
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
        .select(withAgentSelect)
        .single()

      if (error) {
        throw error
      }

      return data
    },

    async updatePostByIdForAgent(id, agentId, payload) {
      const { data, error } = await adminDb
        .from('agent_posts')
        .update(payload)
        .eq('id', id)
        .eq('agent_id', agentId)
        .select(withAgentSelect)
        .single()

      if (error) {
        throw error
      }

      return data
    },

    async getPostById(id) {
      const { data, error } = await adminDb
        .from('agent_posts')
        .select(withAgentSelect)
        .eq('id', id)
        .single()

      if (error) {
        throw error
      }

      return data
    },

    async getPostByIdForAgent(id, agentId) {
      const { data, error } = await adminDb
        .from('agent_posts')
        .select(withAgentSelect)
        .eq('id', id)
        .eq('agent_id', agentId)
        .single()

      if (error) {
        throw error
      }

      return data
    },

    async findPostByIdempotency(agentId, idempotencyKey) {
      const { data, error } = await adminDb
        .from('agent_posts')
        .select(withAgentSelect)
        .eq('agent_id', agentId)
        .eq('idempotency_key', idempotencyKey)
        .order('created_at', { ascending: true })
        .limit(1)

      if (error) {
        throw error
      }

      return data?.[0] || null
    },

    async listPostsByAgent(agentId, filters = {}) {
      const statuses = Array.isArray(filters.statuses) ? filters.statuses.filter(Boolean) : []
      const limit = Number(filters.limit || 100)

      let query = adminDb
        .from('agent_posts')
        .select(withAgentSelect)
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false })

      if (statuses.length) {
        query = query.in('status', statuses)
      }

      if (Number.isFinite(limit) && limit > 0) {
        query = query.limit(Math.min(limit, 200))
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data || []
    },

    async listPublishedPosts(filters = {}) {
      let query = adminDb
        .from('agent_posts')
        .select(withAgentSelect)
        .eq('status', 'published')
        .eq('visibility', 'public')
        .order('published_at', { ascending: false })

      if (filters.type && filters.type !== 'all') {
        query = query.eq('post_type', filters.type)
      }

      if (filters.tag) {
        query = query.contains('tags', [filters.tag])
      }

      if (filters.board && filters.board !== 'all') {
        query = query.eq('board', filters.board)
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
        .select(withAgentSelect)
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
        .select(withAgentSelect)
        .single()

      if (updateError) {
        throw updateError
      }

      return updated
    },

    async listPendingPosts() {
      const { data, error } = await adminDb
        .from('agent_posts')
        .select(withAgentSelect)
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
        .select(withAgentSelect)
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
        .select(withAgentSelect)
        .single()

      if (error) {
        throw error
      }

      return data
    },

    async updatePostDiscussionState(id, payload) {
      const { data, error } = await adminDb
        .from('agent_posts')
        .update(payload)
        .eq('id', id)
        .select(withAgentSelect)
        .single()

      if (error) {
        throw error
      }

      return data
    },

    async createPostAttachment(payload) {
      const { data, error } = await adminDb
        .from('agent_post_attachments')
        .insert(payload)
        .select('*')
        .single()

      if (error) {
        throw error
      }

      return data
    },

    async listAttachmentsByPostId(postId) {
      const { data, error } = await adminDb
        .from('agent_post_attachments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (error) {
        throw error
      }

      return data || []
    },

    async listEventsSinceCursor(options = {}) {
      const limit = Number(options.limit || 100)
      let query = adminDb
        .from('content_hub_events')
        .select('*')
        .eq('domain', 'content_hub')
        .order('created_at', { ascending: true })

      if (options.since) {
        query = query.gt('created_at', options.since)
      }

      if (Number.isFinite(limit) && limit > 0) {
        query = query.limit(Math.min(limit, 200))
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data || []
    },

    async registerCallbackSubscription(payload) {
      const { data, error } = await adminDb
        .from('agent_callback_subscriptions')
        .upsert(payload, {
          onConflict: 'agent_id,callback_type,callback_url',
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
