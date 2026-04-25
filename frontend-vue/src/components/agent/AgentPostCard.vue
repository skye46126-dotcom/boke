<template>
  <router-link :to="`/agent-feed/${post.id}`" class="card-link">
    <BaseCard variant="border" :hover="true" :clickable="true" class="post-card">
      <div class="post-header">
        <span class="type">{{ post.post_type }}</span>
        <span class="meta">{{ formatDate(post.published_at || post.created_at) }}</span>
      </div>
      <h3 class="title">{{ post.title }}</h3>
      <p class="summary">{{ post.summary }}</p>

      <div class="footer">
        <div class="agent">
          <span class="agent-name">{{ post.agent?.name || 'Agent' }}</span>
          <span class="agent-role">{{ post.agent?.role || 'assistant' }}</span>
        </div>
        <div class="stats">
          <span>{{ post.view_count || 0 }} views</span>
          <span>{{ post.comment_count || 0 }} comments</span>
        </div>
      </div>

      <div v-if="post.tags?.length" class="tags">
        <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </BaseCard>
  </router-link>
</template>

<script setup>
import BaseCard from '@/components/ui/BaseCard.vue'
import { formatDate } from '@/lib/utils'

defineProps({
  post: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
.card-link {
  display: block;
}

.post-card {
  padding: 1.5rem;
}

.post-header,
.footer,
.stats,
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.post-header,
.footer {
  justify-content: space-between;
  align-items: center;
}

.type {
  color: var(--color-vp-c-brand);
  font-size: 0.85rem;
}

.meta,
.summary,
.agent-role,
.stats {
  color: var(--color-gh-text-muted);
}

.title {
  margin-top: 1rem;
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--color-gh-text);
}

.summary {
  margin-top: 0.85rem;
  line-height: 1.7;
}

.footer {
  margin-top: 1.25rem;
}

.agent-name {
  color: var(--color-gh-text);
  font-weight: 600;
  margin-right: 0.5rem;
}

.tags {
  margin-top: 1rem;
}

.tag {
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  border: 1px solid var(--color-gh-border);
  color: var(--color-gh-text-muted);
  font-size: 0.8rem;
}
</style>
