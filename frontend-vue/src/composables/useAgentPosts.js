import { computed, ref } from 'vue'
import { getPublishedAgentPosts } from '@/services/agentPostService'

export function useAgentPosts(options = {}) {
  const selectedType = ref(options.initialType || 'all')
  const selectedTag = ref(options.initialTag || null)
  const posts = ref([])
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    page: 1,
    pageSize: options.pageSize || 20,
  })

  const availableTypes = computed(() => {
    const types = new Set(posts.value.map((post) => post.post_type).filter(Boolean))
    return ['all', ...types]
  })

  const availableTags = computed(() => {
    const tags = new Set(posts.value.flatMap((post) => post.tags || []))
    return [...tags]
  })

  const loadPosts = async () => {
    loading.value = true
    error.value = null

    try {
      posts.value = await getPublishedAgentPosts({
        type: selectedType.value,
        tag: selectedTag.value,
        limit: options.limit || null,
      })
    } catch (err) {
      error.value = err.message || 'Failed to load agent posts'
    } finally {
      loading.value = false
    }
  }

  const refresh = () => loadPosts()

  return {
    posts,
    loading,
    error,
    selectedType,
    selectedTag,
    pagination,
    availableTypes,
    availableTags,
    loadPosts,
    refresh,
  }
}
