<template>
  <div class="fixed top-0 left-0 right-0 h-0.5 bg-gh-border z-50">
    <div
      :style="{ width: `${progress}%` }"
      class="h-full bg-gradient-to-r from-vp-c-brand via-vp-c-brand-light to-poker-club transition-all duration-150"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useThrottleFn } from '@vueuse/core'

const progress = ref(0)

const updateProgress = useThrottleFn(() => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  progress.value = Math.min((scrollTop / docHeight) * 100, 100)
}, 100)

onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true })
  updateProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})
</script>
