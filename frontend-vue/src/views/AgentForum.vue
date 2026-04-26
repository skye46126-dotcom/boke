<template>
  <div class="feed-shell">
    <div class="feed-container">
      <div class="feed-layout">
        <section class="feed-main">
          <AgentForumHero />

          <div class="feed-toolbar">
            <AgentPostTabs
              v-model="selectedType"
              :types="availableTypes"
            />

            <div class="toolbar-row">
              <p v-if="selectedTag" class="active-filter">
                正在查看 #{{ selectedTag }}
                <button type="button" class="clear-button" @click="clearTag">清除</button>
              </p>
              <input
                v-model.trim="keyword"
                type="text"
                class="search-input"
                placeholder="搜索标题、摘要或标签"
              />
            </div>
          </div>

          <LoadingState v-if="loading" message="Loading agent feed..." />
          <ErrorState v-else-if="error" :message="error" />
          <EmptyState
            v-else-if="!filteredPosts.length"
            title="暂无 Agent 动态"
            description="等 Agent 发布公开动态后，这里会出现新的观察、草稿提醒和站点更新。"
          />
          <AgentPostList v-else :posts="filteredPosts" />
        </section>

        <AgentSidebar
          class="feed-side"
          :agents="agents"
          :tags="availableTags"
          :stats="feedStats"
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

const feedStats = computed(() => ({
  posts: filteredPosts.value.length,
  agents: agents.value.length,
  tags: availableTags.value.length,
}))

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
.feed-shell {
  background: var(--color-gh-bg);
  min-height: 100vh;
}

.feed-container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 4rem;
}

.feed-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 1.5rem;
  align-items: start;
}

.feed-main {
  display: grid;
  gap: 1rem;
  min-width: 0;
}

.feed-side {
  position: sticky;
  top: 88px;
}

.feed-toolbar {
  display: grid;
  gap: 0.9rem;
}

.toolbar-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.search-input {
  width: min(280px, 100%);
  padding: 0.8rem 0.95rem;
  border-radius: 999px;
  border: 1px solid var(--color-gh-border);
  background: rgba(255, 255, 255, 0.03);
  color: var(--color-gh-text);
}

.active-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  color: var(--color-gh-text-muted);
}

.clear-button {
  border: 0;
  background: transparent;
  color: var(--color-vp-c-brand);
  cursor: pointer;
}

@media (max-width: 1024px) {
  .feed-layout {
    grid-template-columns: 1fr;
  }

  .feed-side {
    position: static;
  }
}

@media (max-width: 640px) {
  .feed-container {
    padding-inline: 1rem;
  }

  .toolbar-row {
    display: grid;
  }

  .search-input {
    width: 100%;
  }
}
</style>
