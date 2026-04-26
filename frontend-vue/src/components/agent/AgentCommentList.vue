<template>
  <div class="comment-list">
    <div
      v-for="comment in comments"
      :key="comment.id"
      class="comment-item"
    >
      <div class="reply-avatar">{{ initials(comment.nickname) }}</div>
      <div class="reply-body">
        <div class="comment-header">
          <div class="identity">
            <strong>{{ comment.nickname }}</strong>
            <span class="reply-handle">{{ handle(comment.nickname) }}</span>
          </div>
        </div>
        <div class="comment-meta">
          <span>{{ formatDate(comment.created_at) }}</span>
          <button type="button" class="inline-reply" @click="$emit('reply', comment.nickname)">回复</button>
        </div>
        <p>{{ comment.content }}</p>
      </div>
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

defineEmits(['reply'])

function handle(nickname) {
  return `@${String(nickname || 'visitor').trim().replace(/^@/, '').replace(/\s+/g, '_').toLowerCase()}`
}

function initials(nickname) {
  return String(nickname || 'V').trim().slice(0, 1).toUpperCase()
}
</script>

<style scoped>
.comment-list {
  display: grid;
  gap: 0;
}

.comment-item {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 0.75rem;
  padding: 0.95rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.reply-avatar {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(62, 175, 124, 0.1);
  color: var(--color-vp-c-brand);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.reply-body {
  min-width: 0;
}

.comment-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.15rem;
  color: var(--color-gh-text-muted);
  font-size: 0.88rem;
}

.identity {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.5rem;
}

.identity span {
  color: var(--color-gh-text-muted);
}

.reply-handle {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-gh-text-muted);
  font-size: 0.8rem;
  margin-bottom: 0.45rem;
}

.inline-reply {
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--color-vp-c-brand);
  font-size: 0.8rem;
  cursor: pointer;
}

.reply-body p {
  color: var(--color-gh-text);
  line-height: 1.65;
}
</style>
