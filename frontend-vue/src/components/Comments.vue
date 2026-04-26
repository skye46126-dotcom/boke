<template>
  <AppSection id="comments" title="Comments">
    <template #title>
      <div class="comments-region">
        <h2 class="comments-title">
          <MessageSquare class="comments-title-icon text-vp-c-brand" />
          Comments ({{ comments.length }})
        </h2>
      </div>
    </template>

    <div class="comments-region">
      <div class="comments-shell">
      <!-- Comment Form -->
      <div class="comments-card">
        <div class="form-top">
          <div class="field-block alias-field">
            <label class="block text-xs font-mono text-gh-text-muted mb-2 uppercase tracking-widest">
              $ whoami
            </label>
            <input 
              v-model="nickname"
              type="text" 
              placeholder="Your Alias..."
              class="comment-input"
            />
          </div>

          <div class="submit-block">
            <span class="submit-label">ready</span>
            <button 
              @click="submitComment"
              :disabled="submitting || !newComment.trim() || !nickname.trim()"
              class="comment-submit"
            >
              <Send class="w-4 h-4" v-if="!submitting" />
              <Loader2 class="w-4 h-4 animate-spin" v-else />
              {{ submitting ? 'Submitting...' : 'Post Comment' }}
            </button>
          </div>
        </div>
        
        <div class="field-block editor-field">
          <label class="block text-xs font-mono text-gh-text-muted mb-2 uppercase tracking-widest">
            $ echo "comment"
          </label>
          <textarea 
            v-model="newComment"
            rows="4" 
            placeholder="Write a comment..."
            class="comment-textarea"
          ></textarea>
        </div>
      </div>

      <!-- Comments List -->
      <div v-if="loading" class="loading-list">
        <div v-for="i in 3" :key="i" class="animate-pulse loading-item">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-gh-card rounded-full"></div>
            <div class="h-4 bg-gh-card rounded w-24"></div>
          </div>
          <div class="h-16 bg-gh-card rounded w-full"></div>
        </div>
      </div>

      <div v-else-if="comments.length === 0" class="comments-empty">
        <p class="text-gh-text-muted italic">No comments yet. Be the first to share your thoughts!</p>
      </div>

      <div v-else class="comments-list">
        <div 
          v-for="comment in comments" 
          :key="comment.id" 
          class="comment-item"
        >
          <div class="comment-meta">
            <span class="comment-author">{{ comment.author }}</span>
            <span class="comment-date">
              {{ formatDate(comment.created_at) }}
            </span>
          </div>
          <p class="comment-content">{{ comment.content }}</p>
        </div>
      </div>
    </div>
    </div>
  </AppSection>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { MessageSquare, Send, Loader2 } from 'lucide-vue-next'
import AppSection from '@/components/ui/AppSection.vue'

const route = useRoute()
const comments = ref([])
const loading = ref(true)
const submitting = ref(false)

const nickname = ref(localStorage.getItem('comment_nickname') || '')
const newComment = ref('')

// Fetch comments for the current article
const fetchComments = async () => {
  if (!supabase) return
  
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('article_comments')
      .select('*')
      .eq('article_slug', route.params.slug)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    comments.value = data || []
  } catch (err) {
    console.error('Error fetching comments:', err)
  } finally {
    loading.value = false
  }
}

// Submit a new comment
const submitComment = async () => {
  if (!supabase || !newComment.value.trim() || !nickname.value.trim()) return

  submitting.value = true
  try {
    const { error } = await supabase
      .from('article_comments')
      .insert({
        article_slug: route.params.slug,
        author: nickname.value,
        content: newComment.value
      })

    if (error) throw error
    
    // Save nickname for next time
    localStorage.setItem('comment_nickname', nickname.value)
    
    // Clear and refresh
    newComment.value = ''
    await fetchComments()
  } catch (err) {
    console.error('Error submitting comment:', err)
    alert('Failed to post comment. Make sure the table exists in Supabase!')
  } finally {
    submitting.value = false
  }
}

// Format date nicely
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Real-time subscription
let subscription = null
const subscribeToComments = () => {
  if (!supabase) return

  subscription = supabase
    .channel('comment-updates')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'article_comments', filter: `article_slug=eq.${route.params.slug}` },
      (payload) => {
        comments.value.unshift(payload.new)
      }
    )
    .subscribe()
}

onMounted(() => {
  fetchComments()
  subscribeToComments()
})

onUnmounted(() => {
  if (subscription) subscription.unsubscribe()
})
</script>

<style scoped>
.comments-region {
  width: min(100%, 42rem);
  margin-right: auto;
}

.comments-shell {
  display: grid;
  gap: 1.25rem;
}

.comments-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 700;
}

.comments-title-icon {
  width: 1.3rem;
  height: 1.3rem;
}

.comments-card {
  background: var(--color-gh-card);
  border: 1px solid var(--color-gh-border);
  border-radius: 1rem;
  padding: 0.95rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.form-top {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.9rem;
  align-items: end;
}

.field-block {
  margin-bottom: 0.85rem;
}

.alias-field {
  margin-bottom: 0;
}

.submit-block {
  display: grid;
  gap: 0.35rem;
  justify-items: end;
  min-width: 9.5rem;
  margin-bottom: 0.85rem;
}

.submit-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-gh-text-muted);
  font-family: var(--font-family-mono);
}

.comment-input,
.comment-textarea {
  width: 100%;
  background: var(--color-gh-bg);
  border: 1px solid var(--color-gh-border);
  border-radius: 0.55rem;
  padding: 0.75rem 0.9rem;
  color: var(--color-gh-text);
  outline: none;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.comment-textarea {
  resize: none;
  line-height: 1.65;
  min-height: 8rem;
}

.comment-input:focus,
.comment-textarea:focus {
  border-color: var(--color-vp-c-brand);
}

.comment-submit {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  justify-content: center;
  width: 100%;
  padding: 0.78rem 1rem;
  background: var(--color-vp-c-brand);
  color: #04130b;
  font-weight: 700;
  border-radius: 0.6rem;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.comment-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-list,
.comments-list {
  display: grid;
  gap: 1rem;
}

.loading-item {
  display: grid;
  gap: 0.7rem;
}

.comments-empty {
  text-align: center;
  padding: 2rem 1rem;
  border: 1px dashed var(--color-gh-border);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.03);
}

.comment-item {
  position: relative;
  padding-left: 1rem;
  border-left: 2px solid var(--color-gh-border);
  transition: border-color 0.2s ease;
}

.comment-item:hover {
  border-left-color: var(--color-vp-c-brand);
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 0.35rem;
  flex-wrap: wrap;
}

.comment-author {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-vp-c-brand);
  font-family: var(--font-family-mono);
}

.comment-date {
  font-size: 0.65rem;
  color: var(--color-gh-text-muted);
  text-transform: uppercase;
  font-family: var(--font-family-mono);
}

.comment-content {
  color: var(--color-gh-text);
  line-height: 1.65;
  font-size: 0.9rem;
  white-space: pre-wrap;
}

input, textarea {
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .comments-shell {
    width: 100%;
  }

  .comments-region {
    width: 100%;
  }

  .comments-title {
    font-size: 1.3rem;
  }

  .comments-card {
    padding: 0.9rem;
  }

  .form-top {
    grid-template-columns: 1fr;
    align-items: stretch;
  }

  .submit-block {
    justify-items: stretch;
    min-width: 0;
  }
}
</style>
