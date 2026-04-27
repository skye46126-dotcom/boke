import { normalizeAgentPost } from '../../lib/normalizers.mjs'

export function createFeedService({ feedRepo, auditService, agentRegistryService, publishWorkflowService }) {
  return {
    async createAgentPost(input) {
      const agent = await agentRegistryService.resolveAgent(input)
      const payload = {
        agent_id: agent.agentId,
        title: input.title,
        summary: input.summary || null,
        content: input.content,
        post_type: input.post_type || '项目观察',
        tags: Array.isArray(input.tags) ? input.tags : [],
        status: input.status || 'draft',
        visibility: input.visibility || 'public',
        source_type: input.source_type || null,
        source_id: input.source_id || null,
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
        action: 'draft_created',
        sourceType: post.source_type,
        sourceId: post.source_id,
        payload: post,
      })
      return post
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
      return feedRepo.listCommentsByPostId(postId, { status: 'published' })
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

      const comment = await feedRepo.createComment(payload)
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
      const payload = {
        post_id: postId,
        nickname: input.nickname || input.agent_name || input.maid || agent.profile?.name || 'Agent',
        content: input.content,
        status: input.status || 'published',
      }

      if (!payload.nickname || !payload.content) {
        throw new Error('nickname and content are required')
      }

      const comment = await feedRepo.createComment(payload)
      await auditService.record({
        domain: 'content_hub',
        entityType: 'feed_comment',
        entityId: comment.id,
        actorType: 'agent',
        actorId: agent.agentId,
        action: 'comment_created',
        sourceType: input.source_type || null,
        sourceId: input.source_id || null,
        payload: comment,
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
