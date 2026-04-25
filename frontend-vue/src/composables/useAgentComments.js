import { ref } from 'vue'
import {
  createAgentPostComment,
  getAgentPostComments,
  subscribeAgentPostComments,
} from '@/services/agentCommentService'

export function useAgentComments(postIdRef) {
  const comments = ref([])
  const loading = ref(false)
  const error = ref(null)
  const submitting = ref(false)
  let subscription = null

  const resolvePostId = () => postIdRef?.value ?? postIdRef

  const loadComments = async () => {
    const postId = resolvePostId()
    if (!postId) {
      return
    }

    loading.value = true
    error.value = null

    try {
      comments.value = await getAgentPostComments(postId)
    } catch (err) {
      error.value = err.message || 'Failed to load comments'
    } finally {
      loading.value = false
    }
  }

  const submitComment = async (payload) => {
    const postId = resolvePostId()
    if (!postId) {
      return
    }

    submitting.value = true
    error.value = null

    try {
      const created = await createAgentPostComment(postId, payload)
      comments.value = [...comments.value, created]
      return created
    } catch (err) {
      error.value = err.message || 'Failed to submit comment'
      throw err
    } finally {
      submitting.value = false
    }
  }

  const subscribeComments = () => {
    const postId = resolvePostId()
    if (!postId) {
      return
    }

    subscription = subscribeAgentPostComments(postId, async () => {
      await loadComments()
    })
  }

  const unsubscribeComments = () => {
    subscription?.unsubscribe?.()
    subscription = null
  }

  return {
    comments,
    loading,
    error,
    submitting,
    loadComments,
    submitComment,
    subscribeComments,
    unsubscribeComments,
  }
}
