<template>
  <div class="min-h-screen bg-gh-bg text-gh-text text-sm font-sans antialiased">
    <!-- Custom Cursor -->
    <CustomCursor />
    
    <SearchDialog />
    
    <header v-if="!$route.meta.hideHeader" class="pixel-ink-header">
      <div class="header-content">
        <div class="header-logo">
          <img :src="personalInfo.avatar" :alt="personalInfo.name" class="header-avatar" />
          <h1 class="pixel-font">MY PIXEL BLOG</h1>
        </div>
        <nav class="pixel-nav">
          <router-link to="/projects" class="nav-card-small">Projects (IDE)</router-link>
          <router-link to="/gallery" class="nav-card-small">Gallery</router-link>
          <router-link to="/guestbook" class="nav-card-small">Guestbook</router-link>
          <router-link to="/" class="nav-card-small">Home</router-link>
          <router-link to="/about" class="nav-card-small">About</router-link>
        </nav>
      </div>
    </header>
    <main class="main-content">
      <router-view></router-view>
    </main>
    <footer v-if="!$route.meta.hideFooter" class="pixel-ink-footer">
      <p class="pixel-font">&copy; 2024 Pixel Blog. Powered by Vue & Supabase.</p>
    </footer>
    
    <!-- Back to Top Button -->
    <BackToTop />

    <!-- Global Hacker Mode Terminal -->
    <Transition name="terminal-slide">
      <div v-show="isTerminalOpen" class="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/40 backdrop-blur-sm" @click.self="toggleTerminal">
        <div class="w-full max-w-3xl mx-4">
          <Terminal />
        </div>
      </div>
    </Transition>

    <!-- Mobile Gesture Feedback -->
    <TerminalGestureFeedback :active="isGestureActive" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useHead } from '@vueuse/head'
import { useMagicKeys } from '@vueuse/core'
import { personalInfo } from '@/data/portfolio'
import CustomCursor from './components/shared/CustomCursor.vue'
import SearchDialog from './components/shared/SearchDialog.vue'
import BackToTop from './components/shared/BackToTop.vue'
import Terminal from './components/shared/Terminal.vue'
import TerminalGestureFeedback from './components/shared/TerminalGestureFeedback.vue'

// Terminal State
const isTerminalOpen = ref(false)
const isGestureActive = ref(false)

const toggleTerminal = () => {
  isTerminalOpen.value = !isTerminalOpen.value
  if (isTerminalOpen.value) {
    isGestureActive.value = false // Hide feedback when open
  }
}

// Mobile Gesture Logic (Two-finger swipe down)
let touchStartY = 0
let touchStartPoints = 0

const handleTouchStart = (e) => {
  touchStartPoints = e.touches.length
  if (touchStartPoints === 2) {
    touchStartY = (e.touches[0].clientY + e.touches[1].clientY) / 2
    isGestureActive.value = true
  }
}

const handleTouchMove = (e) => {
  if (touchStartPoints === 2 && e.touches.length === 2) {
    const currentY = (e.touches[0].clientY + e.touches[1].clientY) / 2
    const diff = currentY - touchStartY
    
    // If swiping down significantly
    if (diff > 100 && !isTerminalOpen.value) {
      e.preventDefault() // Prevent scrolling
      toggleTerminal()
      touchStartPoints = 0 // Reset to prevent double toggle
    }
  }
}

const handleTouchEnd = () => {
  if (touchStartPoints === 2) {
    setTimeout(() => {
      isGestureActive.value = false
    }, 1000)
  }
  touchStartPoints = 0
}


// Global Keyboard Shortcut (~)
// We use vanilla event listener for the Backquote key to ensure it catches globally
const handleKeydown = (e) => {
  // Check for Backquote (`) or Tilde (~)
  // Also ensure we're not focusing an input (unless it's the search input, but standard behavior usually ignores inputs)
  // But for a global "game" console, sometimes we want it even in inputs. 
  // Let's stick to standard behavior: if not in an input/textarea, OR if ctrl+` is pressed
  // For simplicity: just toggle on ` key if no special modifiers, or maybe requiring Ctrl+` to avoid conflict?
  // User asked for "~" key. KeyCode 192.
  if (e.code === 'Backquote' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
     // Optional: check if active element is input
     if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) && !isTerminalOpen.value) {
       return // Don't interrupt typing
     }
     e.preventDefault()
     toggleTerminal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('touchstart', handleTouchStart, { passive: false })
  window.addEventListener('touchmove', handleTouchMove, { passive: false })
  window.addEventListener('touchend', handleTouchEnd)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('touchstart', handleTouchStart)
  window.removeEventListener('touchmove', handleTouchMove)
  window.removeEventListener('touchend', handleTouchEnd)
})

// Global SEO Configuration
useHead({
  title: 'chenc - Full Stack Developer && Product Manager',
  meta: [
    {
      name: 'description',
      content: '个人技术博客，分享前端开发、Vue.js、TypeScript 等技术经验'
    },
    {
      name: 'keywords',
      content: 'Vue.js, React, TypeScript, Rust, C++, 前端开发, Web开发, 产品管理, 技术博客'
    },
    // Open Graph
    {
      property: 'og:title',
      content: 'chenc - Full Stack Developer && Product Manager'
    },
    {
      property: 'og:description',
      content: '个人技术博客，分享前端开发经验与项目实践'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: 'https://yoursite.com'
    },
    {
      property: 'og:image',
      content: 'https://yoursite.com/og-image.jpg'
    },
    // Twitter Card
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: 'chenc - Full Stack Developer && Product Manager'
    },
    {
      name: 'twitter:description',
      content: '个人技术博客，分享前端开发经验'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://yoursite.com'
    }
  ]
})
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.pixel-ink-header {
  position: relative;
  z-index: 100;
  padding: 1rem 2rem;
  border-bottom: var(--pixel-border-width-thick) solid var(--color-pixel-ink-gray);
  background: var(--color-pixel-ink-paper);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.header-avatar {
  width: 32px;
  height: 32px;
  border: 2px solid var(--color-pixel-ink-gray);
  object-fit: cover;
  image-rendering: pixelated;
}

.pixel-nav {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 4px;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.pixel-nav::-webkit-scrollbar {
  display: none;
}

.nav-card-small {
  padding: 0.4rem 0.8rem;
  white-space: nowrap;
  background: var(--color-pixel-ink-paper);
  border: var(--pixel-border-width-thick) solid var(--color-pixel-ink-gray);
  text-decoration: none;
  color: var(--color-text-primary);
  font-size: 0.75rem;
  transition: all 0.2s;
}

@media (max-width: 768px) {
  .pixel-ink-header {
    padding: 0.75rem 1rem;
  }
  
  .header-content {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .pixel-nav {
    width: 100%;
    justify-content: center;
    padding: 0.25rem 0;
  }
}

.nav-card-small:hover {
  transform: translateY(-2px);
  border-color: var(--color-pixel-ink-ochre);
}

.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 2rem;
}

@media (max-width: 768px) {
  .main-content {
    padding: 0 1rem;
  }
}

.pixel-ink-footer {
  padding: 2rem;
  text-align: center;
  border-top: var(--pixel-border-width-thin) solid var(--color-pixel-ink-gray);
}
</style>

<style>
/* Global Terminal Transitions */
.terminal-slide-enter-active,
.terminal-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.terminal-slide-enter-from,
.terminal-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.98);
}
</style>
