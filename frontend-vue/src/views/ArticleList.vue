<template>
  <div class="min-h-screen bg-gh-bg text-gh-text">
    <!-- Main Content -->
    <div class="container mx-auto px-6 py-12">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">All Articles</h1>
        <p class="text-gh-text-muted">{{ articles.length }} articles published</p>
      </div>

      <!-- Search Trigger -->
      <button
        @click="openSearch"
        class="w-full mb-8 px-4 py-3 bg-gh-card border border-gh-border rounded-lg text-left text-gh-text-muted flex items-center justify-between hover:border-vp-c-brand transition group"
      >
        <span class="flex items-center gap-2 group-hover:text-gh-text transition">
          <Search class="w-4 h-4" />
          Search articles...
        </span>
        <kbd class="hidden sm:inline-block px-2 py-0.5 text-xs bg-gh-bg border border-gh-border rounded text-gh-text-muted font-mono">⌘K</kbd>
      </button>

      <!-- Loading State -->
      <LoadingState v-if="loading" message="Loading articles..." />

      <!-- Error State -->
      <ErrorState v-else-if="error" :message="error" />

      <!-- Articles List (GitHub Issues Style) -->
      <div v-else class="space-y-0 border border-gh-border rounded-vp overflow-hidden">
        <router-link
          v-for="article in articles"
          :key="article.id"
          :to="`/articles/${article.slug}`"
          class="block p-4 border-b border-gh-border last:border-b-0 hover:bg-gh-card transition"
        >
          <div class="flex items-start gap-4">
            <!-- Issue Icon (Green Dot) -->
            <svg class="w-5 h-5 text-vp-c-brand mt-1 shrink-0" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
              <path fill-rule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
            </svg>
            
            <!-- Article Info -->
            <div class="flex-1 min-w-0">
              <h2 class="text-lg font-semibold text-gh-text hover:text-vp-c-brand transition">
                {{ article.title }}
              </h2>
              <p v-if="article.excerpt" class="text-sm text-gh-text-muted mt-1 line-clamp-2">
                {{ article.excerpt }}
              </p>
              
              <!-- Tags and Date -->
              <div class="flex items-center gap-4 mt-3 flex-wrap">
                <div v-if="article.tags && article.tags.length" class="flex gap-2">
                  <span 
                    v-for="tag in article.tags" 
                    :key="tag"
                    class="px-2 py-1 text-xs bg-gh-bg border border-gh-border rounded-full text-gh-text-muted hover:border-vp-c-brand transition"
                  >
                    {{ tag }}
                  </span>
                </div>
                <span class="text-xs text-gh-text-muted flex items-center gap-1">
                  <Eye class="w-3 h-3 text-gh-text-muted" />
                  {{ article.views || 0 }} views
                </span>
                <span class="text-xs text-gh-text-muted">
                  Updated {{ formatRelativeDate(article.date) }}
                </span>
              </div>
            </div>

            <!-- Arrow Icon -->
            <svg class="w-5 h-5 text-gh-text-muted shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useArticles } from '@/composables/useArticles'
import { formatRelativeDate } from '@/lib/utils'
import { Search, Eye } from 'lucide-vue-next'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

// Fetch all published articles
const { articles, loading, error } = useArticles({
  status: 'published',
  orderBy: 'date',
  ascending: false
})

const openSearch = () => {
  const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true })
  window.dispatchEvent(event)
}
</script>
