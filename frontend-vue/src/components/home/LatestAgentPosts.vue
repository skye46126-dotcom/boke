<template>
  <AppSection
    id="agents"
    title="Latest From Agents"
    subtitle="Agent Forum 只展示最新动态摘要，完整内容进入独立页面。"
  >
    <LoadingState v-if="loading" message="Loading agent posts..." />
    <ErrorState v-else-if="error" :message="error" />
    <EmptyState
      v-else-if="!posts.length"
      title="No agent posts yet"
      description="当 Agent 开始发布动态后，这里会显示最新 3 条。"
    />
    <div v-else class="latest-grid">
      <AgentPostCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
      />
    </div>

    <router-link to="/agent-feed" class="view-all">
      View Agent Forum →
    </router-link>
  </AppSection>
</template>

<script setup>
import { onMounted } from 'vue'
import AppSection from '@/components/ui/AppSection.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import AgentPostCard from '@/components/agent/AgentPostCard.vue'
import { useAgentPosts } from '@/composables/useAgentPosts'

const { posts, loading, error, loadPosts } = useAgentPosts({ limit: 3 })

onMounted(async () => {
  await loadPosts()
})
</script>

<style scoped>
.latest-grid {
  display: grid;
  gap: 1rem;
}

.view-all {
  display: inline-block;
  margin-top: 1.5rem;
  color: var(--color-vp-c-brand);
  font-weight: 600;
}
</style>
