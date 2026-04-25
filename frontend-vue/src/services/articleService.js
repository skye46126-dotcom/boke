import { isMock, supabase } from '@/lib/supabase'
import { mockArticles } from '@/data/mockArticles'

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

  let query = supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order(orderBy, { ascending })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data || []
}

export async function getSearchableArticles() {
  if (isMock || !supabase) {
    return mockArticles.filter((article) => article.status === 'published')
  }

  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, date, content')
    .eq('status', 'published')

  if (error) {
    throw error
  }

  return data || []
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

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function incrementArticleViews(articleId, slug) {
  if (isMock || !supabase) {
    const article = mockArticles.find((entry) => entry.id === articleId || entry.slug === slug)
    if (article) {
      article.views = (article.views || 0) + 1
    }
    return
  }

  const { data, error: fetchError } = await supabase
    .from('articles')
    .select('views')
    .eq(slug ? 'slug' : 'id', slug || articleId)
    .single()

  if (fetchError) {
    console.warn('Failed to fetch article views:', fetchError)
    return
  }

  const { error } = await supabase
    .from('articles')
    .update({ views: (data?.views || 0) + 1 })
    .eq(slug ? 'slug' : 'id', slug || articleId)

  if (error) {
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
