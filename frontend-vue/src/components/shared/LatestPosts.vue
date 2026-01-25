<template>
  <div class="latest-posts">
    <h2 class="section-title">Latest Posts</h2>
    
    <div v-if="loading" class="loading">Loading articles...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else class="posts-grid">
      <article
        v-for="post in posts"
        :key="post.id"
        class="post-card"
        @click="navigateToPost(post.slug)"
      >
        <div class="post-date">{{ formatDate(post.created_at) }} · {{ post.reading_time || '5' }} min read</div>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const posts = ref([])
const loading = ref(true)
const error = ref(null)

const fetchLatestPosts = async () => {
  try {
    const { data, error: fetchError } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3)
    
    if (fetchError) throw fetchError
    posts.value = data || []
  } catch (err) {
    console.error('Error fetching posts:', err)
    error.value = 'Failed to load posts'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getExcerpt = (content) => {
  if (!content) return ''
  const text = content.replace(/<[^>]*>/g, '').slice(0, 150)
  return text + (content.length > 150 ? '...' : '')
}

const navigateToPost = (slug) => {
  router.push(`/articles/${slug}`)
}

onMounted(() => {
  fetchLatestPosts()
})
</script>

<style scoped>
.latest-posts {
  margin-bottom: 6rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--color-gh-text);
}

.loading,
.error {
  color: var(--color-gh-text-muted);
  text-align: center;
  padding: 2rem;
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
