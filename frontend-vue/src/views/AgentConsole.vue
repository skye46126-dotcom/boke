<template>
  <div class="console-shell">
    <div class="console-container">
      <AdminAccessBar />

      <section class="hero">
        <p class="eyebrow">Agent Console</p>
        <h1>运行状态、待审核内容和失败任务集中在这里。</h1>
      </section>

      <div v-if="!loading && !error" class="summary-grid">
        <div class="summary-card">
          <span>Active Agents</span>
          <strong>{{ snapshot.profiles.length }}</strong>
        </div>
        <div class="summary-card">
          <span>Pending Posts</span>
          <strong>{{ snapshot.pendingPosts.length }}</strong>
        </div>
        <div class="summary-card">
          <span>Pending Articles</span>
          <strong>{{ snapshot.pendingArticles.length }}</strong>
        </div>
        <div class="summary-card">
          <span>Generation Jobs</span>
          <strong>{{ snapshot.generationJobs.length }}</strong>
        </div>
      </div>

      <LoadingState v-if="loading" message="Loading agent console..." />
      <ErrorState v-else-if="error" :message="error" />

      <div v-else class="console-grid">
        <section class="panel">
          <h2>Agents</h2>
          <div class="panel-list">
            <AgentProfileCard
              v-for="profile in snapshot.profiles"
              :key="profile.id"
              :agent="profile"
            />
          </div>
        </section>

        <section class="panel">
          <h2>Pending Agent Posts</h2>
          <EmptyState
            v-if="!snapshot.pendingPosts.length"
            title="没有待审核 Agent 帖子"
            description="待审核内容会在这里集中显示。"
          />
          <div v-else class="panel-list">
            <BaseCard
              v-for="post in snapshot.pendingPosts"
              :key="post.id"
              variant="border"
              class="panel-card"
            >
              <p class="muted">{{ post.post_type }} · {{ post.agent?.name || 'Agent' }}</p>
              <h3>{{ post.title }}</h3>
              <div class="actions">
                <button @click="handlePublishPost(post.id)">发布</button>
                <button @click="handleRejectPost(post.id)">驳回</button>
              </div>
            </BaseCard>
          </div>
        </section>

        <section class="panel">
          <h2>Failed Jobs</h2>
          <EmptyState
            v-if="!snapshot.failedJobs.length"
            title="当前没有失败任务"
            description="失败任务会在这里显示错误摘要与重试入口。"
          />
          <div v-else class="panel-list">
            <BaseCard
              v-for="job in snapshot.failedJobs"
              :key="job.id"
              variant="border"
              class="panel-card"
            >
              <p class="muted">{{ job.job_type }}</p>
              <h3>{{ job.error_message }}</h3>
              <button @click="handleRetryJob(job.id)">重试任务</button>
            </BaseCard>
          </div>
        </section>

        <section class="panel">
          <h2>Generation Jobs</h2>
          <EmptyState
            v-if="!snapshot.generationJobs.length"
            title="暂无生成任务"
            description="Writing Desk 触发的文章生成任务会显示在这里。"
          />
          <div v-else class="panel-list">
            <BaseCard
              v-for="job in snapshot.generationJobs"
              :key="job.id"
              variant="border"
              class="panel-card"
            >
              <p class="muted">{{ job.source_type || 'manual_prompt' }} · {{ job.status }}</p>
              <h3>{{ job.prompt || 'No prompt recorded' }}</h3>
              <p class="muted">{{ new Date(job.created_at).toLocaleString('zh-CN') }}</p>
            </BaseCard>
          </div>
        </section>

        <section class="panel">
          <h2>Pending Article Drafts</h2>
          <EmptyState
            v-if="!snapshot.pendingArticles.length"
            title="没有待审核文章草稿"
            description="Writing Desk 中进入待审核状态的文章会同步显示到这里。"
          />
          <div v-else class="panel-list">
            <BaseCard
              v-for="article in snapshot.pendingArticles"
              :key="article.id"
              variant="border"
              class="panel-card"
            >
              <p class="muted">{{ article.author_type }} · {{ article.status }}</p>
              <h3>{{ article.title }}</h3>
              <router-link :to="`/admin/articles/${article.id}/edit`" class="muted">
                进入编辑器 →
              </router-link>
            </BaseCard>
          </div>
        </section>

        <section class="panel wide">
          <h2>Recent Jobs</h2>
          <div class="job-table">
            <div v-for="job in snapshot.jobs" :key="job.id" class="job-row">
              <div>
                <strong>{{ job.job_type }}</strong>
                <p class="muted">{{ job.id }}</p>
              </div>
              <span class="status">{{ job.status }}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import AdminAccessBar from '@/components/admin/AdminAccessBar.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import AgentProfileCard from '@/components/agent/AgentProfileCard.vue'
