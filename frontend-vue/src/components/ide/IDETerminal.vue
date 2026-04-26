<template>
  <transition name="slide-up">
     <div v-if="isOpen" class="absolute bottom-0 left-0 right-0 bg-[#1e1e1e] border-t border-[#2d2d2d] shadow-[0_-4px_20px_rgba(0,0,0,0.5)] flex flex-col z-20" :style="{ height: 'min(260px, 32vh)' }">
        <div class="flex items-center justify-between px-3 sm:px-4 py-1 bg-[#2d2d2d] text-xs text-gray-400 select-none cursor-row-resize">
           <div class="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar">
              <span class="text-white border-b border-white">TERMINAL</span>
              <span>PROJECT CHECK</span>
              <span class="hidden sm:inline">OUTPUT</span>
           </div>
           <div class="flex gap-2">
              <span class="hover:text-white cursor-pointer" @click="$emit('minimize')">_</span>
              <span class="hover:text-white cursor-pointer" @click="$emit('close')">×</span>
           </div>
        </div>
        <div class="flex-1 p-3 sm:p-4 font-mono text-[13px] sm:text-sm overflow-y-auto text-gray-300 selection:bg-white/20" ref="terminalRef">
           <div v-for="(line, i) in logs" :key="i" :class="line.style || ''">{{ line.text }}</div>
        </div>
     </div>
  </transition>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  logs: Array
})

defineEmits(['close', 'minimize'])

const terminalRef = ref(null)

watch(() => props.logs, () => {
  nextTick(() => {
    if (terminalRef.value) {
      terminalRef.value.scrollTop = terminalRef.value.scrollHeight
    }
  })
}, { deep: true })
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Custom Scrollbar */
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: #1e1e1e; }
::-webkit-scrollbar-thumb { background: #424242; }
::-webkit-scrollbar-thumb:hover { background: #4f4f4f; }
</style>
