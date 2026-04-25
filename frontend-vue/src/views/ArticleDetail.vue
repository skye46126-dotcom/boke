<template>
  <div class="min-h-screen bg-gh-bg text-gh-text">
    <ReadingProgress />
    <!-- Loading State -->
    <div v-if="loading" class="container mx-auto px-6 py-12">
      <p class="text-gh-text-muted">Loading article...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-6 py-12">
      <p class="text-gh-text-muted">{{ error }}</p>
      <router-link to="/articles" class="text-vp-c-brand hover:underline mt-4 inline-block">
        ← Back to Articles
      </router-link>
    </div>

    <!-- Article Content -->
    <div v-else class="container mx-auto px-6 py-12">
      <div class="grid grid-cols-12 gap-8">
        <!-- Sidebar (Table of Contents) -->
        <aside class="col-span-3 sticky top-20 h-fit hidden lg:block">
          <router-link 
            to="/articles" 
            class="text-vp-c-brand hover:text-vp-c-brand-light mb-6 block text-sm"
          >
            ← Back to Articles
          </router-link>
          
          <!-- Table of Contents -->
          <TableOfContents v-if="tableOfContents.length" :headings="tableOfContents" />
        </aside>

        <!-- Main Content -->
        <main class="col-span-12 lg:col-span-9">
          <article class="max-w-3xl">
            <!-- Article Header -->
            <header class="mb-8 pb-8 border-b border-gh-border">
              <h1 class="text-4xl font-bold mb-4">{{ article.title }}</h1>
              <div class="flex items-center gap-4 text-sm text-gh-text-muted flex-wrap">
                <span>{{ new Date(article.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) }}</span>
                <span>•</span>
                <span class="flex items-center gap-1">
                  <Eye class="w-4 h-4" />
                  {{ article.views || 0 }} views
                </span>
                <span v-if="article.tags && article.tags.length">•</span>
                <div v-if="article.tags && article.tags.length" class="flex gap-2">
                  <span 
                    v-for="tag in article.tags" 
                    :key="tag" 
                    class="px-2 py-1 bg-gh-card border border-gh-border rounded text-vp-c-brand text-xs"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </header>

            <!-- Article Body (Markdown Content) -->
            <div v-html="article.content" class="prose prose-invert max-w-none vp-doc"></div>
          </article>

          <!-- Comments -->
          <Comments />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { extractTableOfContents, addHeadingIds } from '@/lib/utils'
import ReadingProgress from '../components/ReadingProgress.vue'
import TableOfContents from '../components/TableOfContents.vue'
import Comments from '../components/Comments.vue'
import { Eye } from 'lucide-vue-next'
import { processCodeBlocks } from '../lib/shiki'
import { useArticleDetail } from '@/composables/useArticleDetail'

const route = useRoute()
const slugRef = ref(route.params.slug)
const { article, loading, error } = useArticleDetail(slugRef)
const tableOfContents = ref([])

const fetchArticle = async () => {
  if (!article.value?.content) {
    return
  }

  const highlightedContent = await processCodeBlocks(article.value.content)
  article.value = { ...article.value, content: highlightedContent }
  tableOfContents.value = extractTableOfContents(highlightedContent)

  if (typeof document !== 'undefined') {
    setTimeout(() => {
      addHeadingIds('.vp-doc', tableOfContents.value)
    }, 100)
  }
}

watch(() => route.params.slug, (slug) => {
  slugRef.value = slug
})

watch(() => article.value?.id, () => {
  fetchArticle()
}, { immediate: true })
</script>

<style>
/* VitePress-style article content */
.vp-doc {
  color: var(--color-gh-text);
  line-height: 1.7;
}

.vp-doc h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-top: 3rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-gh-border);
  color: var(--color-gh-text);
}

.vp-doc h3 {
  font-size: 1.375rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  color: var(--color-gh-text);
}

.vp-doc p {
  margin-bottom: 1rem;
  color: var(--color-gh-text-muted);
}

.vp-doc a {
  color: var(--color-vp-c-brand);
  text-decoration: none;
  transition: color 0.2s;
}

.vp-doc a:hover {
  color: var(--color-vp-c-brand-light);
  text-decoration: underline;
}

.vp-doc code {
  font-family: var(--font-family-mono);
  font-size: 0.875rem;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  background: var(--color-gh-card);
  color: var(--color-vp-c-brand);
}

.vp-doc pre {
  font-family: var(--font-family-mono);
  font-size: 0.875rem;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
  border: 1px solid var(--color-gh-border);
  background: #0d1117 !important; /* Shiki background */
}

/* Shiki-specific styles */
.vp-doc pre.shiki,
.vp-doc pre.shiki code {
  background: transparent !important;
  padding: 0;
}

.vp-doc pre.shiki code {
  color: inherit;
  display: block;
}

.vp-doc pre code {
  padding: 0;
  background: transparent;
  color: var(--color-gh-text);
}

.vp-doc ul,
.vp-doc ol {
  margin: 1rem 0;
  padding-left: 1.5rem;
  color: var(--color-gh-text-muted);
}

.vp-doc li {
  margin: 0.5rem 0;
}

.vp-doc blockquote {
  margin: 1rem 0;
  padding-left: 1rem;
  border-left: 4px solid var(--color-vp-c-brand);
  color: var(--color-gh-text-muted);
  font-style: italic;
}

.vp-doc img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
}

.vp-doc table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

.vp-doc th,
.vp-doc td {
  padding: 0.75rem;
  border: 1px solid var(--color-gh-border);
  text-align: left;
}

.vp-doc th {
  background: var(--color-gh-card);
  font-weight: 600;
  color: var(--color-gh-text);
}

.vp-doc td {
  color: var(--color-gh-text-muted);
}
</style>
