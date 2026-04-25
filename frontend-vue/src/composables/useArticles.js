import { ref } from 'vue'
import {
    getArticleBySlug,
    getPublishedArticles,
} from '@/services/articleService'

/**
 * Composable for fetching and managing articles data
 * Centralized article data management with built-in loading and error states
 */
export function useArticles(options = {}) {
    const {
        limit = null,
        orderBy = 'date',
        ascending = false,
    } = options

    const articles = ref([])
    const loading = ref(true)
    const error = ref(null)

    /**
     * Fetch articles from Supabase
     */
    const fetchArticles = async () => {
        loading.value = true
        error.value = null

        try {
            articles.value = await getPublishedArticles({
                limit,
                orderBy,
                ascending,
            })
        } catch (err) {
            console.error('Error fetching articles:', err)
            error.value = err.message || 'Failed to load articles'
        } finally {
            loading.value = false
        }
    }

    // Auto-fetch on creation
    fetchArticles()

    return {
        articles,
        loading,
        error,
        refetch: fetchArticles
    }
}

/**
 * Composable for fetching a single article by slug
 */
export function useArticle(slug) {
    const article = ref(null)
    const loading = ref(true)
    const error = ref(null)

    /**
     * Fetch single article by slug
     */
    const fetchArticle = async () => {
        if (!slug.value && !slug) {
            error.value = 'No slug provided'
            loading.value = false
            return
        }

        loading.value = true
        error.value = null

        try {
            article.value = await getArticleBySlug(slug.value || slug)
        } catch (err) {
            console.error('Error fetching article:', err)
            error.value = err.message || 'Failed to load article'
        } finally {
            loading.value = false
        }
    }

    // Auto-fetch on creation
    fetchArticle()

    return {
        article,
        loading,
        error,
        refetch: fetchArticle
    }
}
