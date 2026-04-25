import { isMock, supabase } from '@/lib/supabase'
import { mockArticles } from '@/data/mockArticles'
import { apiRequest } from '@/lib/api'

const DRAFT_STATUSES = ['draft', 'pending_review']

function cloneArticle(article) {
  return article ? { ...article, tags: [...(article.tags || [])] } : null
}

function getMockDraftsByStatus(status) {
  return mockArticles
    .filter((article) => article.status === status)
    .map(cloneArticle)
    .sort((left, right) => new Date(right.date) - new Date(left.date))
}

function updateMockArticle(id, payload) {
  const index = mockArticles.findIndex((article) => article.id === id)
  if (index === -1) {
    throw new Error('Draft article not found')
  }

  mockArticles[index] = {
    ...mockArticles[index],
    ...payload,
  }

  return cloneArticle(mockArticles[index])
}

export async function getDraftArticles() {
  if (isMock || !supabase) {
    return getMockDraftsByStatus('draft')
  }

  const data = await apiRequest('/admin/articles/drafts', {}, { admin: true })
  return data.drafts || []
}

export async function getPendingReviewArticles() {
  if (isMock || !supabase) {
    return getMockDraftsByStatus('pending_review')
  }

  const data = await apiRequest('/admin/articles/drafts', {}, { admin: true })
  return data.pendingReviews || []
}

export async function getArticleDraftById(id) {
  if (isMock || !supabase) {
    const article = mockArticles.find(
      (entry) => entry.id === id && DRAFT_STATUSES.includes(entry.status),
    )

    if (!article) {
      throw new Error('Draft article not found')
    }

    return cloneArticle(article)
  }

  return apiRequest(`/admin/articles/${id}`, {}, { admin: true })
}

export async function updateArticleDraft(id, payload) {
  if (isMock || !supabase) {
    return updateMockArticle(id, payload)
  }

  return apiRequest(`/admin/articles/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }, { admin: true })
}

export async function publishArticle(id) {
  if (isMock || !supabase) {
    const payload = {
      status: 'published',
      published_at: new Date().toISOString(),
      review_note: null,
    }
    return updateArticleDraft(id, payload)
  }

  return apiRequest(`/admin/articles/${id}/publish`, {
    method: 'POST',
  }, { admin: true })
}

export async function rejectArticle(id, reviewNote) {
  if (!(isMock || !supabase)) {
    return apiRequest(`/admin/articles/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({
        review_note: reviewNote,
      }),
    }, { admin: true })
  }

  return updateArticleDraft(id, {
    status: 'rejected',
    review_note: reviewNote || '需要进一步人工整理后再发布。',
  })
}

export async function deleteArticleDraft(id) {
  if (isMock || !supabase) {
    const index = mockArticles.findIndex((article) => article.id === id)
    if (index === -1) {
      throw new Error('Draft article not found')
    }
    const [removed] = mockArticles.splice(index, 1)
    return cloneArticle(removed)
  }

  return apiRequest(`/admin/articles/${id}`, {
    method: 'DELETE',
  }, { admin: true })
}
