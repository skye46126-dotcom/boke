<template>
  <aside class="sidebar">
    <div class="sidebar-content">
      <!-- Personal Info -->
      <div class="personal-info">
        <h1 class="name">{{ personalInfo.name }}</h1>
        <h2 class="title">{{ personalInfo.title }}</h2>
        <p class="tagline">{{ personalInfo.tagline }}</p>
      </div>
      
      <!-- Navigation Menu -->
      <nav class="nav-menu">
        <a
          v-for="item in navItems"
          :key="item.id"
          :href="`#${item.id}`"
          :class="['nav-item', { active: activeSection === item.id }]"
          @click.prevent="scrollToSection(item.id)"
        >
          {{ item.label }}
        </a>
      </nav>
      
      <!-- Social Links -->
      <div class="social-links">
        <a
          v-for="link in socialLinks"
          :key="link.name"
          :href="link.url"
          target="_blank"
          :aria-label="link.ariaLabel"
          class="social-link"
        >
          <component :is="getSocialIcon(link.icon)" />
        </a>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { personalInfo, socialLinks, navItems } from '@/data/portfolio'
import { h } from 'vue'

defineProps({
  activeSection: {
    type: String,
    default: 'about'
  }
})

const scrollToSection = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Simple icon components (using render functions to avoid runtime compilation)
const getSocialIcon = (name) => {
  const icons = {
    github: {
      render: () => h('svg', { viewBox: '0 0 24 24', width: '20', height: '20', fill: 'currentColor' }, [
        h('path', { d: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' })
      ])
    },
    twitter: {
      render: () => h('svg', { viewBox: '0 0 24 24', width: '20', height: '20', fill: 'currentColor' }, [
        h('path', { d: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' })
      ])
    },
    linkedin: {
      render: () => h('svg', { viewBox: '0 0 24 24', width: '20', height: '20', fill: 'currentColor' }, [
        h('path', { d: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z' }),
        h('circle', { cx: '4', cy: '4', r: '2' })
      ])
    },
    email: {
      render: () => h('svg', { viewBox: '0 0 24 24', width: '20', height: '20', fill: 'currentColor' }, [
        h('path', { d: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' }),
        h('polyline', { points: '22,6 12,13 2,6' })
      ])
    }
  }
  return icons[name] || icons.github
}
</script>

<style scoped>
.sidebar {
  width: 40%;
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 3rem;
  overflow: hidden;
}

.sidebar-content {
  max-width: 400px;
  width: 100%;
}

.personal-info {
  margin-bottom: 3rem;
}

.name {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--color-gh-text);
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-vp-c-brand);
  margin-bottom: 1rem;
}

.tagline {
  font-size: 1.125rem;
  color: var(--color-gh-text-muted);
  line-height: 1.6;
}

/* Navigation Menu */
.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 3rem;
}

.nav-item {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-gh-text-muted);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.5rem 0;
  border-left: 2px solid transparent;
  padding-left: 1rem;
  transition: all 0.3s ease;
}

.nav-item:hover {
  color: var(--color-vp-c-brand);
  border-left-color: var(--color-vp-c-brand);
}

.nav-item.active {
  color: var(--color-vp-c-brand);
  border-left-color: var(--color-vp-c-brand);
  font-weight: 700;
}

/* Social Links */
.social-links {
  display: flex;
  gap: 1.5rem;
}

.social-link {
  color: var(--color-gh-text-muted);
  transition: color 0.3s ease, transform 0.3s ease;
  display: inline-flex;
}

.social-link:hover {
  color: var(--color-vp-c-brand);
  transform: translateY(-2px);
}

/* Mobile Responsive */
@media (max-width: 1023px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
    padding: 3rem 2rem;
  }
  
  .name {
    font-size: 2.5rem;
  }
  
  .title {
    font-size: 1.25rem;
  }
}
</style>
