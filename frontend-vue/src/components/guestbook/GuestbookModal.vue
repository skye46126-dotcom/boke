<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="$emit('close')">
        <div class="bg-gh-card w-full max-w-md rounded-vp border border-gh-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div class="p-4 border-b border-gh-border flex justify-between items-center bg-gh-bg">
            <h3 class="font-bold">New Signature</h3>
            <button @click="$emit('close')" class="text-gh-text-muted hover:text-gh-text">✕</button>
          </div>
          
          <div class="p-6 overflow-y-auto no-scrollbar">
            <div class="mb-6 flex justify-center">
              <PixelEditor ref="editorRef" />
            </div>

            <div class="space-y-4 w-full max-w-[320px] mx-auto px-1">
              <div>
                <label class="block text-xs font-bold mb-1 ml-1 text-gh-text-muted">NICKNAME</label>
                <input 
                  v-model="form.nickname"
                  maxlength="20"
                  placeholder="Your Name"
                  class="w-full bg-gh-bg border border-gh-border rounded px-3 py-2 text-sm focus:border-vp-c-brand focus:outline-none"
                />
              </div>
              
              <div>
                <label class="block text-xs font-bold mb-1 ml-1 text-gh-text-muted">MESSAGE</label>
                <textarea 
                  v-model="form.message"
                  maxlength="100"
                  placeholder="Say something nice..."
                  class="w-full bg-gh-bg border border-gh-border rounded px-3 py-2 text-sm h-20 resize-none focus:border-vp-c-brand focus:outline-none"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="p-4 border-t border-gh-border bg-gh-bg flex justify-end gap-3">
            <button @click="$emit('close')" class="px-4 py-2 text-sm text-gh-text-muted hover:text-gh-text">Cancel</button>
            <button 
              @click="handleSubmit" 
              :disabled="submitting || !form.nickname"
              class="px-6 py-2 bg-vp-c-brand text-white font-bold rounded text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span v-if="submitting" class="animate-spin">⏳</span>
              {{ submitting ? 'Signing...' : 'Sign Guestbook' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive } from 'vue'
import PixelEditor from '@/components/guestbook/PixelEditor.vue'

const props = defineProps({
  isOpen: Boolean,
  submitting: Boolean
})

const emit = defineEmits(['close', 'submit'])

const editorRef = ref(null)
const form = reactive({
  nickname: '',
  message: ''
})

const handleSubmit = async () => {
    if (!editorRef.value) return
    
    // Pass everything back to parent to handle submission logic
    // Or we process the image here and pass data. 
    // Let's pass the raw data and let parent handle API calls for better separation.
    // However, generating image is async and tied to PixelEditor.
    
    try {
        const imageUrl = await editorRef.value.generateImage()
        const pixels = JSON.stringify(editorRef.value.pixels)
        
        emit('submit', {
            nickname: form.nickname,
            message: form.message,
            pixels,
            imageUrl
        })
        
        // Reset form on success (parent controls submitting state, so maybe we reset after?)
        // Ideally we wait for parent. But for now let's assume success if modal closes.
        // Actually, better to expose a reset method or watch isOpen.
    } catch (e) {
        console.error("Error generating image", e)
    }
}

// Expose reset if needed, or watch isOpen to clear form
import { watch } from 'vue'
watch(() => props.isOpen, (newVal) => {
    if (!newVal) {
        // Closed, maybe reset?
        // Let's keep data if user accidentally closed? No, usually clear.
        // form.nickname = '' // maybe keep nickname 
        form.message = ''
    }
})

// But wait, if we want to reset only after successful submit?
// Let's leave state management simple given the scope.
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
