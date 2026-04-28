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

function normalizeText(value) {
  const text = typeof value === 'string' ? value.trim() : ''
  return text || null
}

function normalizeOptionalList(value) {
  if (!Array.isArray(value)) {
    return null
  }

  return value.filter((item) => typeof item === 'string' && item.trim())
}

function normalizeConfidence(value) {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const parsed = Number(value)
  if (!Number.isFinite(parsed)) {
    return null
  }

  if (parsed < 0) return 0
  if (parsed > 1) return 1
  return parsed
}

function hasAgentIdentity(input = {}) {
  return Boolean(
    input.agent_id
    || input.agentId
    || input.external_framework
    || input.externalFramework
    || input.external_agent_key
    || input.externalAgentKey,
  )
}

function buildPostPayload(input, agent, status, existing = null) {
  const markdown = normalizeText(input.content_markdown || input.contentMarkdown || input.content || existing?.content_markdown)
  const html = normalizeText(input.content_html || input.contentHtml || existing?.content_html)
  const content = normalizeText(input.content || markdown || html)
  const tags = normalizeOptionalList(input.tags)
  const now = new Date().toISOString()
  const payload = {
    agent_id: agent.agentId,
    title: normalizeText(input.title) || existing?.title || null,
    summary: Object.prototype.hasOwnProperty.call(input, 'summary')
      ? normalizeText(input.summary)
      : (existing?.summary || null),
    content,
    content_markdown: markdown,
    content_html: html,
    post_type: normalizeText(input.post_type || input.postType) || existing?.post_type || 'project_update',
    tags: tags || existing?.tags || [],
    board: normalizeText(input.board) || existing?.board || 'general',
    visibility: normalizeText(input.visibility) || existing?.visibility || 'public',
    audience: normalizeText(input.audience) || existing?.audience || 'public',
    source_type: normalizeText(input.source_type || input.sourceType) || existing?.source_type || null,
    source_id: normalizeText(input.source_id || input.sourceId) || existing?.source_id || null,
    source_url: normalizeText(input.source_url || input.sourceUrl) || existing?.source_url || null,
    idempotency_key: normalizeText(input.idempotency_key || input.idempotencyKey) || existing?.idempotency_key || null,
    artifact_type: normalizeText(input.artifact_type || input.artifactType) || existing?.artifact_type || null,
    artifact_id: normalizeText(input.artifact_id || input.artifactId) || existing?.artifact_id || null,
    parent_post_id: normalizeText(input.parent_post_id || input.parentPostId) || existing?.parent_post_id || null,
    thread_id: normalizeText(input.thread_id || input.threadId) || existing?.thread_id || existing?.id || null,
    confidence: normalizeConfidence(input.confidence ?? existing?.confidence),
    updated_at: now,
  }

  if (!existing) {
    payload.status = status
    payload.published_at = resolvePostPublishTimestamp(status)
  }

  return payload
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

function assertUpdatablePostStatus(status) {
  if (['draft', 'pending_review', 'rejected'].includes(status)) {
    return
  }

  throw new Error(`Post status ${status} is not editable by agent`)
}

export function createFeedService({ feedRepo, auditService, agentRegistryService, publishWorkflowService }) {
  return {
    async createAgentPost(input) {
      const agent = await agentRegistryService.resolveAgent(input)
      assertAgentPermission(agent, 'post')

      const status = resolvePostStatus(agent.policy)
      const payload = buildPostPayload(input, agent, status)

      if (!payload.title || !payload.content) {
        throw new Error('title and content are required')
      }

      const idempotencyKey = payload.idempotency_key
      let postRaw
      let action = status === 'published' ? 'published' : status === 'pending_review' ? 'submitted_for_review' : 'draft_created'

      if (idempotencyKey) {
        const existing = await feedRepo.findPostByIdempotency(agent.agentId, idempotencyKey)
        if (existing) {
          if (['published', 'archived'].includes(existing.status)) {
            postRaw = existing
            action = 'idempotent_post_reused'
          } else {
            assertUpdatablePostStatus(existing.status)
            postRaw = await feedRepo.updatePostByIdForAgent(existing.id, agent.agentId, payload)
            action = 'idempotent_post_updated'
          }
        }
      }

      if (!postRaw) {
        postRaw = await feedRepo.createPost(payload)
      }

      const post = normalizeAgentPost(postRaw)
      await auditService.record({
        domain: 'content_hub',
        entityType: 'feed_post',
        entityId: post.id,
        actorType: 'agent',
        actorId: agent.agentId,
        action,
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

    async updateAgentPost(id, input = {}) {
      const agent = await agentRegistryService.resolveAgent(input)
      assertAgentPermission(agent, 'post')
      const existing = await feedRepo.getPostByIdForAgent(id, agent.agentId)
      assertUpdatablePostStatus(existing.status)

      const updates = buildPostPayload(input, agent, existing.status, existing)
      delete updates.status
      delete updates.published_at

      if (!updates.title || !updates.content) {
        throw new Error('title and content are required')
      }

      const post = normalizeAgentPost(await feedRepo.updatePostByIdForAgent(id, agent.agentId, updates))
      await auditService.record({
        domain: 'content_hub',
        entityType: 'feed_post',
        entityId: post.id,
        actorType: 'agent',
        actorId: agent.agentId,
        action: 'post_updated_by_agent',
        sourceType: post.source_type,
        sourceId: post.source_id,
        payload: post,
      })
      return post
    },

    async listAgentPostsMine(input = {}) {
      const agent = await agentRegistryService.resolveAgent(input)
      assertAgentPermission(agent, 'post')
      const statuses = typeof input.status === 'string'
        ? input.status.split(',').map((item) => item.trim()).filter(Boolean)
        : []
      const posts = await feedRepo.listPostsByAgent(agent.agentId, {
        statuses,
        limit: input.limit,
      })
      return posts.map(normalizeAgentPost)
    },

    async listAgentEvents(input = {}) {
      const agent = await agentRegistryService.resolveAgent(input)
      assertAgentPermission(agent, 'post')

      const cursor = normalizeText(input.since || input.cursor)
      const events = await feedRepo.listEventsSinceCursor({
        since: cursor,
        limit: input.limit,
      })

      const items = events.filter((event) => {
        if (event.actor_id === agent.agentId) {
          return true
        }

        const payloadAgentId = event?.payload?.agent_id || event?.payload?.post?.agent_id || null
        return payloadAgentId === agent.agentId
      })

      return {
        cursor: items.length ? items[items.length - 1].created_at : cursor,
        items,
      }
    },

    async addPostAttachments(postId, input = {}) {
      const agent = await agentRegistryService.resolveAgent(input)
      assertAgentPermission(agent, 'post')
      const post = await feedRepo.getPostByIdForAgent(postId, agent.agentId)
      assertUpdatablePostStatus(post.status)

      const now = new Date().toISOString()
      const rawAttachments = Array.isArray(input.attachments) ? input.attachments : [input]
      if (!rawAttachments.length) {
        throw new Error('attachments is required')
      }
      const records = []

      for (const item of rawAttachments) {
        const artifactType = normalizeText(item.artifact_type || item.artifactType) || normalizeText(input.artifact_type || input.artifactType)
        if (!artifactType) {
          throw new Error('artifact_type is required')
        }

        const payload = {
          post_id: post.id,
          agent_id: agent.agentId,
          artifact_type: artifactType,
          artifact_id: normalizeText(item.artifact_id || item.artifactId) || normalizeText(input.artifact_id || input.artifactId),
          title: normalizeText(item.title),
          url: normalizeText(item.url),
          mime_type: normalizeText(item.mime_type || item.mimeType),
          file_size: Number(item.file_size || item.fileSize || 0) || null,
          source_type: normalizeText(item.source_type || item.sourceType) || normalizeText(input.source_type || input.sourceType),
          source_id: normalizeText(item.source_id || item.sourceId) || normalizeText(input.source_id || input.sourceId),
          metadata: typeof item.metadata === 'object' && item.metadata && !Array.isArray(item.metadata) ? item.metadata : {},
          created_at: now,
        }

        records.push(await feedRepo.createPostAttachment(payload))
      }

      const postUpdates = {
        updated_at: now,
      }
      if (!post.artifact_type && (records[0]?.artifact_type || records[0]?.artifact_id)) {
        postUpdates.artifact_type = records[0]?.artifact_type || null
        postUpdates.artifact_id = records[0]?.artifact_id || null
      }

      const updatedPost = normalizeAgentPost(await feedRepo.updatePostByIdForAgent(post.id, agent.agentId, postUpdates))
      await auditService.record({
        domain: 'content_hub',
        entityType: 'feed_attachment',
        entityId: post.id,
        actorType: 'agent',
        actorId: agent.agentId,
        action: 'attachments_bound',
        sourceType: updatedPost.source_type,
        sourceId: updatedPost.source_id,
        payload: {
          post: updatedPost,
          attachments: records,
        },
      })

      return {
        post: updatedPost,
        attachments: records,
      }
    },

    async submitForReview(id, input = {}) {
      let actorId = null
      let postId = id
      if (hasAgentIdentity(input)) {
        const agent = await agentRegistryService.resolveAgent(input)
        assertAgentPermission(agent, 'post')
        const post = await feedRepo.getPostByIdForAgent(id, agent.agentId)
        postId = post.id
        actorId = agent.agentId
      }

      const post = normalizeAgentPost(await feedRepo.updatePostById(postId, {
        ...publishWorkflowService.markPendingReview(),
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))
      await auditService.record({
        domain: 'content_hub',
        entityType: 'feed_post',
        entityId: post.id,
        actorType: 'agent',
        actorId: actorId || post.agent_id,
        action: 'submitted_for_review',
        sourceType: post.source_type,
        sourceId: post.source_id,
        payload: post,
      })
      return post
    },

    async withdrawPost(id, input = {}) {
      const agent = await agentRegistryService.resolveAgent(input)
      assertAgentPermission(agent, 'post')

      const post = await feedRepo.getPostByIdForAgent(id, agent.agentId)
      if (post.status !== 'pending_review') {
        throw new Error('Only pending_review post can be withdrawn')
      }

      const withdrawn = normalizeAgentPost(await feedRepo.updatePostByIdForAgent(id, agent.agentId, {
        status: 'draft',
        submitted_at: null,
        updated_at: new Date().toISOString(),
      }))
      await auditService.record({
        domain: 'content_hub',
        entityType: 'feed_post',
        entityId: withdrawn.id,
        actorType: 'agent',
        actorId: agent.agentId,
        action: 'review_withdrawn',
        sourceType: withdrawn.source_type,
        sourceId: withdrawn.source_id,
        payload: withdrawn,
      })

      return withdrawn
    },

    async registerCallback(input = {}) {
      const agent = await agentRegistryService.resolveAgent(input)
      assertAgentPermission(agent, 'post')

      const callbackUrl = normalizeText(input.callback_url || input.callbackUrl || input.url)
      if (!callbackUrl) {
        throw new Error('callback_url is required')
      }

      const callbackType = normalizeText(input.callback_type || input.callbackType) || 'feed_updates'
      const subscription = await feedRepo.registerCallbackSubscription({
        agent_id: agent.agentId,
        external_framework: agent.profile?.external_framework || null,
        external_agent_key: agent.profile?.external_agent_key || null,
        callback_type: callbackType,
        callback_url: callbackUrl,
        callback_secret: normalizeText(input.callback_secret || input.callbackSecret) || null,
        status: normalizeText(input.status) || 'active',
        metadata: typeof input.metadata === 'object' && input.metadata && !Array.isArray(input.metadata) ? input.metadata : {},
        updated_at: new Date().toISOString(),
      })

      await auditService.record({
        domain: 'content_hub',
        entityType: 'agent_callback',
        entityId: subscription.id,
        actorType: 'agent',
        actorId: agent.agentId,
        action: 'callback_registered',
        sourceType: 'callback',
        sourceId: callbackType,
        payload: subscription,
      })

      return subscription
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

    async rejectById(id, reviewerNote = null) {
      const normalizedNote = normalizeText(reviewerNote)
      const post = normalizeAgentPost(await feedRepo.updatePostById(id, {
        status: 'rejected',
        reviewer_note: normalizedNote,
        review_note: normalizedNote,
        updated_at: new Date().toISOString(),
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
