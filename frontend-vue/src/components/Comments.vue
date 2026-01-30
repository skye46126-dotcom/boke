<template>
  <AppSection id="comments" title="Comments">
    <template #title>
      <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageSquare class="w-6 h-6 text-vp-c-brand" />
        Comments ({{ comments.length }})
      </h2>
    </template>

    <div class="space-y-8">
      <!-- Comment Form -->
      <div class="bg-gh-card border border-gh-border rounded-xl p-6 shadow-xl">
        <div class="mb-4">
          <label class="block text-xs font-mono text-gh-text-muted mb-2 uppercase tracking-widest">
            $ whoami
          </label>
          <input 
            v-model="nickname"
            type="text" 
            placeholder="Your Alias..."
            class="w-full bg-gh-bg border border-gh-border rounded px-4 py-2 text-gh-text focus:border-vp-c-brand outline-none transition-all font-mono text-sm"
          />
        </div>
        
        <div class="mb-4">
          <label class="block text-xs font-mono text-gh-text-muted mb-2 uppercase tracking-widest">
            $ echo "comment"
          </label>
          <textarea 
            v-model="newComment"
            rows="4" 
            placeholder="Write a comment..."
            class="w-full bg-gh-bg border border-gh-border rounded px-4 py-3 text-gh-text focus:border-vp-c-brand outline-none transition-all resize-none text-sm leading-relaxed"
          ></textarea>
        </div>

        <div class="flex justify-end">
          <button 
            @click="submitComment"
            :disabled="submitting || !newComment.trim() || !nickname.trim()"
            class="px-6 py-2 bg-vp-c-brand hover:bg-vp-c-brand-light disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded transition-all flex items-center gap-2 text-sm"
          >
            <Send class="w-4 h-4" v-if="!submitting" />
            <Loader2 class="w-4 h-4 animate-spin" v-else />
            {{ submitting ? 'Submitting...' : 'Post Comment' }}
          </button>
        </div>
      </div>

      <!-- Comments List -->
      <div v-if="loading" class="space-y-6">
        <div v-for="i in 3" :key="i" class="animate-pulse space-y-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-gh-card rounded-full"></div>
            <div class="h-4 bg-gh-card rounded w-24"></div>
          </div>
          <div class="h-16 bg-gh-card rounded w-full"></div>
        </div>
      </div>

      <div v-else-if="comments.length === 0" class="text-center py-12 border border-dashed border-gh-border rounded-xl bg-gh-card/10">
        <p class="text-gh-text-muted italic">No comments yet. Be the first to share your thoughts!</p>
      </div>

      <div v-else class="space-y-6">
        <div 
          v-for="comment in comments" 
          :key="comment.id" 
          class="group relative pl-6 border-l-2 border-gh-border hover:border-vp-c-brand transition-colors"
        >
          <div class="flex items-center gap-3 mb-2">
            <span class="text-sm font-bold text-vp-c-brand font-mono">{{ comment.author }}</span>
            <span class="text-[10px] text-gh-text-muted uppercase font-mono">
              {{ formatDate(comment.created_at) }}
            </span>
          </div>
          <p class="text-gh-text leading-relaxed text-sm whitespace-pre-wrap">{{ comment.content }}</p>
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
/* Optional styling refinements */
input, textarea {
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}
</style>
