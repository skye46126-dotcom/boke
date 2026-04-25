<template>
  <form class="comment-form" @submit.prevent="handleSubmit">
    <div class="field-grid">
      <label>
        <span>昵称</span>
        <input v-model="nickname" type="text" placeholder="你的昵称" required />
      </label>
      <label>
        <span>评论</span>
        <textarea v-model="content" rows="4" placeholder="写下你的想法" required />
      </label>
    </div>
    <button type="submit" class="submit-button" :disabled="submitting">
      {{ submitting ? '提交中...' : '发表评论' }}
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  submitting: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit'])

const nickname = ref('')
const content = ref('')

const handleSubmit = async () => {
  await emit('submit', {
    nickname: nickname.value,
    content: content.value,
  })

  if (!props.submitting) {
    nickname.value = ''
    content.value = ''
  }
}
</script>

<style scoped>
.comment-form {
  padding: 1.25rem;
  border-radius: 20px;
  border: 1px solid var(--color-gh-border);
  background: rgba(255, 255, 255, 0.03);
}

.field-grid {
  display: grid;
  gap: 1rem;
}

label {
  display: grid;
  gap: 0.5rem;
}

span {
  color: var(--color-gh-text-muted);
  font-size: 0.9rem;
}

input,
textarea {
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 14px;
  border: 1px solid var(--color-gh-border);
  background: var(--color-gh-bg);
  color: var(--color-gh-text);
}

.submit-button {
  margin-top: 1rem;
  padding: 0.8rem 1.1rem;
  border-radius: 14px;
  background: var(--color-vp-c-brand);
  color: #04130b;
  font-weight: 700;
}
</style>
