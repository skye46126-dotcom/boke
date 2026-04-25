<template>
  <div class="empty-state">
    <p class="empty-title">{{ title }}</p>
    <p class="empty-description">{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'No data yet',
  },
  description: {
    type: String,
    default: 'There is nothing to display right now.',
  },
})
</script>

<style scoped>
.empty-state {
  padding: 2rem;
  border: 1px dashed var(--color-gh-border);
  border-radius: var(--radius-vp);
  background: rgba(255, 255, 255, 0.02);
  text-align: center;
}

.empty-title {
  color: var(--color-gh-text);
  font-weight: 600;
}

.empty-description {
  color: var(--color-gh-text-muted);
  margin-top: 0.5rem;
}
</style>
