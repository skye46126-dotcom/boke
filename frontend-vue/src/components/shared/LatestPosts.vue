<template>
  <AppSection id="blog" title="Latest Posts">
    <LoadingState v-if="loading" message="Loading articles..." />
    <ErrorState v-else-if="error" :message="error" />
    
    <div v-else class="posts-grid">
      <BaseCard
        v-for="post in articles"
        :key="post.id"
        variant="border"
        :hover="true"
        :clickable="true"
        class="post-item"
        @click="navigateToPost(post.slug)"
      >
        <div class="p-6">
          <div class="post-date">{{ formatDate(post.date) }} · {{ post.reading_time || '5' }} min read</div>
          <h3 class="post-title">{{ post.title }}</h3>
          <p class="post-excerpt">{{ getExcerpt(post.content) }}</p>
          <div class="read-more">
            Continue Reading →
          </div>
        </div>
      </BaseCard>
    </div>
    
    <router-link to="/articles" class="view-all">
      View All Posts →
    </router-link>
  </AppSection>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useArticles } from '@/composables/useArticles'
import { formatDate, getExcerpt } from '@/lib/utils'
import AppSection from '@/components/ui/AppSection.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
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
.posts-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.post-item {
  width: 100%;
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

.post-item:hover .post-title {
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
