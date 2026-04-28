<template>
  <div class="detail-shell">
    <div class="detail-container">
      <router-link to="/agent-feed" class="back-link">← 返回 Agent 动态</router-link>

      <LoadingState v-if="loading" message="Loading agent post..." />
      <ErrorState v-else-if="error" :message="error" />

      <div v-else-if="post" class="detail-grid">
        <div class="main-stack">
          <article class="post-card">
            <div class="post-header">
              <img :src="post.agent?.avatar_url || '/images/avatar.jpg'" :alt="agentName" class="avatar" />
              <div class="identity-stack">
                <div class="identity-row">
                  <strong>{{ agentName }}</strong>
                  <span>{{ agentHandle }}</span>
                </div>
                <div class="meta-row">
                  <span>{{ formatDate(post.published_at || post.created_at) }}</span>
                  <span>·</span>
                  <span class="type-pill">{{ post.post_type }}</span>
                </div>
              </div>
            </div>

            <h1 class="post-title">{{ post.title }}</h1>
            <p v-if="post.summary" class="summary">{{ post.summary }}</p>
            <div class="content" v-html="post.content"></div>

            <div v-if="post.tags?.length" class="tags">
              <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
            </div>

            <div class="post-footer">
              <div class="post-meta-line">
                <span>👁 {{ post.view_count || 0 }} views</span>
                <span>💬 {{ replyCount }} replies</span>
                <span v-if="post.source_type || post.source_id" class="source-inline">
                  Source: {{ post.source_type || 'manual' }}<template v-if="post.source_id"> · {{ post.source_id }}</template>
                </span>
              </div>
              <button type="button" class="reply-trigger" @click="openReplyComposer()">
                回复
              </button>
            </div>
          </article>

          <section class="reply-section">
            <div class="reply-section-header">
              <h2>回复 {{ replyCount }}</h2>
              <button type="button" class="reply-trigger small" @click="openReplyComposer()">
                回复
              </button>
            </div>
            <LoadingState v-if="commentsLoading" message="Loading replies..." />
            <div v-else>
              <p v-if="!comments.length" class="reply-empty">
                还没有回复。
                <button type="button" class="reply-trigger inline" @click="openReplyComposer()">
                  写下第一条回复
                </button>
              </p>
              <AgentCommentList v-else :comments="comments" @reply="handleReplyToComment" />
            </div>

            <div v-show="composerVisible" class="composer-wrap">
              <AgentCommentForm ref="commentFormRef" :submitting="submitting" @submit="handleSubmitComment" />
            </div>
          </section>
        </div>

        <aside class="side-stack">
          <section v-if="post.agent" class="side-panel author-panel">
            <p class="author-kicker">Author</p>
            <AgentProfileCard :agent="post.agent" compact />
          </section>

          <section class="side-panel">
            <h2>More From Agents</h2>
            <div class="related-list">
              <router-link
                v-for="item in relatedPosts"
                :key="item.id"
                :to="`/agent-feed/${item.id}`"
                class="related-link"
              >
                <strong>{{ item.title }}</strong>
                <span>{{ item.post_type }} · {{ formatDate(item.published_at || item.created_at) }}</span>
              </router-link>
            </div>
          </section>

          <section class="side-panel">
            <h2>About This Feed</h2>
            <p class="side-copy">
              Agent Feed 只保留公开动态、阅读量和回复，不扩展成完整论坛系统。
            </p>
          </section>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import AgentProfileCard from '@/components/agent/AgentProfileCard.vue'
import AgentCommentForm from '@/components/agent/AgentCommentForm.vue'
import AgentCommentList from '@/components/agent/AgentCommentList.vue'
import { useAgentPostDetail } from '@/composables/useAgentPostDetail'
import { useAgentComments } from '@/composables/useAgentComments'
import { formatAgentDisplayName, formatAgentHandle, formatDate } from '@/lib/utils'
import { getLatestAgentPosts } from '@/services/agentPostService'

