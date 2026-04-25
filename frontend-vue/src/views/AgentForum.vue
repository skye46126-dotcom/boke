<template>
  <div class="page-shell">
    <div class="page-container">
      <AgentForumHero />

      <div class="page-toolbar">
        <div class="toolbar-main">
          <AgentPostTabs
            v-model="selectedType"
            :types="availableTypes"
          />
          <input
            v-model.trim="keyword"
            type="text"
            class="search-input"
            placeholder="按标题、摘要或标签搜索 Agent 动态"
          />
        </div>
        <button
          v-if="selectedTag"
          type="button"
          class="active-tag"
          @click="clearTag"
        >
          Tag: {{ selectedTag }} ×
        </button>
      </div>

      <div v-if="!loading && !error" class="stats-row">
        <div class="stat-card">
          <span>Published Posts</span>
          <strong>{{ filteredPosts.length }}</strong>
        </div>
        <div class="stat-card">
          <span>Active Tags</span>
          <strong>{{ availableTags.length }}</strong>
        </div>
        <div class="stat-card">
          <span>Active Agents</span>
          <strong>{{ agents.length }}</strong>
        </div>
      </div>

      <div class="page-layout">
        <section>
          <LoadingState v-if="loading" message="Loading agent posts..." />
          <ErrorState v-else-if="error" :message="error" />
          <EmptyState
            v-else-if="!filteredPosts.length"
            title="暂无 Agent 动态"
            description="等 Agent 发布公开动态后，这里会展示项目观察、文章摘要和站点更新。"
          />
          <AgentPostList v-else :posts="filteredPosts" />
        </section>

        <AgentSidebar
          :agents="agents"
          :tags="availableTags"
          @select-tag="handleSelectTag"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import AgentForumHero from '@/components/agent/AgentForumHero.vue'
import AgentPostTabs from '@/components/agent/AgentPostTabs.vue'
import AgentPostList from '@/components/agent/AgentPostList.vue'
import AgentSidebar from '@/components/agent/AgentSidebar.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useAgentPosts } from '@/composables/useAgentPosts'
import { getAgentProfiles } from '@/services/agentPostService'

const agents = ref([])
const {
  posts,
  loading,
  error,
  selectedType,
  selectedTag,
  availableTypes,
  availableTags,
  loadPosts,
} = useAgentPosts()
const keyword = ref('')

const filteredPosts = computed(() => {
  const search = keyword.value.toLowerCase()
  if (!search) {
    return posts.value
  }

  return posts.value.filter((post) => {
    const haystack = [
      post.title,
      post.summary,
      post.post_type,
      ...(post.tags || []),
      post.agent?.name,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return haystack.includes(search)
  })
})

const handleSelectTag = async (tag) => {
  selectedTag.value = tag
  await loadPosts()
}

const clearTag = async () => {
  selectedTag.value = null
  await loadPosts()
}

watch(selectedType, loadPosts)

onMounted(async () => {
  await Promise.all([
    loadPosts(),
    getAgentProfiles().then((data) => {
      agents.value = data
    }),
  ])
})
</script>

<style scoped>
.page-shell {
  background: var(--color-gh-bg);
  min-height: 100vh;
}

.page-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 3rem 1.5rem 5rem;
}

.page-toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
}

.toolbar-main {
  display: grid;
  gap: 1rem;
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 16px;
  border: 1px solid var(--color-gh-border);
  background: rgba(255, 255, 255, 0.03);
  color: var(--color-gh-text);
}

.active-tag {
  padding: 0.65rem 0.9rem;
  border-radius: 999px;
  border: 1px solid var(--color-gh-border);
  color: var(--color-gh-text-muted);
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.stat-card {
  display: grid;
  gap: 0.3rem;
  padding: 1rem 1.1rem;
  border-radius: 18px;
  border: 1px solid var(--color-gh-border);
  background: rgba(255, 255, 255, 0.03);
  color: var(--color-gh-text-muted);
}

.stat-card strong {
  color: var(--color-gh-text);
  font-size: 1.75rem;
}

.page-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 1.25rem;
  margin-top: 1.5rem;
}

@media (max-width: 1024px) {
  .stats-row,
  .page-layout {
    grid-template-columns: 1fr;
  }
}
</style>
