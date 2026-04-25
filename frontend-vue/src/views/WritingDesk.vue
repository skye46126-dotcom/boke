<template>
  <div class="desk-shell">
    <div class="desk-container">
      <AdminAccessBar />

      <section class="hero">
        <p class="eyebrow">Writing Desk</p>
        <h1>Use agents to draft, review, and publish posts.</h1>
        <p class="description">
          这里是 Agent 文章草稿的审核工作台。生成、待审核、编辑、发布和驳回都在这条链路内完成。
        </p>
      </section>

      <ArticleGenerateForm :generating="generating" @generate="handleGenerate" />
      <p v-if="generatedDraft" class="feedback success">
        已生成草稿：{{ generatedDraft.title }}
      </p>
      <p v-if="generationError" class="feedback error">{{ generationError }}</p>

      <LoadingState v-if="loading" message="Loading drafts..." />
      <ErrorState v-else-if="error" :message="error" />

      <div v-else class="desk-grid">
        <div class="desk-main">
          <section class="panel">
            <div class="panel-header">
              <h2>Drafts</h2>
              <span>{{ drafts.length }}</span>
            </div>
            <EmptyState
              v-if="!drafts.length"
              title="暂无草稿"
              description="可以先通过上方表单生成文章草稿。"
            />
            <DraftArticleList
              v-else
              :articles="drafts"
              :selected-article-id="selectedDraft?.id || null"
              @select="selectedDraft = $event"
              @publish="handlePublish"
              @reject="handleReject"
              @delete="handleDelete"
            />
          </section>

          <section class="panel">
            <div class="panel-header">
              <h2>Pending Review</h2>
              <span>{{ pendingReviews.length }}</span>
            </div>
            <EmptyState
              v-if="!pendingReviews.length"
              title="暂无待审核文章"
              description="待审核文章会在这里集中处理。"
            />
            <DraftArticleList
              v-else
              :articles="pendingReviews"
              :selected-article-id="selectedDraft?.id || null"
              @select="selectedDraft = $event"
              @publish="handlePublish"
              @reject="handleReject"
              @delete="handleDelete"
            />
          </section>
        </div>

        <aside class="desk-side">
          <section class="panel sticky-panel">
            <div class="panel-header">
              <h2>Selected Draft</h2>
              <span>{{ selectedDraft?.status || 'none' }}</span>
            </div>
            <EmptyState
              v-if="!selectedDraft"
              title="未选择草稿"
              description="点击左侧任一草稿卡片的“预览”，在这里查看完整预览。"
            />
            <ArticlePreview
              v-else
              :title="selectedDraft.title"
              :summary="selectedDraft.excerpt"
              :content="selectedDraft.content"
              :meta="selectedDraftMeta"
            />
          </section>

          <section class="panel">
            <div class="panel-header">
              <h2>Generation Jobs</h2>
              <span>{{ jobs.length }}</span>
            </div>
            <EmptyState
              v-if="!jobs.length"
              title="暂无生成任务"
              description="触发生成后，这里会显示文章生成任务记录。"
            />
            <GenerationJobList
              v-else
              :jobs="jobs"
              :retrying-job-id="retryingJobId"
              @retry="retry"
            />
          </section>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import AdminAccessBar from '@/components/admin/AdminAccessBar.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ArticleGenerateForm from '@/components/writing/ArticleGenerateForm.vue'
import DraftArticleList from '@/components/writing/DraftArticleList.vue'
import ArticlePreview from '@/components/writing/ArticlePreview.vue'
import GenerationJobList from '@/components/writing/GenerationJobList.vue'
import { useArticleDrafts } from '@/composables/useArticleDrafts'
import { useArticleGeneration } from '@/composables/useArticleGeneration'

const {
  drafts,
  pendingReviews,
  loading,
  acting,
  error,
  loadDrafts,
  publishDraft,
  rejectDraft,
  deleteDraft,
} = useArticleDrafts()

const {
  generating,
  error: generationError,
  generatedDraft,
  jobs,
  retryingJobId,
  loadJobs,
  generate,
  retry,
} = useArticleGeneration()

const selectedDraft = ref(null)

const selectedDraftMeta = computed(() => {
  if (!selectedDraft.value) {
    return []
  }

  return [
    selectedDraft.value.status,
    selectedDraft.value.author_type,
    ...(selectedDraft.value.tags || []),
  ]
})

const handleGenerate = async (payload) => {
  await generate({
    title: payload.title,
    excerpt: payload.excerpt,
    prompt: payload.prompt,
    sourceType: payload.sourceType,
    sourcePayload: {
      raw: payload.sourcePayload,
    },
    tags: payload.tags?.length ? payload.tags : ['Agent', 'Writing Desk'],
  })
  await loadDrafts()
  selectedDraft.value = generatedDraft.value
}

const handleReject = async (id) => {
  await rejectDraft(id, '需要补充结构、案例或来源说明。')
  if (selectedDraft.value?.id === id) {
    selectedDraft.value = drafts.value[0] || pendingReviews.value[0] || null
  }
}

const handlePublish = async (id) => {
  await publishDraft(id)
  if (selectedDraft.value?.id === id) {
    selectedDraft.value = drafts.value[0] || pendingReviews.value[0] || null
  }
}

const handleDelete = async (id) => {
  await deleteDraft(id)
  if (selectedDraft.value?.id === id) {
    selectedDraft.value = drafts.value[0] || pendingReviews.value[0] || null
  }
}

onMounted(async () => {
  await Promise.all([loadDrafts(), loadJobs()])
  selectedDraft.value = drafts.value[0] || pendingReviews.value[0] || null
})
</script>

<style scoped>
.desk-shell {
  min-height: 100vh;
  background: var(--color-gh-bg);
}

.desk-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 3rem 1.5rem 5rem;
}

.hero {
  margin-bottom: 2rem;
  padding: 2rem;
  border-radius: 24px;
  border: 1px solid var(--color-gh-border);
  background:
    radial-gradient(circle at top left, rgba(248, 81, 73, 0.12), transparent 28%),
    radial-gradient(circle at bottom right, rgba(62, 175, 124, 0.16), transparent 34%),
    linear-gradient(180deg, rgba(22, 27, 34, 0.96), rgba(13, 17, 23, 0.96));
}

.eyebrow {
  color: #f6c26b;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
}

h1 {
  margin-top: 0.75rem;
  font-size: clamp(2rem, 4vw, 3.25rem);
  font-weight: 700;
}

.description {
  margin-top: 1rem;
  color: var(--color-gh-text-muted);
  max-width: 760px;
  line-height: 1.7;
}

.desk-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(340px, 0.85fr);
  gap: 1rem;
  margin-top: 1.5rem;
}

.desk-main,
.desk-side,
.panel {
  display: grid;
  gap: 1rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--color-gh-text);
}

.sticky-panel {
  align-content: start;
}

.feedback {
  margin-top: 1rem;
  padding: 0.9rem 1rem;
  border-radius: 14px;
  border: 1px solid var(--color-gh-border);
}

.feedback.success {
  color: var(--color-vp-c-brand);
}

.feedback.error {
  color: #ff9494;
}

@media (max-width: 1024px) {
  .desk-grid {
    grid-template-columns: 1fr;
  }
}
</style>
