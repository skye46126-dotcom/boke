import { isMock, supabase } from '@/lib/supabase'
import { mockArticles } from '@/data/mockArticles'
import { apiRequest } from '@/lib/api'

function sortByField(items, orderBy = 'date', ascending = false) {
  return [...items].sort((left, right) => {
    const leftValue = left[orderBy] ?? ''
    const rightValue = right[orderBy] ?? ''

    if (leftValue === rightValue) {
      return 0
    }

    if (ascending) {
      return leftValue > rightValue ? 1 : -1
    }

    return leftValue < rightValue ? 1 : -1
  })
}

export async function getPublishedArticles(options = {}) {
  const {
    limit = null,
    orderBy = 'date',
    ascending = false,
  } = options

  if (isMock || !supabase) {
    const published = mockArticles.filter((article) => article.status === 'published')
    const sorted = sortByField(published, orderBy, ascending)
    return limit ? sorted.slice(0, limit) : sorted
  }

  const params = new URLSearchParams()
  if (limit) {
    params.set('limit', String(limit))
  }
  if (orderBy) {
    params.set('orderBy', orderBy)
  }
  if (ascending) {
    params.set('ascending', 'true')
  }

  const query = params.toString()
  return apiRequest(`/articles${query ? `?${query}` : ''}`)
}

export async function getSearchableArticles() {
  if (isMock || !supabase) {
    return mockArticles.filter((article) => article.status === 'published')
  }

  return apiRequest('/articles/search')
}

export async function getArticleBySlug(slug) {
  if (isMock || !supabase) {
    const article = mockArticles.find(
      (entry) => entry.slug === slug && entry.status === 'published',
    )

    if (!article) {
      throw new Error('Article not found')
    }

    return article
  }

  return apiRequest(`/articles/${encodeURIComponent(slug)}`)
}

export async function incrementArticleViews(articleId, slug) {
  if (isMock || !supabase) {
    const article = mockArticles.find((entry) => entry.id === articleId || entry.slug === slug)
    if (article) {
      article.views = (article.views || 0) + 1
    }
    return
  }

  const target = slug || articleId
  try {
    await apiRequest(`/articles/${encodeURIComponent(target)}/views`, {
      method: 'POST',
    })
  } catch (error) {
    console.warn('Failed to increment article views:', error)
  }
}

export async function getRelatedArticles(articleId, tags = []) {
  const tagSet = new Set(tags)
  const source = isMock || !supabase
    ? mockArticles.filter((article) => article.status === 'published')
    : await getPublishedArticles()

  return source
    .filter((article) => article.id !== articleId)
    .filter((article) => (article.tags || []).some((tag) => tagSet.has(tag)))
    .slice(0, 3)
}