import {
  getAgentConsoleSnapshot,
  publishAgentPost,
  rejectAgentPost,
  retryAgentJob,
} from '@/services/agentAdminService'

const loading = ref(true)
const error = ref(null)
const snapshot = reactive({
  profiles: [],
  jobs: [],
  failedJobs: [],
  pendingPosts: [],
  pendingArticles: [],
  generationJobs: [],
})

const loadSnapshot = async () => {
  loading.value = true
  error.value = null

  try {
    const data = await getAgentConsoleSnapshot()
    snapshot.profiles = data.profiles
    snapshot.jobs = data.jobs
    snapshot.failedJobs = data.failedJobs
    snapshot.pendingPosts = data.pendingPosts
    snapshot.pendingArticles = data.pendingArticles
    snapshot.generationJobs = data.generationJobs || []
  } catch (err) {
    error.value = err.message || 'Failed to load agent console'
  } finally {
    loading.value = false
  }
}

const handlePublishPost = async (id) => {
  await publishAgentPost(id)
  await loadSnapshot()
}

const handleRejectPost = async (id) => {
  await rejectAgentPost(id)
  await loadSnapshot()
}

const handleRetryJob = async (id) => {
  await retryAgentJob(id)
  await loadSnapshot()
}

onMounted(loadSnapshot)
</script>

<style scoped>
.console-shell {
  min-height: 100vh;
  background: var(--color-gh-bg);
}

.console-container {
  max-width: 1360px;
  margin: 0 auto;
  padding: 3rem 1.5rem 5rem;
}

.hero {
  padding: 2rem;
  border-radius: 24px;
  border: 1px solid var(--color-gh-border);
  background:
    radial-gradient(circle at top right, rgba(88, 166, 255, 0.18), transparent 28%),
    linear-gradient(180deg, rgba(22, 27, 34, 0.96), rgba(13, 17, 23, 0.96));
}

.eyebrow {
  color: #58a6ff;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
}

h1 {
  margin-top: 0.75rem;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
}

.console-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.summary-card {
  display: grid;
  gap: 0.35rem;
  padding: 1rem 1.1rem;
  border-radius: 18px;
  border: 1px solid var(--color-gh-border);
  background: rgba(255, 255, 255, 0.03);
  color: var(--color-gh-text-muted);
}

.summary-card strong {
  color: var(--color-gh-text);
  font-size: 1.65rem;
}

.wide {
  grid-column: 1 / -1;
}

.panel {
  padding: 1.25rem;
  border-radius: 24px;
  border: 1px solid var(--color-gh-border);
  background: rgba(255, 255, 255, 0.03);
}

.panel h2 {
  color: var(--color-gh-text);
  font-weight: 700;
}

.panel-list,
.job-table {
  display: grid;
  gap: 0.75rem;
  margin-top: 1rem;
}

.panel-card {
  padding: 1rem;
}

.panel-card h3,
.job-row strong {
  color: var(--color-gh-text);
}

.muted {
  color: var(--color-gh-text-muted);
}

.actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.job-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  border-radius: 16px;
  border: 1px solid var(--color-gh-border);
}

.status {
  color: var(--color-vp-c-brand);
}

@media (max-width: 1024px) {
  .summary-grid,
  .console-grid {
    grid-template-columns: 1fr;
  }
}
</style>
