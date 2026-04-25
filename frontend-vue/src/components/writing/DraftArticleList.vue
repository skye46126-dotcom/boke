<template>
  <div class="draft-list">
    <DraftArticleCard
      v-for="article in articles"
      :key="article.id"
      :article="article"
      :selected="selectedArticleId === article.id"
      @select="$emit('select', $event)"
      @publish="$emit('publish', $event)"
      @reject="$emit('reject', $event)"
      @delete="$emit('delete', $event)"
    />
  </div>
</template>

<script setup>
import DraftArticleCard from '@/components/writing/DraftArticleCard.vue'

defineProps({
  articles: {
    type: Array,
    default: () => [],
  },
  selectedArticleId: {
    type: String,
    default: null,
  },
})

defineEmits(['publish', 'reject', 'delete', 'select'])
</script>

<style scoped>
.draft-list {
  display: grid;
  gap: 1rem;
}
</style>
