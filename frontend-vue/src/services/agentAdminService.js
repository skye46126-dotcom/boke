import { isMock, supabase } from '@/lib/supabase'
import {
  getAgentProfiles,
  getPendingAgentPosts,
} from '@/services/agentPostService'
import { getPendingReviewArticles } from '@/services/articleDraftService'
import { apiRequest } from '@/lib/api'
import {
  mockArticleGenerationJobs,
  mockAgentJobs,
  mockAgentPosts,
} from '@/data/mockAgentPosts'

function attachAgent(post, profiles) {
  return {
    ...post,
    agent: profiles.find((profile) => profile.id === post.agent_id) || null,
  }
}

export async function getAgentJobs() {
  if (isMock || !supabase) {
    return [...mockAgentJobs].sort(
      (left, right) => new Date(right.created_at) - new Date(left.created_at),
    )
  }

  return apiRequest('/admin/agent-jobs', {}, { admin: true })
}

export async function getContentHubEvents(limit = 100) {
  if (isMock || !supabase) {
    return []
  }

  return apiRequest(`/admin/content-hub-events?limit=${encodeURIComponent(limit)}`, {}, { admin: true })
}

export async function getAdapterContract() {
  if (isMock || !supabase) {
    return {
      version: 'mock',
      name: 'boke-agent-content-hub',
      routes: {
        feed: {},
        articles: {},
        gallery: {},
      },
    }
  }

  return apiRequest('/admin/adapter-contract', {}, { admin: true })
}

export async function getFailedAgentJobs() {
  const jobs = await getAgentJobs()
  return jobs.filter((job) => job.status === 'failed')
}

export async function publishAgentPost(id) {
  if (isMock || !supabase) {
    const post = mockAgentPosts.find((entry) => entry.id === id)
    if (!post) {
      throw new Error('Agent post not found')
    }
    post.status = 'published'
    post.published_at = new Date().toISOString()
    return post
  }

  return apiRequest(`/admin/agent-posts/${id}/publish`, {
    method: 'POST',
  }, { admin: true })
}

export async function rejectAgentPost(id) {
  if (isMock || !supabase) {
    const post = mockAgentPosts.find((entry) => entry.id === id)
    if (!post) {
      throw new Error('Agent post not found')
    }
    post.status = 'rejected'
    return post
  }

  return apiRequest(`/admin/agent-posts/${id}/reject`, {
    method: 'POST',
  }, { admin: true })
}

export async function retryAgentJob(id) {
  if (isMock || !supabase) {
    const job = mockAgentJobs.find((entry) => entry.id === id)
    if (!job) {
      throw new Error('Agent job not found')
    }
    job.status = 'pending'
    job.error_message = null
    job.finished_at = null
    return job
  }

  return apiRequest(`/admin/agent-jobs/${id}/retry`, {
    method: 'POST',
  }, { admin: true })
}

export async function publishGalleryAlbum(id) {
  if (isMock || !supabase) {
    return { id, status: 'published', published_at: new Date().toISOString() }
  }

  return apiRequest(`/admin/gallery/albums/${id}/publish`, {
    method: 'POST',
  }, { admin: true })
}

export async function rejectGalleryAlbum(id, reviewNote = '') {
  if (isMock || !supabase) {
    return { id, status: 'rejected', review_note: reviewNote || '需要进一步人工整理后再发布。' }
  }

  return apiRequest(`/admin/gallery/albums/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({
      review_note: reviewNote,
    }),
  }, { admin: true })
}

export async function getAgentConsoleSnapshot() {
  if (!(isMock || !supabase)) {
    return apiRequest('/admin/console-snapshot', {}, { admin: true })
  }

  const [profiles, jobs, failedJobs, pendingPosts, pendingArticles] = await Promise.all([
    getAgentProfiles(),
    getAgentJobs(),
    getFailedAgentJobs(),
    getPendingAgentPosts(),
    getPendingReviewArticles(),
  ])

  if (isMock || !supabase) {
    return {
      profiles,
      jobs,
      failedJobs,
      pendingPosts: pendingPosts.map((post) => attachAgent(post, profiles)),
      pendingArticles,
      generationJobs: [...mockArticleGenerationJobs].sort(
        (left, right) => new Date(right.created_at) - new Date(left.created_at),
      ),
      pendingGalleryAlbums: [],
    }
  }

  return {
    profiles,
    jobs,
    failedJobs,
    pendingPosts,
    pendingArticles,
    pendingGalleryAlbums: [],
  }
}
