<template>
  <component 
    :is="href.startsWith('http') ? 'a' : 'router-link'"
    :to="href.startsWith('http') ? undefined : href"
    :href="href.startsWith('http') ? href : undefined"
    :target="href.startsWith('http') ? '_blank' : undefined"
    :class="[
      'group block p-6 bg-gh-card border border-gh-border rounded-vp',
      'hover:border-' + color,
      'transition-all duration-300',
      'hover:shadow-vp-shadow-2'
    ]"
  >
    <div class="flex items-center gap-4">
      <!-- 扑克牌花色图标 -->
      <span 
        :class="['text-4xl', 'text-' + color, 'group-hover:scale-110 transition-transform']"
      >
        {{ icon }}
      </span>
      
      <!-- 内容 -->
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gh-text mb-1">{{ title }}</h3>
        <p class="text-sm text-gh-text-muted">{{ description }}</p>
      </div>
      
      <!-- 箭头 -->
      <svg class="w-5 h-5 text-gh-text-muted group-hover:text-vp-c-brand group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </div>
  </component>
</template>

<script setup>
defineProps({
  icon: String,        // ◆ ♠ ♣ ♥
  color: String,       // poker-diamond, poker-spade, poker-club, poker-heart
  title: String,
  description: String,
  href: String,
})
</script>
