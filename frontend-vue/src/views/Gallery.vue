<template>
  <div class="min-h-screen bg-gh-bg text-gh-text">
    <section class="border-b border-gh-border/80 bg-gh-card/35">
      <div class="mx-auto max-w-7xl px-6 py-6">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.28em] text-gh-text-muted">Skye</p>
            <div class="mt-2 flex flex-wrap items-center gap-3">
              <h1 class="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Visual Gallery
              </h1>
              <span class="rounded-full border border-vp-c-brand/30 bg-vp-c-brand/10 px-3 py-1 text-xs font-medium text-vp-c-brand">
                AI Builder · Student Developer
              </span>
            </div>
            <p class="mt-4 max-w-3xl text-sm leading-7 text-gh-text-muted md:text-base">
              A visual archive of my projects, agents, workspace, notes and life moments.
            </p>
          </div>

          <div class="grid gap-3 rounded-2xl border border-gh-border bg-gh-card/70 p-4 md:min-w-[290px]">
            <p class="text-sm font-medium text-white">
              {{ albums.length }} collections · {{ totalPhotos }} photos · {{ populatedCategoryCount }} categories
            </p>
            <p class="text-xs leading-6 text-gh-text-muted">
              {{ categorySummary }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-6 py-8 md:py-10">
      <GalleryCategoryTabs
        :categories="categoryTabs"
        :selected-category="selectedCategory"
        :counts="categoryCounts"
        @select="selectedCategory = $event"
      />
    </section>

    <section v-if="loading" class="mx-auto max-w-7xl px-6 pb-14">
      <div class="rounded-3xl border border-gh-border bg-gh-card/60 px-6 py-16 text-center text-gh-text-muted">
        Loading gallery...
      </div>
    </section>

    <section v-else-if="error" class="mx-auto max-w-7xl px-6 pb-14">
      <div class="rounded-3xl border border-red-500/20 bg-red-500/5 px-6 py-16 text-center">
        <p class="text-base font-medium text-white">Failed to load gallery.</p>
        <p class="mt-2 text-sm text-gh-text-muted">Please try again later.</p>
      </div>
    </section>

    <section v-else-if="!albums.length" class="mx-auto max-w-7xl px-6 pb-14">
      <div class="rounded-3xl border border-gh-border bg-gh-card/60 px-6 py-16 text-center">
        <p class="text-base font-medium text-white">No gallery collections yet.</p>
        <p class="mt-2 text-sm text-gh-text-muted">More visual records will be added later.</p>
      </div>
    </section>

    <section v-else class="mx-auto max-w-7xl px-6 pb-16">
      <div class="mb-6 flex items-center justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.28em] text-gh-text-muted">Collections</p>
          <h2 class="mt-2 text-xl font-semibold text-white">
            {{ currentCategoryLabel === 'All' ? 'All album collections' : `${currentCategoryLabel} collections` }}
          </h2>
        </div>
        <p class="text-sm text-gh-text-muted">
          {{ filteredAlbums.length }} collections
        </p>
      </div>

      <div
        v-if="!filteredAlbums.length"
        class="rounded-3xl border border-gh-border bg-gh-card/60 px-6 py-16 text-center"
      >
        <p class="text-base font-medium text-white">No collections in this category yet.</p>
        <p class="mt-2 text-sm text-gh-text-muted">More visual records will be added later.</p>
      </div>

      <div
        v-else
        class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
      >
        <GalleryAlbumCard
          v-for="album in filteredAlbums"
          :key="album.id"
          :album="album"
          :category-label="getCategoryLabel(album.category)"
          :related-link="buildRelatedLink(album)"
          :to="albumLink(album)"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GalleryAlbumCard from '@/components/gallery/GalleryAlbumCard.vue'
import GalleryCategoryTabs from '@/components/gallery/GalleryCategoryTabs.vue'
import {
  buildRelatedLink,
  galleryCategories,
  getCategoryMeta,
  getGalleryAlbums,
} from '@/services/galleryService'

const route = useRoute()
const router = useRouter()

const albums = ref([])
const loading = ref(true)
const error = ref(null)

const categoryTabs = galleryCategories

function resolveCategoryFromQuery() {
  const queryCategory = typeof route.query.category === 'string' ? route.query.category : 'all'
  return categoryTabs.some((item) => item.id === queryCategory) ? queryCategory : 'all'
}

const selectedCategory = ref(resolveCategoryFromQuery())

const totalPhotos = computed(() => (
  albums.value.reduce((sum, album) => sum + (album.photo_count || 0), 0)
))

const categoryCounts = computed(() => {
  const counts = albums.value.reduce((accumulator, album) => {
    accumulator[album.category] = (accumulator[album.category] || 0) + 1
    return accumulator
  }, {})

  return {
    all: albums.value.length,
    projects: counts.projects || 0,
    agents: counts.agents || 0,
    workspace: counts.workspace || 0,
    life: counts.life || 0,
    notes: counts.notes || 0,
  }
})

const populatedCategoryCount = computed(() => (
  categoryTabs
    .filter((category) => category.id !== 'all')
    .filter((category) => (categoryCounts.value[category.id] || 0) > 0)
    .length
))

const categorySummary = computed(() => (
  categoryTabs
    .filter((category) => category.id !== 'all')
    .filter((category) => (categoryCounts.value[category.id] || 0) > 0)
    .map((category) => `${category.label} ${categoryCounts.value[category.id]}`)
    .join(' · ')
))

const filteredAlbums = computed(() => {
  if (selectedCategory.value === 'all') {
    return albums.value
  }

  return albums.value.filter((album) => album.category === selectedCategory.value)
})

const currentCategoryLabel = computed(() => getCategoryMeta(selectedCategory.value).label)

function getCategoryLabel(category) {
  return getCategoryMeta(category).label
}

function albumLink(album) {
  const query = selectedCategory.value !== 'all'
    ? { category: selectedCategory.value }
    : {}

  return {
    name: 'GalleryAlbumDetail',
    params: {
      albumId: album.id,
    },
    query,
  }
}

watch(() => route.query.category, () => {
  const nextCategory = resolveCategoryFromQuery()
  if (nextCategory !== selectedCategory.value) {
    selectedCategory.value = nextCategory
  }
})

watch(selectedCategory, (value) => {
  const nextQuery = { ...route.query }

  if (value === 'all') {
    delete nextQuery.category
  } else {
    nextQuery.category = value
  }

  const currentCategory = typeof route.query.category === 'string' ? route.query.category : undefined
  const nextCategory = value === 'all' ? undefined : value

  if (currentCategory !== nextCategory) {
    router.replace({ query: nextQuery })
  }
})

onMounted(async () => {
  try {
    albums.value = await getGalleryAlbums()
  } catch (fetchError) {
    console.error('Failed to load gallery albums:', fetchError)
    error.value = 'Failed to load gallery.'
  } finally {
    loading.value = false
  }
})
</script>
