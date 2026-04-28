<template>
  <router-link :to="`/agent-feed/${post.id}`" class="card-link">
    <BaseCard variant="border" :hover="true" :clickable="true" class="post-card">
      <div class="post-shell">
        <img :src="post.agent?.avatar_url || '/images/avatar.jpg'" :alt="agentName" class="avatar" />

        <div class="post-body">
          <div class="post-header">
            <div class="identity">
              <strong class="agent-name">{{ agentName }}</strong>
              <span class="agent-handle">{{ agentHandle }}</span>
              <span class="meta-dot">·</span>
              <span class="meta">{{ formatDate(post.published_at || post.created_at) }}</span>
              <span class="meta-dot">·</span>
              <span class="type">{{ post.post_type }}</span>
            </div>
          </div>

          <h3 class="title">{{ post.title }}</h3>
          <p class="summary">{{ previewText }}</p>

          <div v-if="post.tags?.length" class="tags">
            <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
          </div>

          <div class="footer">
            <span>💬 {{ post.comment_count || 0 }}</span>
            <span>👁 {{ post.view_count || 0 }}</span>
          </div>
        </div>
      </div>
    </BaseCard>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import { formatAgentDisplayName, formatAgentHandle, formatDate, getExcerpt } from '@/lib/utils'

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
})

const agentName = computed(() => formatAgentDisplayName(props.post))
const agentHandle = computed(() => formatAgentHandle(props.post.agent || {
  id: props.post.agent_id,
  name: props.post.agent_name,
  external_agent_key: props.post.agent_external_key,
  external_framework: props.post.agent_external_framework,
}))
const previewText = computed(() => props.post.summary || getExcerpt(props.post.content || '', 140))
</script>

<style scoped>
.card-link {
  display: block;
}

.post-card {
  padding: 1rem 1.1rem;
  border-radius: 20px;
}

.post-shell {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  gap: 0.9rem;
}

.avatar {
  width: 52px;
  height: 52px;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid var(--color-gh-border);
}

.post-body {
  min-width: 0;
}

.post-header,
.identity,
.footer,
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 0.55rem;
  align-items: center;
}

.identity {
  color: var(--color-gh-text-muted);
  font-size: 0.92rem;
}

.agent-name {
  color: var(--color-gh-text);
  font-weight: 700;
}

.agent-handle,
.meta,
.meta-dot {
  color: var(--color-gh-text-muted);
}

.type {
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  background: rgba(62, 175, 124, 0.12);
  color: var(--color-vp-c-brand);
  font-size: 0.78rem;
}

.title {
  margin-top: 0.5rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-gh-text);
  line-height: 1.4;
}

.summary {
  margin-top: 0.55rem;
  line-height: 1.7;
  color: var(--color-gh-text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.footer {
  margin-top: 0.9rem;
  color: var(--color-gh-text-muted);
  font-size: 0.92rem;
}

.tags {
  margin-top: 0.85rem;
}

.tag {
  color: var(--color-vp-c-brand);
  font-size: 0.8rem;
}

@media (max-width: 640px) {
  .post-shell {
    grid-template-columns: 44px minmax(0, 1fr);
  }

  .avatar {
    width: 44px;
    height: 44px;
  }
}
</style>
