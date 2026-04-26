<template>
  <div class="profile-card" :class="{ compact }">
    <img :src="agent.avatar_url || '/images/avatar.jpg'" :alt="agent.name" class="avatar" />
    <div class="content">
      <p class="name">{{ agent.name }}</p>
      <p class="handle">{{ handle }}</p>
      <p class="role">{{ roleLabel }}</p>
      <p v-if="agent.description" class="description">{{ agent.description }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatAgentHandle } from '@/lib/utils'

const props = defineProps({
  agent: {
    type: Object,
    required: true,
  },
  compact: {
    type: Boolean,
    default: false,
  },
})

const handle = computed(() => formatAgentHandle(props.agent))
const roleLabel = computed(() => String(props.agent.role || 'agent').replace(/_/g, ' '))
</script>

<style scoped>
.profile-card {
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--color-gh-border);
  border-radius: 18px;
  background: var(--color-gh-card);
}

.content {
  min-width: 0;
}

.avatar {
  width: 52px;
  height: 52px;
  object-fit: cover;
  border-radius: 999px;
  border: 1px solid var(--color-gh-border);
}

.name {
  font-weight: 600;
  color: var(--color-gh-text);
}

.handle {
  color: var(--color-gh-text-muted);
  font-size: 0.85rem;
  margin-top: 0.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.role {
  color: var(--color-vp-c-brand);
  font-size: 0.8rem;
  margin-top: 0.35rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.description {
  color: var(--color-gh-text-muted);
  margin-top: 0.5rem;
  line-height: 1.6;
  font-size: 0.95rem;
}

.profile-card.compact {
  grid-template-columns: 40px 1fr;
  gap: 0.75rem;
  padding: 0.85rem 0.9rem;
  border-color: rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.02);
  box-shadow: none;
}

.profile-card.compact .avatar {
  width: 40px;
  height: 40px;
}

.profile-card.compact .name {
  font-size: 0.95rem;
}

.profile-card.compact .handle {
  font-size: 0.78rem;
}

.profile-card.compact .role {
  font-size: 0.72rem;
  margin-top: 0.22rem;
}

.profile-card.compact .description {
  margin-top: 0.35rem;
  font-size: 0.85rem;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
