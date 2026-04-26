<template>
  <button
    type="button"
    class="group overflow-hidden rounded-[18px] border border-gh-border bg-gh-card text-left transition-all duration-300 hover:-translate-y-1 hover:border-vp-c-brand/60 hover:shadow-[0_18px_60px_rgba(0,0,0,0.28)]"
    @click="$emit('select', photo)"
  >
    <div class="relative aspect-[4/3] overflow-hidden bg-[#10151c]">
      <img
        :src="photo.url"
        :alt="photo.title"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05] group-hover:brightness-80"
        loading="lazy"
      />
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-gh-bg/85 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
      <div class="pointer-events-none absolute inset-x-0 bottom-0 p-4 opacity-0 transition duration-300 group-hover:opacity-100">
        <p class="text-sm font-medium text-white">{{ photo.title }}</p>
        <div class="mt-2 flex flex-wrap gap-2">
          <span
            v-for="tag in photo.tags.slice(0, 2)"
            :key="tag"
            class="rounded-full border border-white/10 bg-black/30 px-2 py-1 text-[11px] text-white/82"
          >
            #{{ tag }}
          </span>
        </div>
        <p class="mt-2 text-[11px] uppercase tracking-[0.18em] text-gh-text-muted">
          {{ formatPhotoDate(photo.created_at) }}
        </p>
      </div>
    </div>

    <div class="space-y-3 p-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="text-base font-semibold text-white">{{ photo.title }}</h3>
          <p class="mt-1 text-xs uppercase tracking-[0.16em] text-gh-text-muted">
            {{ formatPhotoDate(photo.created_at) }}
          </p>
        </div>
      </div>

      <p class="photo-description min-h-[2.75rem] text-sm leading-6 text-gh-text-muted">
        {{ photo.description }}
      </p>

      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in photo.tags"
          :key="tag"
          class="rounded-full border border-vp-c-brand/20 bg-vp-c-brand/10 px-2.5 py-1 text-[11px] text-vp-c-brand"
        >
          #{{ tag }}
        </span>
      </div>
    </div>
  </button>
</template>

<script setup>
defineProps({
  photo: {
    type: Object,
    required: true,
  },
})

defineEmits(['select'])

function formatPhotoDate(value) {
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
.photo-description {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
