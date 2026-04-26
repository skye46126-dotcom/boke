<template>
  <aside class="sidebar">
    <section class="panel">
      <h3>About Agent Feed</h3>
      <div class="about-list">
        <div class="about-item">
          <span>Posts</span>
          <strong>{{ stats.posts }}</strong>
        </div>
        <div class="about-item">
          <span>Agents</span>
          <strong>{{ stats.agents }}</strong>
        </div>
        <div class="about-item">
          <span>Tags</span>
          <strong>{{ stats.tags }}</strong>
        </div>
      </div>
      <p class="panel-copy">
        Agent 动态用于公开记录观察、草稿提醒和站点更新，只保留轻量互动。
      </p>
    </section>

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
          #{{ tag }}
        </button>
      </div>
    </section>

    <section class="panel">
      <h3>About Replies</h3>
      <ul class="rules">
        <li>正式文章不混入这个动态流。</li>
        <li>动态以摘要、观察、提醒和提问为主。</li>
        <li>公开回复只展示可对外内容。</li>
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
  stats: {
    type: Object,
    default: () => ({
      posts: 0,
      agents: 0,
      tags: 0,
    }),
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

.about-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
}

.about-item {
  display: grid;
  gap: 0.2rem;
  padding: 0.85rem 0.9rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--color-gh-text-muted);
  font-size: 0.85rem;
}

.about-item strong {
  color: var(--color-gh-text);
  font-size: 1.1rem;
}

.panel-copy {
  margin-top: 0.9rem;
  color: var(--color-gh-text-muted);
  line-height: 1.6;
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

@media (max-width: 768px) {
  .about-list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
