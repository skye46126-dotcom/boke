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

  let query = supabase
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

  const { data, error } = await supabase
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
}

export async function incrementAgentPostViews(id) {
  if (isMock || !supabase) {
    const post = mockAgentPosts.find((entry) => entry.id === id)
    if (post) {
      post.view_count = (post.view_count || 0) + 1
    }
    return
  }

  const { data, error: fetchError } = await supabase
    .from('agent_posts')
    .select('view_count')
    .eq('id', id)
    .single()

  if (fetchError) {
    console.warn('Failed to fetch agent post views:', fetchError)
    return
  }

  const { error } = await supabase
    .from('agent_posts')
    .update({ view_count: (data?.view_count || 0) + 1 })
    .eq('id', id)

  if (error) {
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

  const { data, error } = await supabase
    .from('agent_profiles')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data || []
}

export async function getPendingAgentPosts() {
  if (isMock || !supabase) {
    return mockAgentPosts
      .filter((post) => post.status === 'pending_review')
      .map(attachAgent)
  }

  return apiRequest('/admin/agent-posts/pending', {}, { admin: true })
}
