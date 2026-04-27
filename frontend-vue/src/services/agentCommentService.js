import { isMock, supabase } from '@/lib/supabase'
import { mockAgentPostComments, mockAgentPosts } from '@/data/mockAgentPosts'
import { apiRequest } from '@/lib/api'

function sortComments(comments) {
  return [...comments].sort(
    (left, right) => new Date(left.created_at) - new Date(right.created_at),
  )
}

export async function getAgentPostComments(postId) {
  if (isMock || !supabase) {
    return sortComments(
      mockAgentPostComments.filter(
        (comment) => comment.post_id === postId && comment.status === 'published',
      ),
    )
  }

  return apiRequest(`/feed/posts/${encodeURIComponent(postId)}/comments`)
}

export async function createAgentPostComment(postId, payload) {
  if (isMock || !supabase) {
    const comment = {
      id: `agent-comment-${Date.now()}`,
      post_id: postId,
      nickname: payload.nickname,
      content: payload.content,
      status: 'published',
      created_at: new Date().toISOString(),
    }

    mockAgentPostComments.push(comment)

    const post = mockAgentPosts.find((entry) => entry.id === postId)
    if (post) {
      post.comment_count = (post.comment_count || 0) + 1
    }

    return comment
  }

  return apiRequest(`/feed/posts/${encodeURIComponent(postId)}/comments`, {
    method: 'POST',
    body: JSON.stringify({
      nickname: payload.nickname,
      content: payload.content,
    }),
  })
}

export function subscribeAgentPostComments(postId, callback) {
  if (isMock || !supabase) {
    return {
      unsubscribe() {},
    }
  }

  return {
    unsubscribe() {},
  }
}
