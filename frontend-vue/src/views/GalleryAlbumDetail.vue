<template>
  <div class="min-h-screen bg-gh-bg text-gh-text">
    <section class="border-b border-gh-border/80 bg-gh-card/35">
      <div class="mx-auto max-w-7xl px-6 py-6">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full border border-gh-border bg-gh-card/60 px-4 py-2 text-sm text-gh-text transition hover:border-vp-c-brand/40 hover:text-white"
          @click="goBackToGallery"
        >
          ← Back to Gallery
        </button>

        <div v-if="loading" class="pt-8">
          <div class="rounded-3xl border border-gh-border bg-gh-card/60 px-6 py-16 text-center text-gh-text-muted">
            Loading gallery...
          </div>
        </div>

        <div v-else-if="error" class="pt-8">
          <div class="rounded-3xl border border-red-500/20 bg-red-500/5 px-6 py-16 text-center">
            <p class="text-base font-medium text-white">Failed to load gallery.</p>
            <p class="mt-2 text-sm text-gh-text-muted">Please try again later.</p>
          </div>
        </div>

        <div v-else-if="notFound" class="pt-8">
          <div class="rounded-3xl border border-gh-border bg-gh-card/60 px-6 py-16 text-center">
            <p class="text-base font-medium text-white">Gallery collection not found.</p>
            <p class="mt-2 text-sm text-gh-text-muted">Back to Gallery to explore other collections.</p>
          </div>
        </div>

        <div v-else-if="album" class="pt-8">
          <div class="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center">
            <div class="overflow-hidden rounded-[24px] border border-gh-border bg-gh-card">
              <img
                :src="album.cover_url"
                :alt="album.title"
                class="aspect-[16/10] w-full object-cover"
              />
            </div>

            <div>
              <p class="text-xs uppercase tracking-[0.28em] text-gh-text-muted">
                {{ categoryLabel }}
              </p>
              <h1 class="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                {{ album.title }}
              </h1>
              <p class="mt-4 max-w-2xl text-sm leading-7 text-gh-text-muted md:text-base">
                {{ album.description }}
              </p>

              <div class="mt-5 flex flex-wrap items-center gap-3 text-sm text-gh-text-muted">
                <span>{{ categoryLabel }}</span>
                <span>·</span>
                <span>{{ photos.length }} photos</span>
                <span>·</span>
                <span>{{ formatAlbumDate(album.updated_at || album.created_at) }}</span>
              </div>

              <div class="mt-5 flex flex-wrap gap-2">
                <span
                  v-for="tag in album.tags"
                  :key="tag"
                  class="rounded-full border border-vp-c-brand/20 bg-vp-c-brand/10 px-2.5 py-1 text-[11px] text-vp-c-brand"
                >
                  #{{ tag }}
                </span>
              </div>

              <button
                v-if="albumRelatedLink"
                type="button"
                class="mt-6 inline-flex items-center gap-2 rounded-full border border-vp-c-brand/30 bg-vp-c-brand/10 px-4 py-2 text-sm font-medium text-vp-c-brand transition hover:border-vp-c-brand hover:bg-vp-c-brand/15"
                @click="navigateToRelated(albumRelatedLink)"
              >
                {{ albumRelatedLink.label }}
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      v-if="album && !loading && !error && !notFound"
      class="mx-auto max-w-7xl px-6 py-10"
    >
      <div class="mb-6 flex items-center justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.28em] text-gh-text-muted">Photo Grid</p>
          <h2 class="mt-2 text-xl font-semibold text-white">{{ album.title }}</h2>
        </div>
        <p class="text-sm text-gh-text-muted">{{ photos.length }} photos</p>
      </div>

      <div
        v-if="!photos.length"
        class="rounded-3xl border border-gh-border bg-gh-card/60 px-6 py-16 text-center"
      >
        <p class="text-base font-medium text-white">No photos in this collection yet.</p>
      </div>

      <div
        v-else
        class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <GalleryPhotoCard
          v-for="photo in photos"
          :key="photo.id"
          :photo="photo"
          @select="openModal"
        />
      </div>
    </section>

    <GalleryImageModal
      v-if="selectedPhoto"
      :photo="selectedPhoto"
      :album="album"
      :category-label="categoryLabel"
      :current-index="currentIndex"
      :total-count="photos.length"
      :related-link="selectedRelatedLink"
      @close="closeModal"
      @prev="navigatePrev"
      @next="navigateNext"
      @navigate-related="navigateToRelated"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GalleryImageModal from '@/components/gallery/GalleryImageModal.vue'
