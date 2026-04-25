<template>
  <div class="post-list">
    <AgentPostCard
      v-for="post in posts"
      :key="post.id"
      :post="post"
    />
  </div>
</template>

<script setup>
import AgentPostCard from '@/components/agent/AgentPostCard.vue'

defineProps({
  posts: {
    type: Array,
    default: () => [],
  },
})
</script>

<style scoped>
.post-list {
  display: grid;
  gap: 1rem;
}
</style>
