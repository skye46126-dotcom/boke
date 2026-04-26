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
  gap: 0.25rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.tab {
  position: relative;
  padding: 0.9rem 0.25rem 0.85rem;
  border-radius: 0;
  border: 0;
  background: transparent;
  color: var(--color-gh-text-muted);
  transition: var(--transition-smooth);
}

.tab:hover {
  color: var(--color-gh-text);
}

.tab.active {
  color: var(--color-gh-text);
}

.tab.active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  border-radius: 999px;
  background: var(--color-vp-c-brand);
}
</style>
