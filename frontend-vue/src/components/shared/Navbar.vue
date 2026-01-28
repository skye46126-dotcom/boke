<template>
  <nav class="fixed top-0 left-0 right-0 z-40 px-6 py-4 transition-all duration-300" :class="{ 'bg-gh-bg/80 backdrop-blur-md border-b border-gh-border': isScrolled }">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2 group">
        <div class="w-8 h-8 rounded bg-vp-c-brand flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
          P
        </div>
        <span class="font-bold text-xl tracking-tight hidden sm:block group-hover:text-vp-c-brand transition-colors">PixelBlog</span>
      </router-link>

      <!-- Desktop Nav -->
      <div class="hidden md:flex items-center gap-1 bg-gh-card/50 p-1 rounded-full border border-gh-border backdrop-blur-sm">
        <router-link 
          v-for="item in navItems" 
          :key="item.path" 
          :to="item.path"
          class="px-5 py-2 rounded-full text-sm font-medium transition-all hover:text-white relative"
          :class="isActive(item.path) ? 'bg-vp-c-brand text-white shadow-md' : 'text-gh-text-muted hover:bg-white/5'"
        >
          {{ item.name }}
        </router-link>
      </div>

      <!-- Mobile Menu Button -->
      <button class="md:hidden text-gh-text p-2" @click="isMobileMenuOpen = !isMobileMenuOpen">
        <span class="text-2xl">☰</span>
      </button>
    </div>

    <!-- Mobile Menu -->
    <Transition name="slide-down">
      <div v-if="isMobileMenuOpen" class="absolute top-full left-0 right-0 bg-gh-card border-b border-gh-border p-4 md:hidden flex flex-col gap-2 shadow-2xl">
        <router-link 
          v-for="item in navItems" 
          :key="item.path" 
          :to="item.path"
          class="px-4 py-3 rounded text-sm font-medium transition-colors"
          :class="isActive(item.path) ? 'bg-vp-c-brand/10 text-vp-c-brand border border-vp-c-brand/20' : 'text-gh-text hover:bg-white/5'"
          @click="isMobileMenuOpen = false"
        >
          {{ item.name }}
        </router-link>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Projects (IDE)', path: '/projects' }, // Links to full screen IDE
  { name: 'Changelog', path: '/changelog' },
  { name: 'Guestbook', path: '/guestbook' },
  { name: 'About', path: '/about' }
]

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