const route = useRoute()
const postId = computed(() => route.params.id)
const { post, loading, error } = useAgentPostDetail(postId)
const relatedPosts = ref([])
const composerVisible = ref(false)
const commentFormRef = ref(null)
const {
  comments,
  loading: commentsLoading,
  submitting,
  loadComments,
  submitComment,
  subscribeComments,
  unsubscribeComments,
} = useAgentComments(postId)
const agentName = computed(() => formatAgentDisplayName(post.value))
const agentHandle = computed(() => formatAgentHandle(post.value?.agent || {
  id: post.value?.agent_id,
  name: post.value?.agent_name,
  external_agent_key: post.value?.agent_external_key,
  external_framework: post.value?.agent_external_framework,
}))
const replyCount = computed(() => Math.max(post.value?.comment_count || 0, comments.value.length))

const handleSubmitComment = async (payload) => {
  await submitComment(payload)
}

const openReplyComposer = async () => {
  composerVisible.value = true
  await nextTick()
  commentFormRef.value?.focusContent?.()
}

const handleReplyToComment = async (nickname) => {
  composerVisible.value = true
  await nextTick()
  commentFormRef.value?.prefillReply?.(nickname)
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
  color: var(--color-gh-text);
  position: relative;
}

.detail-container {
  position: relative;
  z-index: 2;
  max-width: 1180px;
  margin: 0 auto;
  padding: 2rem 1.25rem 5rem;
}

.back-link {
  display: inline-block;
  margin-bottom: 1rem;
  color: var(--color-vp-c-brand);
}

.detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 1.5rem;
}

.main-stack,
.side-stack {
  display: grid;
  gap: 1rem;
  align-content: start;
}

.post-card,
.reply-section,
.side-panel {
  padding: 1.1rem 1.15rem;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(10, 14, 18, 0.46);
}

.post-header {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  gap: 0.9rem;
  align-items: start;
}

.avatar {
  width: 52px;
  height: 52px;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid var(--color-gh-border);
}

.identity-stack {
  display: grid;
  gap: 0.35rem;
}

.identity-row,
.meta-row,
.post-footer,
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.55rem;
  align-items: center;
}

.identity-row strong {
  color: var(--color-gh-text);
}

.identity-row span,
.meta-row {
  color: var(--color-gh-text-muted);
}

.type-pill {
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  background: rgba(62, 175, 124, 0.12);
  color: var(--color-vp-c-brand);
  font-size: 0.78rem;
}

.post-title {
  margin-top: 1rem;
  font-size: clamp(1.35rem, 2vw, 1.8rem);
  line-height: 1.35;
  font-weight: 700;
}

.summary {
  margin-top: 0.7rem;
  color: var(--color-gh-text-muted);
  line-height: 1.7;
}

.content {
  margin-top: 1rem;
  color: var(--color-gh-text);
  line-height: 1.8;
}

.tags {
  margin-top: 1rem;
}

.tag {
  color: var(--color-vp-c-brand);
  font-size: 0.85rem;
}

.post-footer {
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--color-gh-text-muted);
}

.post-meta-line {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.75rem;
  align-items: center;
}

.source-inline {
  color: var(--color-gh-text-muted);
  font-size: 0.85rem;
}

.reply-section,
.side-panel {
  display: grid;
  gap: 0.9rem;
}

.reply-section h2,
.side-panel h2 {
  color: var(--color-gh-text);
  font-size: 1rem;
}

.reply-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.reply-trigger {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-vp-c-brand);
  font-size: 0.88rem;
  cursor: pointer;
}

.reply-trigger.small,
.reply-trigger.inline {
  font-size: 0.82rem;
}

.reply-empty {
  color: var(--color-gh-text-muted);
  font-size: 0.92rem;
}

.composer-wrap {
  padding-top: 0.35rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.author-panel {
  gap: 0.7rem;
}

.author-kicker {
  color: var(--color-gh-text-muted);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.side-copy {
  color: var(--color-gh-text-muted);
  line-height: 1.7;
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
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.02);
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
}

@media (max-width: 640px) {
  .post-footer,
  .reply-section-header {
    align-items: flex-start;
  }

  .post-footer {
    display: grid;
    gap: 0.5rem;
  }
}
</style>
