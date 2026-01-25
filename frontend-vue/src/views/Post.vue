<template>
  <div class="post-detail-page">
    <div v-if="loading" class="pixel-font loading">Loading Article...</div>
    <div v-else-if="error" class="pixel-font error">{{ error }}</div>
    <div v-else class="article-layout">
      <aside class="article-sidebar">
        <router-link to="/" class="pixel-button back-btn">← Back</router-link>
        <div class="pixel-mini-card">
          <h4>Article Info</h4>
          <p class="meta-date">{{ new Date(article.date).toLocaleDateString() }}</p>
          <div v-if="article.tags" class="tags">
            <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </aside>

      <main class="article-main">
        <article class="article-container">
          <header class="article-header">
            <h1 class="article-title">{{ article.title }}</h1>
          </header>
          <div class="article-content typography-longform" v-html="article.content"></div>
        </article>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabase'

const route = useRoute()
const article = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  const slug = route.params.slug
  try {
    const { data, error: fetchError } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single()

    if (fetchError) throw fetchError
    article.value = data
  } catch (err) {
    console.error('Error fetching article:', err)
    error.value = 'Article not found.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.article-sidebar {
  padding: 1rem;
}

.back-btn {
  display: block;
  margin-bottom: 2rem;
  text-align: center;
  text-decoration: none;
}

.pixel-mini-card {
  background: var(--color-pixel-card-bg);
  border: 1px solid var(--color-pixel-border);
  padding: 1rem;
  font-size: 0.8rem;
}

.article-main {
  padding: 0 2rem;
}

.article-header {
  margin-bottom: 3rem;
  text-align: center;
}

.article-title {
  font-size: 2.5rem;
  color: var(--color-pixel-ink-stone-blue);
}

.article-content {
  background: white;
  padding: 2rem;
  border: var(--pixel-border-width-thick) solid var(--color-pixel-ink-gray);
  box-shadow: var(--pixel-shadow-offset) var(--pixel-shadow-offset) 0 var(--color-pixel-ink-gray);
}
</style>
