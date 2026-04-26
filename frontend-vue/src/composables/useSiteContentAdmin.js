import { ref } from 'vue'
import {
  defaultSiteContent,
} from '@/data/portfolio'
import {
  loadAdminSiteContent,
  updateAdminSiteContent,
} from '@/services/siteContentService'

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

export function useSiteContentAdmin() {
  const content = ref(clone(defaultSiteContent))
  const loading = ref(false)
  const saving = ref(false)
  const error = ref(null)
  const saveMessage = ref('')

  const load = async () => {
    loading.value = true
    error.value = null

    try {
      content.value = clone(await loadAdminSiteContent())
    } catch (err) {
      error.value = err.message || 'Failed to load homepage content'
      throw err
    } finally {
      loading.value = false
    }
  }

  const save = async () => {
    saving.value = true
    error.value = null
    saveMessage.value = ''

    try {
      const saved = await updateAdminSiteContent(content.value)
      content.value = clone(saved)
      saveMessage.value = 'Homepage content updated.'
      return saved
    } catch (err) {
      error.value = err.message || 'Failed to save homepage content'
      throw err
    } finally {
      saving.value = false
    }
  }

  const reset = () => {
    content.value = clone(defaultSiteContent)
    saveMessage.value = ''
    error.value = null
  }

  return {
    content,
    loading,
    saving,
    error,
    saveMessage,
    load,
    save,
    reset,
  }
}
