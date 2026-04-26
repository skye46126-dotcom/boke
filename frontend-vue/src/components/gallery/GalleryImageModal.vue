<template>
  <Teleport to="body">
    <Transition name="gallery-modal">
      <div
        v-if="photo"
        class="fixed inset-0 z-50 overflow-y-auto bg-[rgba(6,10,15,0.88)] p-4 backdrop-blur-md"
        @click="$emit('close')"
      >
        <div class="mx-auto flex min-h-full max-w-6xl items-center justify-center py-8">
          <div
            ref="panelRef"
            class="gallery-modal-panel relative w-full overflow-hidden rounded-[24px] border border-gh-border bg-gh-card shadow-[0_30px_120px_rgba(0,0,0,0.55)]"
            @click.stop
          >
            <button
              type="button"
              class="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-sm text-white transition hover:border-vp-c-brand/40 hover:text-vp-c-brand"
              @click="$emit('close')"
            >
              Close
            </button>

            <div class="grid lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.85fr)]">
              <div class="relative bg-[#0c1117]">
                <img
                  :src="photo.url"
                  :alt="photo.title"
                  class="h-full max-h-[72vh] w-full object-cover lg:max-h-[88vh]"
                />
              </div>

              <div class="flex flex-col gap-6 p-6 md:p-8">
                <div>
                  <p class="text-xs uppercase tracking-[0.28em] text-gh-text-muted">
                    {{ categoryLabel }}
                  </p>
                  <h2 class="mt-3 text-2xl font-semibold text-white md:text-3xl">
                    {{ photo.title }}
                  </h2>
                  <p class="mt-4 text-sm leading-7 text-gh-text-muted md:text-base">
                    {{ photo.description }}
                  </p>
                </div>

                <dl class="grid gap-4 text-sm">
                  <div class="rounded-2xl border border-gh-border bg-gh-bg/55 p-4">
                    <dt class="text-xs uppercase tracking-[0.2em] text-gh-text-muted">Album</dt>
                    <dd class="mt-2 text-white">{{ album?.title || 'Unknown' }}</dd>
                  </div>

                  <div class="rounded-2xl border border-gh-border bg-gh-bg/55 p-4">
                    <dt class="text-xs uppercase tracking-[0.2em] text-gh-text-muted">Date</dt>
                    <dd class="mt-2 text-white">{{ formatDate(photo.created_at) }}</dd>
                  </div>

                  <div class="rounded-2xl border border-gh-border bg-gh-bg/55 p-4">
                    <dt class="text-xs uppercase tracking-[0.2em] text-gh-text-muted">Tags</dt>
                    <dd class="mt-3 flex flex-wrap gap-2">
                      <span
                        v-for="tag in photo.tags"
                        :key="tag"
                        class="rounded-full border border-vp-c-brand/20 bg-vp-c-brand/10 px-2.5 py-1 text-[11px] text-vp-c-brand"
                      >
                        #{{ tag }}
                      </span>
                    </dd>
                  </div>
                </dl>

                <button
                  v-if="relatedLink"
                  type="button"
                  class="inline-flex items-center gap-2 self-start rounded-full border border-vp-c-brand/30 bg-vp-c-brand/10 px-4 py-2 text-sm font-medium text-vp-c-brand transition hover:border-vp-c-brand hover:bg-vp-c-brand/15"
                  @click="$emit('navigate-related', relatedLink)"
                >
                  {{ relatedLink.label }}
                  <span aria-hidden="true">→</span>
                </button>

                <div class="mt-auto flex flex-wrap gap-3 border-t border-gh-border pt-6">
                  <button
                    type="button"
                    class="rounded-full border border-gh-border bg-gh-bg/60 px-4 py-2 text-sm text-gh-text transition hover:border-vp-c-brand/50 hover:text-white"
                    @click="$emit('prev')"
                  >
                    ← Previous
                  </button>
                  <button
                    type="button"
                    class="rounded-full border border-gh-border bg-gh-bg/60 px-4 py-2 text-sm text-gh-text transition hover:border-vp-c-brand/50 hover:text-white"
                    @click="$emit('next')"
                  >
                    Next →
                  </button>
                  <p class="self-center text-xs uppercase tracking-[0.18em] text-gh-text-muted">
                    {{ currentIndex + 1 }} / {{ totalCount }}
                  </p>
                </div>

                <p class="text-xs text-gh-text-muted md:hidden">
                  Swipe left or right to navigate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useSwipe } from '@vueuse/core'

const props = defineProps({
  photo: {
    type: Object,
    default: null,
  },
  album: {
    type: Object,
    default: null,
  },
  categoryLabel: {
    type: String,
    default: 'Unknown',
  },
  currentIndex: {
    type: Number,
    default: 0,
  },
  totalCount: {
    type: Number,
    default: 0,
  },
  relatedLink: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'prev', 'next', 'navigate-related'])

const panelRef = ref(null)

useSwipe(panelRef, {
  onSwipeEnd(_, direction) {
    if (direction === 'left') {
      emit('next')
    } else if (direction === 'right') {
      emit('prev')
    }
  },
})

function handleKeydown(event) {
  if (!props.photo) {
    return
  }

  if (event.key === 'Escape') {
    emit('close')
  } else if (event.key === 'ArrowLeft') {
    emit('prev')
  } else if (event.key === 'ArrowRight') {
    emit('next')
  }
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleKeydown)
})

function formatDate(value) {
  if (!value) {
    return 'Unknown'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'Unknown'
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}
</script>

<style scoped>
.gallery-modal-enter-active,
.gallery-modal-leave-active {
  transition: opacity 0.28s ease;
}

.gallery-modal-enter-active .gallery-modal-panel,
.gallery-modal-leave-active .gallery-modal-panel {
  transition: transform 0.28s ease, opacity 0.28s ease;
}

.gallery-modal-enter-from,
.gallery-modal-leave-to {
  opacity: 0;
}

.gallery-modal-enter-from .gallery-modal-panel,
.gallery-modal-leave-to .gallery-modal-panel {
  transform: translateY(12px) scale(0.98);
  opacity: 0;
}
</style>
