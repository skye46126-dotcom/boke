<template>
  <div class="comment-list">
    <div
      v-for="comment in comments"
      :key="comment.id"
      class="comment-item"
    >
      <div class="comment-header">
        <strong>{{ comment.nickname }}</strong>
        <span>{{ formatDate(comment.created_at) }}</span>
      </div>
      <p>{{ comment.content }}</p>
    </div>
  </div>
</template>

<script setup>
import { formatDate } from '@/lib/utils'

defineProps({
  comments: {
    type: Array,
    default: () => [],
  },
})
</script>

<style scoped>
.comment-list {
  display: grid;
  gap: 1rem;
}

.comment-item {
  padding: 1rem 1.25rem;
  border-radius: 16px;
  border: 1px solid var(--color-gh-border);
  background: var(--color-gh-card);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
  color: var(--color-gh-text-muted);
  font-size: 0.9rem;
}

.comment-item p {
  color: var(--color-gh-text);
  line-height: 1.7;
}
</style>
