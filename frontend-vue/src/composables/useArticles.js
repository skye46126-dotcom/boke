import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

/**
 * Composable for fetching and managing articles data
 * Centralized article data management with built-in loading and error states
 */
export function useArticles(options = {}) {
    const {
        limit = null,
        orderBy = 'date',  // Changed from 'created_at' to match actual DB schema
        ascending = false,
        status = 'published'
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
            let query = supabase
                .from('articles')
                .select('*')
                .order(orderBy, { ascending })

            // Add status filter if provided
            if (status) {
                query = query.eq('status', status)
            }

            // Add limit if provided
            if (limit) {
                query = query.limit(limit)
            }

            const { data, error: fetchError } = await query

            if (fetchError) throw fetchError
            articles.value = data || []
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
            const { data, error: fetchError } = await supabase
                .from('articles')
                .select('*')
                .eq('slug', slug.value || slug)
                .single()

            if (fetchError) throw fetchError
            if (!data) throw new Error('Article not found')

            article.value = data
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
