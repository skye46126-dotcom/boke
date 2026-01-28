<template>
  <div class="max-w-3xl mx-auto px-6 py-12 relative">
    <MouseSpotlight />
    <!-- Header -->
    <header class="mb-12 text-center relative z-10">
      <h1 class="text-4xl font-bold mb-4">{{ personalInfo.name }}</h1>
      <p class="text-xl text-gh-text-muted">{{ personalInfo.title }}</p>
    </header>

    <!-- Content -->
    <div class="prose max-w-none text-gh-text space-y-8 leading-relaxed relative z-10">
      <section>
        <h2 class="text-2xl font-semibold mb-4 border-b border-gh-border pb-2">About Me</h2>
        <p>
          Hello! I'm {{ personalInfo.name }}, a passionate developer based in the internet.
          I specialize in building high-quality websites and applications with modern technologies like Vue, React, and Node.js.
        </p>
        <p class="mt-4">
          {{ personalInfo.tagline }}
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-4 border-b border-gh-border pb-2">Skills</h2>
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="skill in skills" 
            :key="skill"
            class="px-3 py-1 bg-gh-card border border-gh-border rounded-full text-sm hover:border-vp-c-brand transition-colors cursor-default"
          >
            {{ skill }}
          </span>
        </div>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-4 border-b border-gh-border pb-2">Connect</h2>
        <p>
          Feel free to reach out to me via email at 
          <a :href="`mailto:${personalInfo.email}`" class="text-vp-c-brand hover:underline">{{ personalInfo.email }}</a>
          or find me on social media:
        </p>
        <div class="flex gap-4 mt-4">
          <a
            v-for="link in socialLinks"
            :key="link.name"
            :href="link.url"
            target="_blank"
            class="flex items-center gap-2 px-4 py-2 bg-gh-card border border-gh-border rounded-vp hover:border-vp-c-brand transition"
          >
            <component :is="getIcon(link.icon)" class="w-5 h-5" />
            <span>{{ link.name }}</span>
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { personalInfo, skills, socialLinks } from '@/data/portfolio'
import { h } from 'vue'
import MouseSpotlight from '@/components/shared/MouseSpotlight.vue'

// Reusing the icon logic or importing components
// For simplicity in this view, redefining a simple helper or we could duplicate the Sidebar logic
// But to keep it DRY, ideally we'd have a shared Icon component. 
// For now, I'll use a simple inline helper similar to Sidebar but local to this file.

const getIcon = (name) => {
  const icons = {
    github: {
      render: () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
        h('path', { d: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' })
      ])
    },
    twitter: {
      render: () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
        h('path', { d: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' })
      ])
    },
    linkedin: {
      render: () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
        h('path', { d: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z' }),
        h('circle', { cx: '4', cy: '4', r: '2' })
      ])
    },
    email: {
      render: () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
        h('path', { d: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' }),
        h('polyline', { points: '22,6 12,13 2,6' })
      ])
    }
  }
  return icons[name] || icons.github
}
</script>
