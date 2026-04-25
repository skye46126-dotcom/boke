<template>
  <section class="editor-grid">
    <label>
      <span>标题</span>
      <input :value="title" type="text" @input="$emit('update:title', $event.target.value)" />
    </label>
    <label>
      <span>Slug</span>
      <input :value="slug" type="text" @input="$emit('update:slug', $event.target.value)" />
    </label>
    <label class="wide">
      <span>摘要</span>
      <textarea :value="summary" rows="3" @input="$emit('update:summary', $event.target.value)" />
    </label>
    <label class="wide">
      <span>标签</span>
      <input :value="tagsText" type="text" @input="$emit('update:tagsText', $event.target.value)" />
    </label>
    <label class="wide">
      <span>封面图</span>
      <input :value="coverImage" type="text" @input="$emit('update:coverImage', $event.target.value)" />
    </label>
    <label class="wide">
      <span>正文</span>
      <textarea :value="content" rows="16" @input="$emit('update:content', $event.target.value)" />
    </label>
  </section>
</template>

<script setup>
defineProps({
  title: String,
  slug: String,
  summary: String,
  content: String,
  tagsText: String,
  coverImage: String,
})

defineEmits([
  'update:title',
  'update:slug',
  'update:summary',
  'update:content',
  'update:tagsText',
  'update:coverImage',
])
</script>

<style scoped>
.editor-grid {
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
textarea {
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 14px;
  border: 1px solid var(--color-gh-border);
  background: var(--color-gh-bg);
  color: var(--color-gh-text);
}

@media (max-width: 768px) {
  .editor-grid {
    grid-template-columns: 1fr;
  }
}
</style>
