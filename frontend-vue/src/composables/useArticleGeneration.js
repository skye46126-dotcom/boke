import { ref } from 'vue'
import {
  generateArticleDraft,
  getArticleGenerationJobs,
  retryArticleGenerationJob,
} from '@/services/articleGenerationService'

export function useArticleGeneration() {
  const prompt = ref('')
  const sourceType = ref('manual_prompt')
  const sourcePayload = ref('')
  const generating = ref(false)
  const error = ref(null)
  const generatedDraft = ref(null)
  const jobs = ref([])
  const retryingJobId = ref(null)

  const loadJobs = async () => {
    try {
      jobs.value = await getArticleGenerationJobs()
    } catch (err) {
      error.value = err.message || 'Failed to load generation jobs'
    }
  }

  const generate = async (payload = {}) => {
    generating.value = true
    error.value = null

    try {
      generatedDraft.value = await generateArticleDraft({
        prompt: payload.prompt ?? prompt.value,
        sourceType: payload.sourceType ?? sourceType.value,
        sourcePayload: payload.sourcePayload ?? {
          raw: sourcePayload.value,
        },
        title: payload.title,
        tags: payload.tags,
      })
      await loadJobs()
      return generatedDraft.value
    } catch (err) {
      error.value = err.message || 'Failed to generate draft'
      throw err
    } finally {
      generating.value = false
    }
  }

  const retry = async (jobId) => {
    retryingJobId.value = jobId
    try {
      await retryArticleGenerationJob(jobId)
      await loadJobs()
    } finally {
      retryingJobId.value = null
    }
  }

  return {
    prompt,
    sourceType,
    sourcePayload,
    generating,
    error,
    generatedDraft,
    jobs,
    retryingJobId,
    loadJobs,
    generate,
    retry,
  }
}
