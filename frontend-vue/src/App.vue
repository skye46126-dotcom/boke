<template>
  <div class="min-h-screen bg-gh-bg text-gh-text text-sm font-sans antialiased">
    <!-- Custom Cursor -->
    <CustomCursor />
    
    <SearchDialog />
    
    <header v-if="!$route.meta.hideHeader" class="pixel-ink-header">
      <div class="header-content">
        <h1 class="pixel-font">MY PIXEL BLOG</h1>
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
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useHead } from '@vueuse/head'
import { useMagicKeys } from '@vueuse/core'
import CustomCursor from './components/shared/CustomCursor.vue'
import SearchDialog from './components/shared/SearchDialog.vue'
import BackToTop from './components/shared/BackToTop.vue'
import Terminal from './components/shared/Terminal.vue'

// Terminal State
const isTerminalOpen = ref(false)

const toggleTerminal = () => {
  isTerminalOpen.value = !isTerminalOpen.value
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
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
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
  padding: 2rem;
  border-bottom: var(--pixel-border-width-thick) solid var(--color-pixel-ink-gray);
  margin-bottom: 2rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pixel-nav {
  display: flex;
  gap: 1rem;
}

.nav-card-small {
  padding: 0.5rem 1rem;
  background: var(--color-pixel-ink-paper);
  border: var(--pixel-border-width-thick) solid var(--color-pixel-ink-gray);
  text-decoration: none;
  color: var(--color-text-primary);
  font-size: 0.8rem;
  transition: all 0.2s;
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
