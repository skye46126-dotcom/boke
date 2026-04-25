import { ref, watch } from 'vue'
import {
  getAgentPostById,
  incrementAgentPostViews,
} from '@/services/agentPostService'

export function useAgentPostDetail(idRef) {
  const post = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const loadPost = async () => {
    const id = idRef?.value ?? idRef
    if (!id) {
      return
    }

    loading.value = true
    error.value = null

    try {
      post.value = await getAgentPostById(id)
      await incrementAgentPostViews(id)
    } catch (err) {
      error.value = err.message || 'Failed to load agent post'
    } finally {
      loading.value = false
    }
  }

  const incrementViews = async () => {
    if (!post.value?.id) {
      return
    }

    await incrementAgentPostViews(post.value.id)
  }

  if (idRef && typeof idRef === 'object' && 'value' in idRef) {
    watch(idRef, loadPost, { immediate: true })
  } else {
    loadPost()
  }

  return {
    post,
    loading,
    error,
    loadPost,
    incrementViews,
  }
}
