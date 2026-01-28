<template>
  <div class="h-6 bg-[#007acc] text-white flex items-center justify-between px-3 text-xs select-none z-30 shrink-0">
   <div class="flex items-center gap-4">
     <div class="flex items-center gap-1">
        <span>main*</span>
        <span class="opacity-50 text-[10px] ml-1">git</span>
     </div>
     <div class="hidden sm:flex items-center gap-1">
        <span>0 errors</span>
        <span>0 warnings</span>
     </div>
   </div>
   <div class="flex items-center gap-4">
      <span v-if="activeTab">Ln {{ lineCount }}, Col 1</span>
      <!-- <span>UTF-8</span> -->
      <span v-if="activeTab">{{ activeTab.type.toUpperCase() }}</span>
      <span class="hidden sm:inline">Prettier</span>
   </div>
 </div>
</template>

<script setup>
defineProps({
  activeTab: Object,
  lineCount: Number
})
</script>
