<template>
  <section class="editor-shell">
    <div class="section-header">
      <div>
        <p class="eyebrow">Homepage Content</p>
        <h2>主页内容编辑</h2>
      </div>
      <div class="actions">
        <button type="button" class="ghost" @click="reset" :disabled="saving">Reset</button>
        <button type="button" class="primary" @click="handleSave" :disabled="saving">
          {{ saving ? 'Saving...' : 'Save Homepage' }}
        </button>
      </div>
    </div>

    <p v-if="loading" class="feedback">Loading homepage content...</p>
    <p v-if="saveMessage" class="feedback success">{{ saveMessage }}</p>
    <div v-if="error" class="feedback error">
      <p>{{ error }}</p>
      <p v-if="isMissingTableError" class="hint">
        需要先在云端 Supabase SQL Editor 执行 `scripts/phase1_cloud_supabase_setup.sql`，创建 `site_content` 表后再刷新此页面。
      </p>
    </div>

    <div v-else class="editor-grid">
      <section class="panel">
        <h3>Personal Info</h3>
        <label>
          <span>Name</span>
          <input v-model="content.personalInfo.name" type="text" />
        </label>
        <label>
          <span>Title</span>
          <input v-model="content.personalInfo.title" type="text" />
        </label>
        <label>
          <span>Tagline</span>
          <textarea v-model="content.personalInfo.tagline" rows="3" />
        </label>
        <label>
          <span>Email</span>
          <input v-model="content.personalInfo.email" type="email" />
        </label>
        <label>
          <span>Avatar URL</span>
          <input v-model="content.personalInfo.avatar" type="text" />
        </label>
      </section>

      <section class="panel">
        <h3>Simple Lists</h3>
        <label>
          <span>Skills (one per line)</span>
          <textarea v-model="skillsText" rows="8" />
        </label>
        <label>
          <span>Navigation Items JSON</span>
          <textarea v-model="navItemsJson" rows="8" />
        </label>
      </section>

      <section class="panel wide">
        <h3>Social Links JSON</h3>
        <textarea v-model="socialLinksJson" rows="10" />
      </section>

      <section class="panel wide">
        <h3>Experiences JSON</h3>
        <textarea v-model="experiencesJson" rows="14" />
      </section>

      <section class="panel wide">
        <h3>Projects JSON</h3>
        <textarea v-model="projectsJson" rows="14" />
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useSiteContentAdmin } from '@/composables/useSiteContentAdmin'

const {
  content,
  loading,
  saving,
  error,
  saveMessage,
  load,
  save,
  reset,
} = useSiteContentAdmin()

const skillsText = computed({
  get: () => (content.value.skills || []).join('\n'),
  set: (value) => {
    content.value.skills = value.split('\n').map((item) => item.trim()).filter(Boolean)
  },
})

function createJsonModel(key) {
  return computed({
    get: () => JSON.stringify(content.value[key] || [], null, 2),
    set: (value) => {
      try {
        content.value[key] = JSON.parse(value)
      } catch {
        // Keep invalid text in textarea until save; validation handled on save.
      }
    },
  })
}

const navItemsJson = createJsonModel('navItems')
const socialLinksJson = createJsonModel('socialLinks')
const experiencesJson = createJsonModel('experiences')
const projectsJson = createJsonModel('projects')

const isMissingTableError = computed(() => {
  return (error.value || '').includes('site_content table is missing')
})

const handleSave = async () => {
  content.value.navItems = JSON.parse(navItemsJson.value)
  content.value.socialLinks = JSON.parse(socialLinksJson.value)
  content.value.experiences = JSON.parse(experiencesJson.value)
  content.value.projects = JSON.parse(projectsJson.value)
  await save()
}

watch(() => content.value, () => {
  if (error.value) {
    error.value = null
  }
}, { deep: true })

onMounted(load)
</script>

<style scoped>
.editor-shell {
  display: grid;
  gap: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.eyebrow {
  color: var(--color-vp-c-brand);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
}

.section-header h2 {
  color: var(--color-gh-text);
  font-size: 1.4rem;
  font-weight: 700;
  margin-top: 0.35rem;
}

.actions {
  display: flex;
  gap: 0.75rem;
}

.actions button {
  padding: 0.7rem 0.95rem;
  border-radius: 12px;
  border: 1px solid var(--color-gh-border);
}

.actions .primary {
  color: var(--color-vp-c-brand);
}

.actions .ghost {
  color: var(--color-gh-text);
}

.feedback {
  padding: 0.8rem 0.95rem;
  border-radius: 12px;
  border: 1px solid var(--color-gh-border);
}

.feedback.success {
  color: var(--color-vp-c-brand);
}

.feedback.error {
  color: #ff9494;
}

.hint {
  margin-top: 0.5rem;
  color: var(--color-gh-text-muted);
  font-size: 0.9rem;
}

.editor-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.wide {
  grid-column: 1 / -1;
}

.panel {
  display: grid;
  gap: 0.9rem;
  padding: 1rem;
  border-radius: 18px;
  border: 1px solid var(--color-gh-border);
  background: rgba(255, 255, 255, 0.03);
}

.panel h3 {
  color: var(--color-gh-text);
  font-weight: 700;
}

label {
  display: grid;
  gap: 0.4rem;
}

span {
  color: var(--color-gh-text-muted);
  font-size: 0.85rem;
}

input,
textarea {
  width: 100%;
  padding: 0.8rem 0.95rem;
  border-radius: 12px;
  border: 1px solid var(--color-gh-border);
  background: var(--color-gh-bg);
  color: var(--color-gh-text);
  font-family: var(--font-family-mono);
  font-size: 0.9rem;
}

textarea {
  resize: vertical;
}

@media (max-width: 1024px) {
  .section-header,
  .editor-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    display: grid;
  }
}
</style>
