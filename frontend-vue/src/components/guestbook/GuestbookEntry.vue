<template>
  <BaseCard variant="border" class="guestbook-entry-card" :hover="true">
    <div class="flex gap-4 p-4">
      <!-- Pixel Art Display -->
      <div class="shrink-0">
        <img 
          :src="entry.image_url" 
          :alt="entry.nickname + '\'s art'"
          class="w-20 h-20 rounded border border-gh-border shadow-sm image-pixelated" 
        />
      </div>
      
      <!-- Message -->
      <div class="flex flex-col justify-between min-w-0 flex-1">
        <div>
          <p class="text-sm font-bold text-gh-text truncate">{{ entry.nickname }}</p>
          <p class="text-xs text-gh-text-muted mt-0.5">{{ formatDate(entry.created_at) }}</p>
        </div>
        <p class="text-sm text-gh-text mt-2 break-all line-clamp-3">"{{ entry.message }}"</p>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from '@/components/ui/BaseCard.vue'

defineProps({
  entry: {
    type: Object,
    required: true
  }
})

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.image-pixelated {
  image-rendering: pixelated;
}
</style>
