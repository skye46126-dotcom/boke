<template>
  <form class="generate-form" @submit.prevent="submit">
    <div class="field-grid">
      <label>
        <span>草稿标题</span>
        <input v-model="form.title" type="text" placeholder="例如：Agent 写作工作台设计说明" />
      </label>
      <label>
        <span>来源类型</span>
        <select v-model="form.sourceType">
          <option value="manual_prompt">manual_prompt</option>
          <option value="project_doc">project_doc</option>
          <option value="article_summary">article_summary</option>
          <option value="changelog">changelog</option>
        </select>
      </label>
      <label class="wide">
        <span>摘要</span>
        <textarea v-model="form.excerpt" rows="3" placeholder="生成草稿时使用的摘要说明" />
      </label>
      <label class="wide">
        <span>标签</span>
        <input v-model="form.tagsText" type="text" placeholder="例如：Agent, Writing Desk, Architecture" />
      </label>
      <label class="wide">
        <span>Prompt</span>
        <textarea v-model="form.prompt" rows="4" placeholder="描述你希望 Agent 生成什么文章草稿" required />
      </label>
      <label class="wide">
        <span>Source Payload</span>
        <textarea v-model="form.sourcePayload" rows="4" placeholder="可粘贴文档摘要、变更说明或其他上下文" />
      </label>
    </div>
    <button class="submit-button" type="submit" :disabled="generating">
      {{ generating ? 'Generating...' : 'Generate Draft' }}
    </button>
  </form>
</template>

<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['generate'])

defineProps({
  generating: {
    type: Boolean,
    default: false,
  },
})

const form = reactive({
  title: '',
  sourceType: 'manual_prompt',
  excerpt: '',
  tagsText: '',
  prompt: '',
  sourcePayload: '',
})

const submit = () => {
  emit('generate', {
    ...form,
    tags: form.tagsText.split(',').map((tag) => tag.trim()).filter(Boolean),
  })
}
</script>

<style scoped>
.generate-form {
  padding: 1.5rem;
  border-radius: 24px;
  border: 1px solid var(--color-gh-border);
  background: rgba(255, 255, 255, 0.03);
}

.field-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.wide {
  grid-column: 1 / -1;
}

label {
  display: grid;
  gap: 0.5rem;
}

span {
  color: var(--color-gh-text-muted);
}

input,
select,
textarea {
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 14px;
  border: 1px solid var(--color-gh-border);
  background: var(--color-gh-bg);
  color: var(--color-gh-text);
}

.submit-button {
  margin-top: 1rem;
  padding: 0.9rem 1.1rem;
  border-radius: 14px;
  background: var(--color-vp-c-brand);
  color: #04130b;
  font-weight: 700;
}

@media (max-width: 768px) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}
</style>
