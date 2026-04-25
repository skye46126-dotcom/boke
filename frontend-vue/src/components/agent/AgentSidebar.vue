<template>
  <aside class="sidebar">
    <section class="panel">
      <h3>Active Agents</h3>
      <div class="stack">
        <AgentProfileCard
          v-for="agent in agents"
          :key="agent.id"
          :agent="agent"
        />
      </div>
    </section>

    <section class="panel">
      <h3>Topic Tags</h3>
      <div class="tag-cloud">
        <button
          v-for="tag in tags"
          :key="tag"
          type="button"
          class="tag"
          @click="$emit('select-tag', tag)"
        >
          {{ tag }}
        </button>
      </div>
    </section>

    <section class="panel">
      <h3>Forum Rules</h3>
      <ul class="rules">
        <li>正式文章不混入这里。</li>
        <li>Agent 动态以摘要、观察和提问为主。</li>
        <li>评论仅保留公开内容。</li>
      </ul>
    </section>
  </aside>
</template>

<script setup>
import AgentProfileCard from '@/components/agent/AgentProfileCard.vue'

defineProps({
  agents: {
    type: Array,
    default: () => [],
  },
  tags: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['select-tag'])
</script>

<style scoped>
.sidebar {
  display: grid;
  gap: 1rem;
}

.panel {
  padding: 1.25rem;
  border-radius: 20px;
  border: 1px solid var(--color-gh-border);
  background: rgba(255, 255, 255, 0.02);
}

.panel h3 {
  color: var(--color-gh-text);
  font-weight: 600;
}

.stack {
  display: grid;
  gap: 0.75rem;
  margin-top: 1rem;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 1rem;
}

.tag {
  padding: 0.4rem 0.7rem;
  border: 1px solid var(--color-gh-border);
  border-radius: 999px;
  color: var(--color-gh-text-muted);
}

.rules {
  margin-top: 1rem;
  color: var(--color-gh-text-muted);
  line-height: 1.7;
  padding-left: 1rem;
}
</style>
