<template>
  <div class="min-h-screen bg-gh-bg text-gh-text">
    <!-- Header -->
    <header class="border-b border-gh-border backdrop-blur sticky top-0 z-40 bg-gh-bg/95">
      <nav class="container mx-auto px-6 py-4 flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-3">
          <span class="text-xl font-bold">YourName</span>
          <span class="text-xs text-gh-text-muted px-2 py-1 bg-gh-card border border-gh-border rounded">
            Developer
          </span>
        </router-link>
        <div class="flex gap-6 items-center">
          <router-link to="/articles" class="text-gh-text-muted hover:text-vp-c-brand transition">
            Articles
          </router-link>
          <router-link to="/gallery" class="text-vp-c-brand font-medium">
            Gallery
          </router-link>
          <a href="/#about" class="text-gh-text-muted hover:text-vp-c-brand transition">
            About
          </a>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <div class="container mx-auto px-6 py-12">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Photo Gallery</h1>
        <p class="text-gh-text-muted">{{ images.length }} photos</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gh-text-muted">Loading gallery...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-gh-text-muted">{{ error }}</p>
      </div>

      <!-- Gallery Grid (GitHub Repo Style) -->
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="image in images"
          :key="image.id"
          @click="openModal(image)"
          class="group relative aspect-square bg-gh-card border border-gh-border rounded-vp overflow-hidden cursor-pointer hover:border-vp-c-brand transition-all"
        >
          <!-- Lazy Loading Image -->
          <img
            v-lazy="image.url"
            :alt="image.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          
          <!-- Overlay on Hover -->
          <div class="absolute inset-0 bg-gradient-to-t from-gh-bg/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div class="absolute bottom-0 left-0 right-0 p-4">
              <h3 class="text-sm font-semibold text-gh-text truncate">{{ image.title }}</h3>
              <p v-if="image.description" class="text-xs text-gh-text-muted truncate mt-1">
                {{ image.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="selectedImage"
          @click="closeModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-gh-bg/95 backdrop-blur-sm p-4"
        >
          <div
            ref="modalRef"
            @click.stop
            class="max-w-5xl w-full bg-gh-card border border-gh-border rounded-vp overflow-hidden"
          >
            <!-- Modal Image -->
            <img
              :src="selectedImage.url"
              :alt="selectedImage.title"
              class="w-full h-auto max-h-[70vh] object-contain"
            />
            
            <!-- Modal Info -->
            <div class="p-6 border-t border-gh-border">
              <h2 class="text-xl font-bold mb-2">{{ selectedImage.title }}</h2>
              <p v-if="selectedImage.description" class="text-gh-text-muted">
                {{ selectedImage.description }}
              </p>
              
              <!-- Tags -->
              <div v-if="selectedImage.tags && selectedImage.tags.length" class="flex gap-2 mt-4">
                <span
                  v-for="tag in selectedImage.tags"
                  :key="tag"
                  class="px-2 py-1 text-xs bg-gh-bg border border-gh-border rounded text-vp-c-brand"
                >
                  {{ tag }}
                </span>
              </div>
              
              <!-- Navigation Buttons -->
              <div class="flex gap-2 mt-4">
                <button
                  @click="navigatePrev"
                  class="px-4 py-2 bg-gh-bg border border-gh-border rounded-vp hover:border-vp-c-brand transition"
                >
                  ← Previous
                </button>
                <button
                  @click="navigateNext"
                  class="px-4 py-2 bg-gh-bg border border-gh-border rounded-vp hover:border-vp-c-brand transition"
                >
                  Next →
                </button>
                <button
                  @click="closeModal"
                  class="ml-auto px-4 py-2 bg-gh-bg border border-gh-border rounded-vp hover:border-vp-c-brand transition"
                >
                  Close
                </button>
              </div>
              
              <!-- Swipe Hint (Mobile) -->
              <p class="text-xs text-gh-text-muted mt-2 md:hidden">
                👉 Swipe left or right to navigate
              </p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useSwipe } from '@vueuse/core'
import { supabase } from '../lib/supabase'

const images = ref([])
const loading = ref(true)
const error = ref(null)
const selectedImage = ref(null)
const modalRef = ref(null)

// Current image index
const currentIndex = computed(() => {
  if (!selectedImage.value) return -1
  return images.value.findIndex(img => img.id === selectedImage.value.id)
})

// Setup swipe gestures for modal
const { direction } = useSwipe(modalRef, {
  onSwipeEnd(e, direction) {
    if (!selectedImage.value) return
    
    if (direction === 'left') {
      // Next image
      const nextIndex = (currentIndex.value + 1) % images.value.length
      selectedImage.value = images.value[nextIndex]
    } else if (direction === 'right') {
      // Previous image
      const prevIndex = (currentIndex.value - 1 + images.value.length) % images.value.length
      selectedImage.value = images.value[prevIndex]
    }
  }
})

// Lazy loading directive
const vLazy = {
  mounted(el, binding) {
    const loadImage = () => {
      el.src = binding.value
      el.classList.add('loaded')
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImage()
          observer.unobserve(el)
        }
      })
    })

    observer.observe(el)
  }
}

const openModal = (image) => {
  selectedImage.value = image
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  selectedImage.value = null
  document.body.style.overflow = ''
}

const navigatePrev = () => {
  const prevIndex = (currentIndex.value - 1 + images.value.length) % images.value.length
  selectedImage.value = images.value[prevIndex]
}

const navigateNext = () => {
  const nextIndex = (currentIndex.value + 1) % images.value.length
  selectedImage.value = images.value[nextIndex]
}

onMounted(async () => {
  try {
    const { data, error: fetchError } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) throw fetchError
    images.value = data || []
  } catch (err) {
    console.error('Error fetching gallery:', err)
    error.value = 'Failed to load gallery. Please check your database connection.'
  } finally {
    loading.value = false
  }
})

// Handle ESC key to close modal
onMounted(() => {
  const handleEsc = (e) => {
    if (e.key === 'Escape' && selectedImage.value) {
      closeModal()
    }
  }
  window.addEventListener('keydown', handleEsc)
  
  return () => window.removeEventListener('keydown', handleEsc)
})
</script>

<style scoped>
/* Modal Animation */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-gh-card,
.modal-leave-active .bg-gh-card {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-gh-card,
.modal-leave-to .bg-gh-card {
  transform: scale(0.95);
}

/* Lazy Loading Placeholder */
img[v-lazy]:not(.loaded) {
  background: linear-gradient(90deg, var(--color-gh-card) 25%, var(--color-gh-border) 50%, var(--color-gh-card) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
