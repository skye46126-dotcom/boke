import { ref } from 'vue'
import {
  deleteArticleDraft,
  getArticleDraftById,
  publishArticle,
  rejectArticle,
  updateArticleDraft,
} from '@/services/articleDraftService'

export function useArticleEditor() {
  const article = ref(null)
  const title = ref('')
  const slug = ref('')
  const summary = ref('')
  const content = ref('')
  const tags = ref([])
  const coverImage = ref('')
  const status = ref('draft')
  const reviewNote = ref('')
  const saving = ref(false)
  const publishing = ref(false)
  const error = ref(null)
  const lastSavedAt = ref(null)

  const hydrate = (draft) => {
    article.value = draft
    title.value = draft.title || ''
    slug.value = draft.slug || ''
    summary.value = draft.excerpt || ''
    content.value = draft.content || ''
    tags.value = [...(draft.tags || [])]
    coverImage.value = draft.cover_image || ''
    status.value = draft.status || 'draft'
    reviewNote.value = draft.review_note || ''
  }

  const load = async (id) => {
    error.value = null
    try {
      const draft = await getArticleDraftById(id)
      hydrate(draft)
      return draft
    } catch (err) {
      error.value = err.message || 'Failed to load draft'
      throw err
    }
  }

  const save = async () => {
    if (!article.value?.id) {
      return
    }

    saving.value = true
    error.value = null

    try {
      const updated = await updateArticleDraft(article.value.id, {
        title: title.value,
        slug: slug.value,
        excerpt: summary.value,
        content: content.value,
        tags: tags.value,
        cover_image: coverImage.value || null,
        status: status.value,
        review_note: reviewNote.value || null,
      })
      hydrate(updated)
      lastSavedAt.value = new Date().toISOString()
      return updated
    } catch (err) {
      error.value = err.message || 'Failed to save draft'
      throw err
    } finally {
      saving.value = false
    }
  }

  const publish = async () => {
    if (!article.value?.id) {
      return
    }

    publishing.value = true
    try {
      await save()
      const published = await publishArticle(article.value.id)
      hydrate(published)
      return published
    } finally {
      publishing.value = false
    }
  }

  const reject = async (reviewNote) => {
    if (!article.value?.id) {
      return
    }

    const rejected = await rejectArticle(article.value.id, reviewNote)
    hydrate(rejected)
    return rejected
  }

  const remove = async () => {
    if (!article.value?.id) {
      return
    }

    await deleteArticleDraft(article.value.id)
    article.value = null
  }

  return {
    article,
    title,
    slug,
    summary,
    content,
    tags,
    coverImage,
    status,
    reviewNote,
    saving,
    publishing,
    error,
    lastSavedAt,
    load,
    save,
    publish,
    reject,
    remove,
  }
}