import GalleryPhotoCard from '@/components/gallery/GalleryPhotoCard.vue'
import {
  buildRelatedLink,
  galleryCategories,
  getCategoryMeta,
  getGalleryAlbumById,
  getPhotosByAlbumId,
} from '@/services/galleryService'

const route = useRoute()
const router = useRouter()

const album = ref(null)
const photos = ref([])
const selectedPhoto = ref(null)
const loading = ref(true)
const error = ref(null)
const notFound = ref(false)

const categoryLabel = computed(() => getCategoryMeta(album.value?.category).label)
const albumRelatedLink = computed(() => buildRelatedLink(album.value))
const currentIndex = computed(() => {
  if (!selectedPhoto.value) {
    return -1
  }

  return photos.value.findIndex((photo) => photo.id === selectedPhoto.value.id)
})

const selectedRelatedLink = computed(() => {
  if (!selectedPhoto.value) {
    return null
  }

  return buildRelatedLink(selectedPhoto.value) || albumRelatedLink.value
})

function resolveBackCategory() {
  const queryCategory = typeof route.query.category === 'string' ? route.query.category : null
  if (queryCategory && galleryCategories.some((item) => item.id === queryCategory)) {
    return queryCategory
  }

  return album.value?.category || 'all'
}

function goBackToGallery() {
  const category = resolveBackCategory()
  router.push({
    name: 'Gallery',
    query: category && category !== 'all' ? { category } : {},
  })
}

function openModal(photo) {
  selectedPhoto.value = photo
}

function closeModal() {
  selectedPhoto.value = null
}

function navigatePrev() {
  if (!photos.value.length || currentIndex.value < 0) {
    return
  }

  const targetIndex = (currentIndex.value - 1 + photos.value.length) % photos.value.length
  selectedPhoto.value = photos.value[targetIndex]
}

function navigateNext() {
  if (!photos.value.length || currentIndex.value < 0) {
    return
  }

  const targetIndex = (currentIndex.value + 1) % photos.value.length
  selectedPhoto.value = photos.value[targetIndex]
}

function navigateToRelated(link) {
  if (!link) {
    return
  }

  if (link.external) {
    window.open(link.href, '_blank', 'noopener,noreferrer')
    return
  }

  closeModal()
  router.push(link.href)
}

function formatAlbumDate(value) {
  if (!value) {
    return 'Unknown'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'Unknown'
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}.${month}`
}

async function loadAlbumDetail() {
  loading.value = true
  error.value = null
  notFound.value = false
  selectedPhoto.value = null

  try {
    const albumId = typeof route.params.albumId === 'string' ? route.params.albumId : ''
    const albumData = await getGalleryAlbumById(albumId)

    if (!albumData) {
      album.value = null
      photos.value = []
      notFound.value = true
      return
    }

    album.value = albumData
    photos.value = albumData.photos?.length ? albumData.photos : await getPhotosByAlbumId(albumId)
  } catch (fetchError) {
    console.error('Failed to load album detail:', fetchError)
    error.value = 'Failed to load gallery.'
  } finally {
    loading.value = false
  }
}

watch(() => route.params.albumId, () => {
  loadAlbumDetail()
})

onMounted(() => {
  loadAlbumDetail()
})
</script>
