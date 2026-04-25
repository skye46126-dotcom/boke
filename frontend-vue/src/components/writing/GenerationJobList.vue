<template>
  <div class="job-list">
    <BaseCard
      v-for="job in jobs"
      :key="job.id"
      variant="border"
      class="job-card"
    >
      <div class="job-top">
        <div>
          <p class="muted">{{ job.source_type || 'manual_prompt' }}</p>
          <h3>{{ job.prompt || 'No prompt recorded' }}</h3>
        </div>
        <span class="status" :class="`status-${job.status}`">{{ job.status }}</span>
      </div>
      <p class="muted small">
        {{ new Date(job.created_at).toLocaleString('zh-CN') }}
      </p>
      <p v-if="job.error_message" class="error">{{ job.error_message }}</p>
      <button
        v-if="job.status === 'failed' || job.status === 'pending'"
        type="button"
        class="retry-button"
        :disabled="retryingJobId === job.id"
        @click="$emit('retry', job.id)"
      >
        {{ retryingJobId === job.id ? 'Retrying...' : 'Retry Job' }}
      </button>
    </BaseCard>
  </div>
</template>

<script setup>
import BaseCard from '@/components/ui/BaseCard.vue'

defineProps({
  jobs: {
    type: Array,
    default: () => [],
  },
  retryingJobId: {
    type: String,
    default: null,
  },
})

defineEmits(['retry'])
</script>

<style scoped>
.job-list {
  display: grid;
  gap: 0.75rem;
}

.job-card {
  padding: 1rem;
}

.job-top {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

h3 {
  color: var(--color-gh-text);
  margin-top: 0.25rem;
  line-height: 1.5;
}

.muted {
  color: var(--color-gh-text-muted);
}

.small {
  margin-top: 0.5rem;
  font-size: 0.85rem;
}

.status {
  align-self: flex-start;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  border: 1px solid var(--color-gh-border);
  font-size: 0.8rem;
}

.status-completed {
  color: var(--color-vp-c-brand);
}

.status-failed {
  color: #ff9494;
}

.status-pending {
  color: #f4c36a;
}

.error {
  margin-top: 0.65rem;
  color: #ff9494;
}

.retry-button {
  margin-top: 0.75rem;
  padding: 0.6rem 0.8rem;
  border-radius: 12px;
  border: 1px solid var(--color-gh-border);
  color: var(--color-gh-text);
}
</style>
