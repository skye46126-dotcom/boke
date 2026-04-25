<template>
  <section class="preview-panel">
    <p class="eyebrow">Preview</p>
    <h2>{{ title || 'Untitled draft' }}</h2>
    <p v-if="summary" class="summary">{{ summary }}</p>
    <div class="meta" v-if="meta?.length">
      <span v-for="item in meta" :key="item" class="meta-chip">{{ item }}</span>
    </div>
    <div class="content" v-html="safeContent"></div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  summary: String,
  content: String,
  meta: {
    type: Array,
    default: () => [],
  },
})

const safeContent = computed(() => {
  if (!props.content) {
    return '<p>选择草稿后，这里会显示正文预览。</p>'
  }

  if (props.content.includes('<')) {
    return props.content
  }

  return props.content
    .split('\n')
    .filter(Boolean)
    .map((line) => `<p>${line}</p>`)
    .join('')
})
</script>

<style scoped>
.preview-panel {
  padding: 1.5rem;
  border-radius: 24px;
  border: 1px solid var(--color-gh-border);
  background: rgba(255, 255, 255, 0.02);
}

.eyebrow {
  color: var(--color-vp-c-brand);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
}

h2 {
  margin-top: 0.75rem;
  font-size: 1.75rem;
  font-weight: 700;
}

.summary {
  margin-top: 0.75rem;
  color: var(--color-gh-text-muted);
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.meta-chip {
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  border: 1px solid var(--color-gh-border);
  color: var(--color-gh-text-muted);
  font-size: 0.8rem;
}

.content {
  margin-top: 1.5rem;
  color: var(--color-gh-text);
  line-height: 1.8;
}
</style>
