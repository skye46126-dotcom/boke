<template>
  <div class="min-h-screen bg-gh-bg text-gh-text text-sm font-sans antialiased">
    <!-- Custom Cursor -->
    <CustomCursor />
    
    <SearchDialog />
    
    <header class="pixel-ink-header">
      <div class="header-content">
        <h1 class="pixel-font">MY PIXEL BLOG</h1>
        <nav class="pixel-nav">
          <router-link to="/" class="nav-card-small">Home</router-link>
          <router-link to="/about" class="nav-card-small">About</router-link>
        </nav>
      </div>
    </header>
    <main class="main-content">
      <router-view></router-view>
    </main>
    <footer class="pixel-ink-footer">
      <p class="pixel-font">&copy; 2024 Pixel Blog. Powered by Vue & Supabase.</p>
    </footer>
    
    <!-- Back to Top Button -->
    <BackToTop />
  </div>
</template>

<script setup>
import { useHead } from '@vueuse/head'
import CustomCursor from './components/shared/CustomCursor.vue'
import SearchDialog from './components/shared/SearchDialog.vue'
import BackToTop from './components/shared/BackToTop.vue'

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
