import { isMock, supabase } from '@/lib/supabase'
import { mockAgentPostComments, mockAgentPosts } from '@/data/mockAgentPosts'

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

  const { data, error } = await supabase
    .from('agent_post_comments')
    .select('*')
    .eq('post_id', postId)
    .eq('status', 'published')
    .order('created_at', { ascending: true })

  if (error) {
    throw error
  }

  return data || []
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

  const { data, error } = await supabase
    .from('agent_post_comments')
    .insert({
      post_id: postId,
      nickname: payload.nickname,
      content: payload.content,
      status: 'published',
    })
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return data
}

export function subscribeAgentPostComments(postId, callback) {
  if (isMock || !supabase) {
    return {
      unsubscribe() {},
    }
  }

  const channel = supabase
    .channel(`agent-post-comments-${postId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'agent_post_comments',
        filter: `post_id=eq.${postId}`,
      },
      callback,
    )
    .subscribe()

  return {
    unsubscribe() {
      supabase.removeChannel(channel)
    },
  }
}
