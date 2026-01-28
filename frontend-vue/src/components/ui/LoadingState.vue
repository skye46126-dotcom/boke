<template>
  <div class="flex flex-col items-center justify-center p-12 text-center">
    <div class="w-10 h-10 border-4 border-gh-border border-t-vp-c-brand rounded-full animate-spin mb-4"></div>
    <p class="text-gh-text-muted animate-pulse">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Loading...'
  }
})
</script>
