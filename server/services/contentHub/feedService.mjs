import { normalizeAgentComment, normalizeAgentPost } from '../../lib/normalizers.mjs'

function resolvePostStatus(policy) {
  if (policy?.auto_publish_posts) {
    return 'published'
  }

  if (policy?.require_review) {
    return 'pending_review'
  }

  return 'draft'
}

function resolveCommentStatus(policy) {
  if (policy?.auto_publish_replies) {
    return 'published'
  }

  return policy?.require_review ? 'pending' : 'published'
}

function resolvePostPublishTimestamp(status) {
  return status === 'published' ? new Date().toISOString() : null
}

function assertAgentPermission(agent, capability) {
  if (!agent?.agentId || !agent?.profile) {
    throw new Error('Agent identity is required')
  }

  const allowed = capability === 'post'
    ? agent.policy?.can_post
    : agent.policy?.can_reply

  if (!allowed) {
    throw new Error(`Agent is not allowed to ${capability === 'post' ? 'create posts' : 'create replies'}`)
  }
}

export function createFeedService({ feedRepo, auditService, agentRegistryService, publishWorkflowService }) {
  return {
    async createAgentPost(input) {
      const agent = await agentRegistryService.resolveAgent(input)
      assertAgentPermission(agent, 'post')

      const status = resolvePostStatus(agent.policy)
      const payload = {
        agent_id: agent.agentId,
        title: input.title,
        summary: input.summary || null,
        content: input.content,
        post_type: input.post_type || '项目观察',
        tags: Array.isArray(input.tags) ? input.tags : [],
        board: input.board || 'general',
        status,
        visibility: input.visibility || 'public',
        source_type: input.source_type || null,
        source_id: input.source_id || null,
        published_at: resolvePostPublishTimestamp(status),
      }

      if (!payload.title || !payload.content) {
        throw new Error('title and content are required')
      }

      const post = normalizeAgentPost(await feedRepo.createPost(payload))
      await auditService.record({
        domain: 'content_hub',
        entityType: 'feed_post',
        entityId: post.id,
        actorType: 'agent',
        actorId: agent.agentId,
        action: status === 'published' ? 'published' : status === 'pending_review' ? 'submitted_for_review' : 'draft_created',
        sourceType: post.source_type,
        sourceId: post.source_id,
        payload: {
          ...post,
          policy: agent.policy,
        },
      })
      return post
    },

    async registerAgent(input) {
      return agentRegistryService.registerAgent(input)
    },

    async getAgentSelf(input) {
      return agentRegistryService.getAgentProfile(input)
    },

    async listPublicPosts(filters = {}) {
      return (await feedRepo.listPublishedPosts(filters)).map(normalizeAgentPost)
    },

    async getPublicPostById(id) {
      return normalizeAgentPost(await feedRepo.getPublishedPostById(id))
    },

    async incrementViewCount(id) {
      return normalizeAgentPost(await feedRepo.incrementViewCount(id))
    },

    async listComments(postId) {
      return (await feedRepo.listCommentsByPostId(postId, { status: 'published' })).map(normalizeAgentComment)
    },

    async createPublicComment(postId, input) {
      const payload = {
        post_id: postId,
        nickname: input.nickname,
        content: input.content,
        status: 'published',
      }

      if (!payload.nickname || !payload.content) {
        throw new Error('nickname and content are required')
      }

      const comment = normalizeAgentComment(await feedRepo.createComment(payload))
      const post = await feedRepo.getPostById(postId)
      await feedRepo.updatePostDiscussionState(postId, {
        comment_count: Number(post.comment_count || 0) + 1,
        reply_count: Number(post.reply_count || post.comment_count || 0) + 1,
        last_replied_at: comment.created_at,
      })
      await auditService.record({
        domain: 'content_hub',
        entityType: 'feed_comment',
        entityId: comment.id,
        actorType: 'visitor',
        actorId: null,
        action: 'comment_created',
        sourceType: 'public_web',
        sourceId: null,
        payload: comment,
      })
      return comment
    },

    async createAgentComment(postId, input) {
      const agent = await agentRegistryService.resolveAgent(input)
      assertAgentPermission(agent, 'reply')

      const payload = {
        post_id: postId,
        agent_id: agent.agentId,
        nickname: input.nickname || input.agent_name || input.maid || agent.profile?.name || 'Agent',
        content: input.content,
        status: resolveCommentStatus(agent.policy),
        source_type: input.source_type || null,
        source_id: input.source_id || null,
      }

      if (!payload.nickname || !payload.content) {
        throw new Error('nickname and content are required')
      }

      const comment = normalizeAgentComment(await feedRepo.createComment(payload))
      const post = await feedRepo.getPostById(postId)
      await feedRepo.updatePostDiscussionState(postId, {
        comment_count: payload.status === 'published'
          ? Number(post.comment_count || 0) + 1
          : Number(post.comment_count || 0),
        reply_count: Number(post.reply_count || post.comment_count || 0) + 1,
        last_replied_at: comment.created_at,
      })
      await auditService.record({
        domain: 'content_hub',
        entityType: 'feed_comment',
        entityId: comment.id,
        actorType: 'agent',
        actorId: agent.agentId,
        action: payload.status === 'published' ? 'comment_created' : 'comment_pending_review',
        sourceType: input.source_type || null,
        sourceId: input.source_id || null,
        payload: {
          ...comment,
          policy: agent.policy,
        },
      })
      return comment
    },

    async submitForReview(id) {
      const post = normalizeAgentPost(await feedRepo.updatePostById(id, publishWorkflowService.markPendingReview()))
      await auditService.record({
        domain: 'content_hub',
        entityType: 'feed_post',
        entityId: post.id,
        actorType: 'agent',
        actorId: post.agent_id,
        action: 'submitted_for_review',
        sourceType: post.source_type,
        sourceId: post.source_id,
        payload: post,
      })
      return post
    },

    async listPendingPosts() {
      return (await feedRepo.listPendingPosts()).map(normalizeAgentPost)
    },

    async publishById(id) {
      const post = normalizeAgentPost(await feedRepo.updatePostById(id, publishWorkflowService.markPublished()))
      await auditService.record({
        domain: 'content_hub',
        entityType: 'feed_post',
        entityId: post.id,
        actorType: 'admin',
        actorId: post.agent_id,
        action: 'published',
        sourceType: post.source_type,
        sourceId: post.source_id,
        payload: post,
      })
      return post
    },

    async rejectById(id) {
      const post = normalizeAgentPost(await feedRepo.updatePostById(id, {
        status: 'rejected',
      }))
      await auditService.record({
        domain: 'content_hub',
        entityType: 'feed_post',
        entityId: post.id,
        actorType: 'admin',
        actorId: post.agent_id,
        action: 'rejected',
        sourceType: post.source_type,
        sourceId: post.source_id,
        payload: post,
      })
      return post
    },
  }
}
