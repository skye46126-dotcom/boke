<template>
  <router-link
    :to="to"
    class="group block overflow-hidden rounded-[20px] border border-gh-border bg-gh-card transition-all duration-300 hover:-translate-y-1 hover:border-vp-c-brand/60 hover:shadow-[0_18px_60px_rgba(0,0,0,0.28)]"
  >
    <div class="relative aspect-[16/10] overflow-hidden bg-[#10151c]">
      <img
        :src="album.cover_url"
        :alt="album.title"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04] group-hover:brightness-80"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-gh-bg/85 via-transparent to-transparent" />
      <div class="absolute right-4 top-4 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/85">
        {{ album.photo_count }} photos
      </div>
      <div class="absolute left-4 top-4 flex flex-wrap gap-2">
        <span class="rounded-full border border-vp-c-brand/30 bg-vp-c-brand/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-vp-c-brand">
          {{ categoryLabel }}
        </span>
        <span
          v-if="album.is_featured"
          class="rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-white/85"
        >
          Featured
        </span>
      </div>
    </div>

    <div class="space-y-3 p-5">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h3 class="text-lg font-semibold text-white">{{ album.title }}</h3>
          <p class="mt-1 text-xs uppercase tracking-[0.16em] text-gh-text-muted">
            {{ categoryLabel }}
          </p>
        </div>
        <p class="shrink-0 text-xs text-gh-text-muted">
          {{ formatAlbumDate(album.updated_at || album.created_at) }}
        </p>
      </div>

      <p class="album-description min-h-[3rem] text-sm leading-6 text-gh-text-muted">
        {{ album.description }}
      </p>

      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in album.tags"
          :key="tag"
          class="rounded-full border border-vp-c-brand/20 bg-vp-c-brand/10 px-2.5 py-1 text-[11px] text-vp-c-brand"
        >
          #{{ tag }}
        </span>
      </div>

      <div class="flex items-center justify-between border-t border-gh-border pt-3 text-sm">
        <span class="text-gh-text-muted">
          {{ relatedLink ? relatedLink.label : 'No related entry' }}
        </span>
        <span class="text-vp-c-brand transition group-hover:translate-x-0.5">
          Open →
        </span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  album: {
    type: Object,
    required: true,
  },
  categoryLabel: {
    type: String,
    required: true,
  },
  relatedLink: {
    type: Object,
    default: null,
  },
  to: {
    type: [String, Object],
    required: true,
  },
})

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
</script>

<style scoped>
.album-description {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
