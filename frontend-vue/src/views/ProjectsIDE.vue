<template>
  <div class="fixed inset-0 z-50 bg-[#1e1e1e] flex flex-col font-mono">
    <!-- VS Code Top Bar (Mimic) -->
    <div class="h-8 bg-[#3c3c3c] flex items-center justify-between px-2 select-none">
      <div class="flex items-center gap-4">
        <!-- Close / Minimize / Maximize -->
        <div class="flex items-center gap-2 group">
           <router-link to="/" class="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 flex items-center justify-center">
             <span class="text-[8px] opacity-0 group-hover:opacity-100 text-black font-bold">×</span>
           </router-link>
           <div class="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
           <div class="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <!-- Menu Items (Static) -->
        <div class="hidden md:flex gap-3 text-xs text-gray-300 ml-2">
           <span>File</span>
           <span>Edit</span>
           <span>Selection</span>
           <span>View</span>
           <span>Go</span>
           <span>Run</span>
           <span>Terminal</span>
           <span>Help</span>
        </div>
      </div>
      <div class="text-xs text-gray-400 truncate px-2 text-center flex-1">pixel-portfolio - Visual Studio Code</div>
      <div class="w-10"></div> <!-- Spacer -->
    </div>

    <!-- Main IDE Area -->
    <div class="flex-1 overflow-hidden relative">
      <IDEProjectViewer class="h-full w-full border-none rounded-none shadow-none" />
    </div>

    <!-- Status Bar -->
    <div class="h-6 bg-[#007acc] text-white flex items-center justify-between px-3 text-xs select-none">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1">
           <span>main*</span>
        </div>
        <div class="flex items-center gap-1">
           <span>0 errors</span>
           <span>0 warnings</span>
        </div>
      </div>
      <div class="flex items-center gap-4 overflow-hidden">
         <span class="hidden sm:inline">Ln 1, Col 1</span>
         <span class="hidden sm:inline">UTF-8</span>
         <span>JavaScript</span>
         <span class="hidden sm:inline">Prettier</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import IDEProjectViewer from '@/components/home/IDEProjectViewer.vue'

// Hide regular scrollbar on mount for immersion? 
// Actually the fixed inset-0 handles it.
</script>

<style scoped>
/* Ensure the inner IDE viewer takes full height without its own borders */
:deep(.ide-container) {
  height: 100% !important;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}

/* :deep(.ide-header) style removed to show Tabs and Run button */
</style>
