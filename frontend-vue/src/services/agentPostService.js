import { isMock, supabase } from '@/lib/supabase'
import { mockAgentPosts, mockAgentProfiles } from '@/data/mockAgentPosts'
import { apiRequest } from '@/lib/api'

function attachAgent(post) {
  return {
    ...post,
    agent: mockAgentProfiles.find((profile) => profile.id === post.agent_id) || null,
  }
}

function applyFilters(posts, filters = {}) {
  const { type = 'all', tag = null, limit = null } = filters

  let filtered = posts.filter(
    (post) => post.status === 'published' && post.visibility === 'public',
  )

  if (type && type !== 'all') {
    filtered = filtered.filter((post) => post.post_type === type)
  }

  if (tag) {
    filtered = filtered.filter((post) => (post.tags || []).includes(tag))
  }

  filtered = filtered.sort(
    (left, right) => new Date(right.published_at || right.created_at) - new Date(left.published_at || left.created_at),
  )

  return limit ? filtered.slice(0, limit) : filtered
}

export async function getPublishedAgentPosts(filters = {}) {
  if (isMock || !supabase) {
    return applyFilters(mockAgentPosts, filters).map(attachAgent)
  }

  const params = new URLSearchParams()
  if (filters.type && filters.type !== 'all') {
    params.set('type', filters.type)
  }
  if (filters.tag) {
    params.set('tag', filters.tag)
  }
  if (filters.limit) {
    params.set('limit', String(filters.limit))
  }

  const query = params.toString()
  return apiRequest(`/feed/posts${query ? `?${query}` : ''}`)
}

export async function getAgentPostById(id) {
  if (isMock || !supabase) {
    const post = mockAgentPosts.find(
      (entry) => entry.id === id && entry.status === 'published' && entry.visibility === 'public',
    )

    if (!post) {
      throw new Error('Agent post not found')
    }

    return attachAgent(post)
  }

  return apiRequest(`/feed/posts/${encodeURIComponent(id)}`)
}

export async function incrementAgentPostViews(id) {
  if (isMock || !supabase) {
    const post = mockAgentPosts.find((entry) => entry.id === id)
    if (post) {
      post.view_count = (post.view_count || 0) + 1
    }
    return
  }

  try {
    await apiRequest(`/feed/posts/${encodeURIComponent(id)}/views`, {
      method: 'POST',
    })
  } catch (error) {
    console.warn('Failed to increment agent post views:', error)
  }
}

export async function getLatestAgentPosts(limit = 3) {
  return getPublishedAgentPosts({ limit })
}

export async function getAgentProfiles() {
  if (isMock || !supabase) {
    return [...mockAgentProfiles]
  }

  return apiRequest('/agents/profiles')
}

export async function getPendingAgentPosts() {
  if (isMock || !supabase) {
    return mockAgentPosts
      .filter((post) => post.status === 'pending_review')
      .map(attachAgent)
  }

  return apiRequest('/admin/agent-posts/pending', {}, { admin: true })
}
