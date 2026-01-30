<template>
  <div class="min-h-screen bg-gh-bg text-gh-text pt-24 pb-12 px-6 relative">
    <MouseSpotlight />
    <div class="container mx-auto max-w-4xl relative z-10">
      <!-- Header -->
      <div class="flex items-center justify-between mb-12">
        <div>
          <h1 class="text-3xl font-bold mb-2 flex items-center gap-3">
            <span class="w-8 h-8 bg-vp-c-brand rounded pixel-icon"></span>
            Pixel Guestbook
          </h1>
          <p class="text-gh-text-muted">Leave your mark! Draw a pixel art and sign the wall.</p>
        </div>
        <button
          @click="openModal"
          class="code-btn px-6 py-3 rounded font-bold transition-all"
        >
          $ sign_guestbook.sh
        </button>
      </div>

      <!-- Guestbook List -->
      <GuestbookList :entries="entries" :loading="loading" />
    </div>

    <!-- Sign Modal -->
    <GuestbookModal 
      :is-open="isModalOpen" 
      :submitting="submitting"
      @close="closeModal"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/lib/supabase'
import MouseSpotlight from '@/components/shared/MouseSpotlight.vue'
import GuestbookList from '@/components/guestbook/GuestbookList.vue'
import GuestbookModal from '@/components/guestbook/GuestbookModal.vue'

// State
const entries = ref([])
const loading = ref(true)
const isModalOpen = ref(false)
const submitting = ref(false)

// Lifecycle
onMounted(() => {
  fetchGuestbook()
  subscribeToGuestbook()
})

onUnmounted(() => {
  if (supabase) {
    supabase.channel('guestbook-updates').unsubscribe()
  }
})

// Actions
const openModal = () => isModalOpen.value = true
const closeModal = () => isModalOpen.value = false

const fetchGuestbook = async () => {
  if (!supabase) {
    console.warn('Supabase not configured, showing empty wall.')
    loading.value = false
    return
  }

  try {
    const { data, error } = await supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
    
    if (error) throw error
    entries.value = data || []
  } catch (err) {
    console.error('Error fetching guestbook:', err)
  } finally {
    loading.value = false
  }
}

const subscribeToGuestbook = () => {
  if (!supabase) return

  try {
    supabase
      .channel('guestbook-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'guestbook' },
        (payload) => {
          entries.value.unshift(payload.new)
        }
      )
      .subscribe()
  } catch (err) {
    console.error('Error subscribing to guestbook:', err)
  }
}

const handleSubmit = async (formData) => {
  if (!supabase) {
    alert('Guestbook is in read-only mode (not configured).')
    return
  }

  submitting.value = true
  
  try {
    const { error } = await supabase.from('guestbook').insert({
      nickname: formData.nickname,
      message: formData.message,
      pixels: formData.pixels,
      image_url: formData.imageUrl
    })

    if (error) throw error
    
    closeModal()
  } catch (err) {
    console.error('Error submitting entry:', err)
    alert('Failed to sign guestbook. Please try again.')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.pixel-icon {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 19l7-7 3 3-7 7-3-3z'%3E%3Cpath d='M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z'%3E%3Cpath d='M2 2l7.586 7.586'%3E%3Ccircle cx='11' cy='11' r='2'%3E%3C/circle%3E%3C/svg%3E");
  mask-size: contain;
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 19l7-7 3 3-7 7-3-3z'%3E%3Cpath d='M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z'%3E%3Cpath d='M2 2l7.586 7.586'%3E%3Ccircle cx='11' cy='11' r='2'%3E%3C/circle%3E%3C/svg%3E");
  -webkit-mask-size: contain;
}

/* Code/Terminal Button Style (Glassmorphism) */
.code-btn {
  background: rgba(13, 17, 23, 0.3); /* Transparent dark bg */
  backdrop-filter: blur(10px); /* Frosted glass effect */
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(62, 175, 124, 0.5); /* Semi-transparent border */
  color: var(--color-vp-c-brand);
  font-family: var(--font-family-mono);
  letter-spacing: -0.5px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  text-shadow: 0 0 5px rgba(62, 175, 124, 0.3);
}

.code-btn:hover {
  background: rgba(62, 175, 124, 0.1); /* Slight brand tint on hover */
  border-color: var(--color-vp-c-brand);
  color: #fff;
  box-shadow: 0 8px 32px 0 rgba(62, 175, 124, 0.2);
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.code-btn:active {
  transform: translateY(0);
}
</style>
