<template>
  <aside class="publish-panel">
    <p class="eyebrow">Publish Panel</p>
    <div class="status-box">
      <span>当前状态</span>
      <strong>{{ status }}</strong>
    </div>
    <div class="meta-box">
      <span>Slug</span>
      <strong>{{ slug || '未设置' }}</strong>
    </div>
    <label class="note-field">
      <span>审核备注 / 驳回原因</span>
      <textarea
        :value="reviewNote"
        rows="4"
        placeholder="填写审核备注、发布说明或驳回原因"
        @input="$emit('update:reviewNote', $event.target.value)"
      />
    </label>
    <p v-if="lastSavedAt" class="saved-hint">
      Last saved at {{ new Date(lastSavedAt).toLocaleString('zh-CN') }}
    </p>
    <div class="actions">
      <button type="button" class="save" :disabled="saving" @click="$emit('save')">
        {{ saving ? 'Saving...' : '保存草稿' }}
      </button>
      <button type="button" class="publish" :disabled="publishing" @click="$emit('publish')">
        {{ publishing ? 'Publishing...' : '发布文章' }}
      </button>
      <button type="button" class="reject" @click="$emit('reject')">
        驳回草稿
      </button>
      <button type="button" class="delete" @click="$emit('delete')">
        删除草稿
      </button>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  status: {
    type: String,
    default: 'draft',
  },
  slug: String,
  reviewNote: String,
  lastSavedAt: String,
  saving: Boolean,
  publishing: Boolean,
})

defineEmits(['save', 'publish', 'reject', 'delete', 'update:reviewNote'])
</script>

<style scoped>
.publish-panel {
  padding: 1.5rem;
  border-radius: 24px;
  border: 1px solid var(--color-gh-border);
  background: rgba(255, 255, 255, 0.03);
}

.eyebrow {
  color: var(--color-vp-c-brand);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
}

.status-box {
  margin-top: 1rem;
  display: grid;
  gap: 0.35rem;
  color: var(--color-gh-text-muted);
}

.meta-box,
.note-field {
  margin-top: 1rem;
  display: grid;
  gap: 0.35rem;
  color: var(--color-gh-text-muted);
}

.status-box strong {
  color: var(--color-gh-text);
  font-size: 1.2rem;
}

.meta-box strong {
  color: var(--color-gh-text);
  font-size: 0.95rem;
  word-break: break-all;
}

textarea {
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 14px;
  border: 1px solid var(--color-gh-border);
  background: var(--color-gh-bg);
  color: var(--color-gh-text);
}

.saved-hint {
  margin-top: 0.75rem;
  color: var(--color-gh-text-muted);
  font-size: 0.85rem;
}

.actions {
  display: grid;
  gap: 0.75rem;
  margin-top: 1.25rem;
}

button {
  padding: 0.85rem 1rem;
  border-radius: 14px;
  border: 1px solid var(--color-gh-border);
  text-align: left;
}

.save {
  color: var(--color-gh-text);
}

.publish {
  color: var(--color-vp-c-brand);
}

.reject {
  color: #f4c36a;
}

.delete {
  color: #ff9494;
}
</style>
