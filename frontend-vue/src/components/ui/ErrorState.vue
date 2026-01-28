<template>
  <div class="p-8 border border-red-500/30 bg-red-500/10 rounded-vp text-center">
    <p class="text-red-400 mb-2 font-bold">⚠️ Error</p>
    <p class="text-gh-text-muted text-sm">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Something went wrong.'
  }
})
</script>
