<template>
  <form class="comment-form" @submit.prevent="handleSubmit">
    <div class="field-grid">
      <label class="nickname-field">
        <span>昵称</span>
        <input ref="nicknameInputRef" v-model="nickname" type="text" placeholder="@visitor" required />
      </label>
      <label class="content-field">
        <span>回复</span>
        <textarea ref="contentInputRef" v-model="content" rows="3" placeholder="写下你的回复" required />
      </label>
    </div>
    <button type="submit" class="submit-button" :disabled="submitting">
      {{ submitting ? '提交中...' : '发布回复' }}
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
const nicknameInputRef = ref(null)
const contentInputRef = ref(null)

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

function focusContent() {
  contentInputRef.value?.focus()
}

function prefillReply(name = '') {
  if (!name) {
    focusContent()
    return
  }

  const mention = `@${String(name).trim().replace(/^@/, '').replace(/\s+/g, '_')} `
  content.value = content.value.startsWith(mention) ? content.value : `${mention}${content.value}`.trimStart()
  contentInputRef.value?.focus()
}

defineExpose({
  focusContent,
  prefillReply,
  focusNickname() {
    nicknameInputRef.value?.focus()
  },
})
</script>

<style scoped>
.comment-form {
  display: grid;
  grid-template-columns: minmax(0, 140px) minmax(0, 1fr) auto;
  gap: 0.75rem;
  align-items: end;
}

.field-grid {
  grid-column: 1 / span 2;
  display: grid;
  grid-template-columns: minmax(0, 140px) minmax(0, 1fr);
  gap: 0.75rem;
}

label {
  display: grid;
  gap: 0.35rem;
}

span {
  color: var(--color-gh-text-muted);
  font-size: 0.78rem;
}

input,
textarea {
  width: 100%;
  padding: 0.7rem 0.8rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(11, 16, 20, 0.58);
  color: var(--color-gh-text);
}

textarea {
  min-height: 64px;
  max-height: 80px;
  resize: vertical;
}

.submit-button {
  height: 38px;
  padding: 0 1rem;
  border-radius: 999px;
  border: 0;
  background: var(--color-vp-c-brand);
  color: #04130b;
  font-weight: 700;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .comment-form,
  .field-grid {
    grid-template-columns: 1fr;
  }

  .field-grid {
    grid-column: auto;
  }

  .submit-button {
    width: fit-content;
  }
}
</style>
