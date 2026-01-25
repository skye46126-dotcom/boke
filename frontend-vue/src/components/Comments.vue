<template>
  <div class="comments-section mt-16 pt-8 border-t border-gh-border">
    <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
      <MessageSquare class="w-6 h-6" />
      Comments
    </h2>
    
    <Giscus
      :repo="config.repo"
      :repo-id="config.repoId"
      :category="config.category"
      :category-id="config.categoryId"
      mapping="pathname"
      :strict="0"
      :reactions-enabled="1"
      :emit-metadata="0"
      input-position="top"
      :theme="isDark ? 'dark' : 'light'"
      lang="en"
      loading="lazy"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Giscus from '@giscus/vue'
import { MessageSquare } from 'lucide-vue-next'
import { useDark } from '@vueuse/core'

const isDark = useDark()

// TODO: Replace with your actual Giscus configuration
const config = {
  repo: 'your-username/your-repo',
  repoId: 'R_kgDOxxxxxx',
  category: 'Announcements',
  categoryId: 'DIC_kwDOxxxxxx',
}
</script>

<style>
/* Giscus 主题自定义 */
.giscus {
  @apply w-full;
}

</style>
