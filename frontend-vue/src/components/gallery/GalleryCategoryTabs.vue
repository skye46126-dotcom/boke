<template>
  <div class="flex flex-wrap gap-3">
    <button
      v-for="category in categories"
      :key="category.id"
      type="button"
      class="rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300"
      :class="selectedCategory === category.id
        ? 'border-vp-c-brand bg-vp-c-brand/12 text-white shadow-[0_0_0_1px_rgba(62,175,124,0.2)]'
        : 'border-gh-border bg-gh-card/65 text-gh-text-muted hover:border-vp-c-brand/40 hover:text-gh-text'"
      @click="$emit('select', category.id)"
    >
      <span>{{ category.label }}</span>
      <span class="ml-2 text-xs opacity-80">{{ counts?.[category.id] ?? 0 }}</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  selectedCategory: {
    type: String,
    default: 'all',
  },
  counts: {
    type: Object,
    default: () => ({}),
  },
})

defineEmits(['select'])
</script>
