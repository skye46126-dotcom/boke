<template>
  <button
    @click="toggleTheme"
    class="fixed top-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-gh-card border border-gh-border rounded-vp hover:border-vp-c-brand transition-all duration-300 hover:scale-110"
    :title="theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
  >
    <span class="text-xl">{{ theme === 'light' ? '🌙' : '☀️' }}</span>
  </button>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const theme = ref('dark') // 默认深色模式

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

watch(theme, (newTheme) => {
  if (newTheme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('theme', newTheme)
})

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'dark'
  theme.value = savedTheme
})
</script>
