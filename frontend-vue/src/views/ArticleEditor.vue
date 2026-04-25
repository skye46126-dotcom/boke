<template>
  <div class="editor-shell">
    <div class="editor-container">
      <AdminAccessBar />
      <router-link to="/admin/writing-desk" class="back-link">← 返回 Writing Desk</router-link>

      <LoadingState v-if="loadingDraft" message="Loading draft..." />
      <ErrorState v-else-if="error" :message="error" />

      <div v-else class="editor-grid">
        <section class="main-panel">
          <ArticleMetaEditor
            :title="title"
            :slug="slug"
            :summary="summary"
            :content="content"
            :tags-text="tagsText"
            :cover-image="coverImage"
            @update:title="title = $event"
            @update:slug="slug = $event"
            @update:summary="summary = $event"
            @update:content="content = $event"
            @update:tags-text="tagsText = $event"
            @update:cover-image="coverImage = $event"
          />
          <ArticlePreview
            :title="title"
            :summary="summary"
            :content="content"
            :meta="previewMeta"
          />
        </section>

        <PublishPanel
          :status="status"
          :slug="slug"
          :review-note="reviewNote"
          :last-saved-at="lastSavedAt"
          :saving="saving"
          :publishing="publishing"
          @save="handleSave"
          @publish="handlePublish"
          @reject="handleReject"
          @delete="handleDelete"
          @update:review-note="reviewNote = $event"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminAccessBar from '@/components/admin/AdminAccessBar.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import ArticleMetaEditor from '@/components/writing/ArticleMetaEditor.vue'
import ArticlePreview from '@/components/writing/ArticlePreview.vue'
import PublishPanel from '@/components/writing/PublishPanel.vue'
import { useArticleEditor } from '@/composables/useArticleEditor'

const route = useRoute()
const router = useRouter()
const {
  title,
  slug,
  summary,
  content,
  tags,
  status,
  coverImage,
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
} = useArticleEditor()

const loadingDraft = ref(true)
const tagsText = ref('')

const previewMeta = computed(() => {
  const items = [status.value, slug.value || 'no-slug']
  if (coverImage.value) {
    items.push('cover-image')
  }
  items.push(...tags.value)
  return items
})

watch(tagsText, (value) => {
  tags.value = value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
})

watch(tags, (value) => {
  tagsText.value = value.join(', ')
}, { immediate: true })

const handleSave = async () => {
  await save()
}

const handlePublish = async () => {
  await publish()
  router.push('/admin/writing-desk')
}

const handleReject = async () => {
  await reject(reviewNote.value || '需要进一步修改结构或补充来源。')
}

const handleDelete = async () => {
  await remove()
  router.push('/admin/writing-desk')
}

onMounted(async () => {
  try {
    await load(route.params.id)
    tagsText.value = tags.value.join(', ')
  } finally {
    loadingDraft.value = false
  }
})
</script>

<style scoped>
.editor-shell {
  min-height: 100vh;
  background: var(--color-gh-bg);
}

.editor-container {
  max-width: 1360px;
  margin: 0 auto;
  padding: 3rem 1.5rem 5rem;
}

.back-link {
  display: inline-block;
  margin-bottom: 1.5rem;
  color: var(--color-vp-c-brand);
}

.editor-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 1rem;
}

.main-panel {
  display: grid;
  gap: 1rem;
}

@media (max-width: 1024px) {
  .editor-grid {
    grid-template-columns: 1fr;
  }
}
</style>
