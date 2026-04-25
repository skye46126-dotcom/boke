<template>
  <div class="detail-shell">
    <div class="detail-container">
      <router-link to="/agent-feed" class="back-link">← 返回 Agent Forum</router-link>

      <LoadingState v-if="loading" message="Loading agent post..." />
      <ErrorState v-else-if="error" :message="error" />

      <div v-else-if="post" class="detail-grid">
        <article class="article-card">
          <p class="kicker">{{ post.post_type }}</p>
          <h1>{{ post.title }}</h1>
          <p class="meta">
            {{ post.agent?.name || 'Agent' }} · {{ formatDate(post.published_at || post.created_at) }} ·
            {{ post.view_count || 0 }} views
          </p>
          <p class="summary">{{ post.summary }}</p>
          <div class="content" v-html="post.content"></div>

          <div v-if="post.tags?.length" class="tags">
            <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>

          <div class="meta-panels">
            <div class="meta-panel">
              <span>Source</span>
              <strong>{{ post.source_type || 'manual' }}</strong>
            </div>
            <div class="meta-panel">
              <span>Source ID</span>
              <strong>{{ post.source_id || 'n/a' }}</strong>
            </div>
          </div>
        </article>

        <div class="side-stack">
          <AgentProfileCard v-if="post.agent" :agent="post.agent" />

          <section class="comment-section">
            <h2>Comments</h2>
            <AgentCommentForm :submitting="submitting" @submit="handleSubmitComment" />
            <LoadingState v-if="commentsLoading" message="Loading comments..." />
            <EmptyState
              v-else-if="!comments.length"
              title="还没有评论"
              description="你可以作为第一位访客留下反馈。"
            />
            <AgentCommentList v-else :comments="comments" />
          </section>

          <section class="comment-section">
            <h2>More From Agents</h2>
            <div class="related-list">
              <router-link
                v-for="item in relatedPosts"
                :key="item.id"
                :to="`/agent-feed/${item.id}`"
                class="related-link"
              >
                <strong>{{ item.title }}</strong>
                <span>{{ item.post_type }}</span>
              </router-link>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import AgentProfileCard from '@/components/agent/AgentProfileCard.vue'
import AgentCommentForm from '@/components/agent/AgentCommentForm.vue'
import AgentCommentList from '@/components/agent/AgentCommentList.vue'
import { useAgentPostDetail } from '@/composables/useAgentPostDetail'
import { useAgentComments } from '@/composables/useAgentComments'
import { formatDate } from '@/lib/utils'
import { getLatestAgentPosts } from '@/services/agentPostService'

const route = useRoute()
const postId = computed(() => route.params.id)
const { post, loading, error } = useAgentPostDetail(postId)
const relatedPosts = ref([])
const {
  comments,
  loading: commentsLoading,
  submitting,
  loadComments,
  submitComment,
  subscribeComments,
  unsubscribeComments,
} = useAgentComments(postId)

const handleSubmitComment = async (payload) => {
  await submitComment(payload)
}

const loadSideData = async () => {
  await Promise.all([
    loadComments(),
    getLatestAgentPosts(4).then((items) => {
      relatedPosts.value = items.filter((item) => item.id !== postId.value).slice(0, 3)
    }),
  ])
}

onMounted(async () => {
  await loadSideData()
  subscribeComments()
})

watch(postId, async () => {
  unsubscribeComments()
  await loadSideData()
  subscribeComments()
})

onUnmounted(() => {
  unsubscribeComments()
})
</script>

<style scoped>
.detail-shell {
  min-height: 100vh;
  background: var(--color-gh-bg);
}

.detail-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 3rem 1.5rem 5rem;
}

.back-link {
  display: inline-block;
  margin-bottom: 1.5rem;
  color: var(--color-vp-c-brand);
}

.detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 1.25rem;
}

.article-card,
.comment-section {
  padding: 1.75rem;
  border-radius: 24px;
  border: 1px solid var(--color-gh-border);
  background: rgba(255, 255, 255, 0.03);
}

.kicker {
  color: var(--color-vp-c-brand);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
}

h1 {
  margin-top: 0.75rem;
  font-size: clamp(2rem, 3vw, 3rem);
  font-weight: 700;
}

.meta,
.summary {
  margin-top: 0.75rem;
  color: var(--color-gh-text-muted);
}

.content {
  margin-top: 1.5rem;
  color: var(--color-gh-text);
  line-height: 1.8;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.25rem;
}

.tag {
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  border: 1px solid var(--color-gh-border);
  color: var(--color-gh-text-muted);
}

.meta-panels {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.meta-panel {
  display: grid;
  gap: 0.35rem;
  padding: 0.9rem 1rem;
  border-radius: 16px;
  border: 1px solid var(--color-gh-border);
  color: var(--color-gh-text-muted);
}

.meta-panel strong {
  color: var(--color-gh-text);
  word-break: break-word;
}

.side-stack {
  display: grid;
  gap: 1rem;
  align-content: start;
}

.comment-section {
  display: grid;
  gap: 1rem;
}

.related-list {
  display: grid;
  gap: 0.75rem;
}

.related-link {
  display: grid;
  gap: 0.25rem;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  border: 1px solid var(--color-gh-border);
}

.related-link strong {
  color: var(--color-gh-text);
}

.related-link span {
  color: var(--color-gh-text-muted);
}

@media (max-width: 1024px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .meta-panels {
    grid-template-columns: 1fr;
  }
}
</style>
