<template>
  <div class="profile-card">
    <img :src="agent.avatar_url || '/images/avatar.jpg'" :alt="agent.name" class="avatar" />
    <div>
      <p class="name">{{ agent.name }}</p>
      <p class="role">{{ agent.role }}</p>
      <p v-if="agent.description" class="description">{{ agent.description }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  agent: {
    type: Object,
    required: true,
  },
})
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

.avatar {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 16px;
  border: 1px solid var(--color-gh-border);
}

.name {
  font-weight: 600;
  color: var(--color-gh-text);
}

.role {
  color: var(--color-vp-c-brand);
  font-size: 0.85rem;
  margin-top: 0.125rem;
}

.description {
  color: var(--color-gh-text-muted);
  margin-top: 0.5rem;
  line-height: 1.6;
  font-size: 0.95rem;
}
</style>
