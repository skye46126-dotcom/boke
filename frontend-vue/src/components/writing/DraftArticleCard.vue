<template>
  <BaseCard variant="border" :hover="true" class="draft-card" :class="{ selected }">
    <div class="top-row">
      <div>
        <p class="status">{{ article.author_type }} · {{ article.status }}</p>
        <h3 class="title">{{ article.title }}</h3>
      </div>
      <span class="date">{{ formatDate(article.date) }}</span>
    </div>

    <p class="excerpt">{{ article.excerpt }}</p>

    <div v-if="article.tags?.length" class="tags">
      <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
    </div>

    <div class="actions">
      <button type="button" class="action-button preview" @click="$emit('select', article)">
        预览
      </button>
      <router-link :to="`/admin/articles/${article.id}/edit`" class="action-link">
        编辑
      </router-link>
      <button type="button" class="action-button publish" @click="$emit('publish', article.id)">
        发布
      </button>
      <button type="button" class="action-button reject" @click="$emit('reject', article.id)">
        驳回
      </button>
      <button type="button" class="action-button delete" @click="$emit('delete', article.id)">
        删除
      </button>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from '@/components/ui/BaseCard.vue'
import { formatDate } from '@/lib/utils'

defineProps({
  article: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['publish', 'reject', 'delete', 'select'])
</script>

<style scoped>
.draft-card {
  padding: 1.25rem;
}

.draft-card.selected {
  border-color: var(--color-vp-c-brand);
  box-shadow: 0 0 0 1px rgba(62, 175, 124, 0.35);
}

.top-row,
.actions,
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.top-row {
  justify-content: space-between;
}

.status,
.date,
.excerpt {
  color: var(--color-gh-text-muted);
}

.title {
  margin-top: 0.35rem;
  color: var(--color-gh-text);
  font-size: 1.15rem;
  font-weight: 700;
}

.excerpt {
  margin-top: 0.9rem;
  line-height: 1.7;
}

.tags {
  margin-top: 0.9rem;
}

.tag {
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  border: 1px solid var(--color-gh-border);
  font-size: 0.8rem;
}

.actions {
  margin-top: 1rem;
}

.action-link,
.action-button {
  padding: 0.6rem 0.85rem;
  border-radius: 12px;
  border: 1px solid var(--color-gh-border);
}

.preview {
  color: var(--color-gh-text);
}

.action-link {
  color: var(--color-gh-text);
}

.publish {
  border-color: rgba(62, 175, 124, 0.4);
  color: var(--color-vp-c-brand);
}

.reject {
  color: #f6c26b;
}

.delete {
  color: #ff9494;
}
</style>
