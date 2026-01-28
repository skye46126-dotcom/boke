<template>
  <div v-if="loading" class="text-center py-12 text-gh-text-muted">
    Loading the wall...
  </div>
  
  <div v-else-if="entries.length === 0" class="text-center py-20 border border-dashed border-gh-border rounded-xl">
    <p class="text-xl mb-4">No signatures yet.</p>
    <p class="text-gh-text-muted">Be the first to sign!</p>
  </div>

  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <GuestbookEntry
      v-for="entry in entries"
      :key="entry.id"
      :entry="entry"
    />
  </div>
</template>

<script setup>
import GuestbookEntry from './GuestbookEntry.vue'

defineProps({
  entries: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>
