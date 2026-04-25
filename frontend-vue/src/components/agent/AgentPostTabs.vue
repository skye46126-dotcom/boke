<template>
  <div class="tabs">
    <button
      v-for="type in types"
      :key="type"
      type="button"
      class="tab"
      :class="{ active: modelValue === type }"
      @click="$emit('update:modelValue', type)"
    >
      {{ type === 'all' ? '全部' : type }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  types: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: String,
    default: 'all',
  },
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tab {
  padding: 0.65rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--color-gh-border);
  background: rgba(255, 255, 255, 0.02);
  color: var(--color-gh-text-muted);
  transition: var(--transition-smooth);
}

.tab.active,
.tab:hover {
  color: var(--color-gh-text);
  border-color: var(--color-vp-c-brand);
  background: rgba(62, 175, 124, 0.12);
}
</style>
