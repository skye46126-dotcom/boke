<template>
  <section id="blog" class="content-section">
    <h2 class="section-title">Latest Posts</h2>
    
    <LoadingState v-if="loading" message="Loading articles..." />
    <ErrorState v-else-if="error" :message="error" />
    
    <div v-else class="posts-grid">
      <article
        v-for="post in articles"
        :key="post.id"
        class="post-card"
        @click="navigateToPost(post.slug)"
      >
        <div class="post-date">{{ formatDate(post.date) }} · {{ post.reading_time || '5' }} min read</div>
        <h3 class="post-title">{{ post.title }}</h3>
        <p class="post-excerpt">{{ getExcerpt(post.content) }}</p>
        <div class="read-more">
          Continue Reading →
        </div>
      </article>
    </div>
    
    <router-link to="/articles" class="view-all">
      View All Posts →
    </router-link>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useArticles } from '@/composables/useArticles'
import { formatDate, getExcerpt } from '@/lib/utils'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const router = useRouter()

// Use composable to fetch latest 3 articles
const { articles, loading, error } = useArticles({
  limit: 3,
  orderBy: 'date',
  ascending: false
})

const navigateToPost = (slug) => {
  router.push(`/articles/${slug}`)
}
</script>

<style scoped>
.content-section {
  margin-bottom: 6rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--color-gh-text);
}

.posts-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.post-card {
  padding: 1.5rem;
  border-radius: var(--border-radius-vp);
  border: 1px solid var(--color-gh-border);
  background: var(--color-gh-card);
  transition: all 0.3s ease;
  cursor: pointer;
}

.post-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--color-vp-c-brand);
  box-shadow: 0 8px 24px rgba(0, 220, 130, 0.2);
}

.post-date {
  font-size: 0.875rem;
  color: var(--color-gh-text-muted);
  margin-bottom: 0.5rem;
}

.post-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: var(--color-gh-text);
  transition: color 0.3s ease;
}

.post-card:hover .post-title {
  color: var(--color-vp-c-brand);
}

.post-excerpt {
  color: var(--color-gh-text-muted);
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.read-more {
  color: var(--color-vp-c-brand);
  font-size: 0.875rem;
  font-weight: 600;
}

.view-all {
  display: inline-block;
  color: var(--color-vp-c-brand);
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.3s ease;
}

.view-all:hover {
  transform: translateX(4px);
}
</style>
