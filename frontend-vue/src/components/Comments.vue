<template>
  <AppSection id="comments" title="Comments">
    <template #title>
      <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageSquare class="w-6 h-6" />
        Comments
      </h2>
    </template>
    
    <div v-if="isValidConfig" class="relative min-h-[300px]">
      <!-- Loading Skeleton for Giscus -->
      <div v-if="loading" class="absolute inset-0 z-10 bg-gh-bg">
        <div class="space-y-4 animate-pulse">
          <div class="h-10 bg-gh-card rounded-md w-full"></div>
          <div class="h-32 bg-gh-card rounded-md w-full"></div>
          <div class="flex gap-4">
             <div class="h-10 bg-gh-card rounded-md w-24"></div>
             <div class="h-10 bg-gh-card rounded-md w-24"></div>
          </div>
        </div>
      </div>

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
        @load="onGiscusLoad"
      />
    </div>
    
    <div v-else class="text-gh-text-muted text-sm italic border border-dashed border-gh-border p-8 rounded-lg text-center bg-gh-card/30">
      <p class="mb-2">💬 Comments are currently in read-only or not configured.</p>
      <p class="text-xs">Please set up Giscus in your .env file to enable discussions.</p>
    </div>
  </AppSection>
</template>

<script setup>
import { ref, computed } from 'vue'
import Giscus from '@giscus/vue'
import { MessageSquare } from 'lucide-vue-next'
import { useDark } from '@vueuse/core'
import AppSection from '@/components/ui/AppSection.vue'

const isDark = useDark()
const loading = ref(true)

const config = {
  repo: import.meta.env.VITE_GISCUS_REPO || 'your-username/your-repo',
  repoId: import.meta.env.VITE_GISCUS_REPO_ID || '',
  category: import.meta.env.VITE_GISCUS_CATEGORY || '',
  categoryId: import.meta.env.VITE_GISCUS_CATEGORY_ID || '',
}

const isValidConfig = computed(() => {
  return config.repo && config.repo !== 'your-username/your-repo' && config.repoId
})

const onGiscusLoad = () => {
  loading.value = false
}
</script>

<style scoped>
/* Ensure Giscus takes full width and respects our theme */
:deep(.giscus),
:deep(.giscus-frame) {
  width: 100% !important;
  border: none !important;
}
</style>
