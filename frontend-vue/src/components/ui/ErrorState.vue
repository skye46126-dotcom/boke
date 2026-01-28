<template>
  <div class="error-state">
    <svg 
      class="error-icon" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
    <p class="error-message">{{ message }}</p>
    <button v-if="retry" @click="$emit('retry')" class="retry-button">
      Try Again
    </button>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Something went wrong'
  },
  retry: {
    type: Boolean,
    default: false
  }
})

defineEmits(['retry'])
</script>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
}

.error-icon {
  width: 48px;
  height: 48px;
  color: #f87171;
  stroke-width: 2;
  margin-bottom: 1rem;
}

.error-message {
  color: var(--color-gh-text-muted);
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.retry-button {
  padding: 0.5rem 1rem;
  background: var(--color-gh-card);
  border: 1px solid var(--color-gh-border);
  border-radius: var(--border-radius-vp);
  color: var(--color-vp-c-brand);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-button:hover {
  background: var(--color-vp-c-brand);
  color: var(--color-gh-bg);
  border-color: var(--color-vp-c-brand);
}
</style>
