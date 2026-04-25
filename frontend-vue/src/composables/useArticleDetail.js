import { ref, watch } from 'vue'
import {
  getArticleBySlug,
  incrementArticleViews,
} from '@/services/articleService'

export function useArticleDetail(slugRef) {
  const article = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const loadArticle = async () => {
    const slug = slugRef?.value ?? slugRef
    if (!slug) {
      return
    }

    loading.value = true
    error.value = null

    try {
      article.value = await getArticleBySlug(slug)
      await incrementArticleViews(article.value.id, slug)
    } catch (err) {
      error.value = err.message || 'Failed to load article'
    } finally {
      loading.value = false
    }
  }

  if (slugRef && typeof slugRef === 'object' && 'value' in slugRef) {
    watch(slugRef, loadArticle, { immediate: true })
  } else {
    loadArticle()
  }

  return {
    article,
    loading,
    error,
    loadArticle,
  }
}
