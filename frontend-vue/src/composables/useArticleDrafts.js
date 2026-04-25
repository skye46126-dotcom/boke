import { ref } from 'vue'
import {
  deleteArticleDraft,
  getDraftArticles,
  getPendingReviewArticles,
  publishArticle,
  rejectArticle,
} from '@/services/articleDraftService'

export function useArticleDrafts() {
  const drafts = ref([])
  const pendingReviews = ref([])
  const loading = ref(false)
  const error = ref(null)
  const acting = ref(false)

  const loadDrafts = async () => {
    loading.value = true
    error.value = null

    try {
      const [draftData, pendingData] = await Promise.all([
        getDraftArticles(),
        getPendingReviewArticles(),
      ])

      drafts.value = draftData
      pendingReviews.value = pendingData
    } catch (err) {
      error.value = err.message || 'Failed to load article drafts'
    } finally {
      loading.value = false
    }
  }

  const publishDraft = async (id) => {
    acting.value = true
    try {
      await publishArticle(id)
      await loadDrafts()
    } finally {
      acting.value = false
    }
  }

  const rejectDraft = async (id, reviewNote) => {
    acting.value = true
    try {
      await rejectArticle(id, reviewNote)
      await loadDrafts()
    } finally {
      acting.value = false
    }
  }

  const removeDraft = async (id) => {
    acting.value = true
    try {
      await deleteArticleDraft(id)
      await loadDrafts()
    } finally {
      acting.value = false
    }
  }

  return {
    drafts,
    pendingReviews,
    loading,
    acting,
    error,
    loadDrafts,
    publishDraft,
    rejectDraft,
    deleteDraft: removeDraft,
  }
}
