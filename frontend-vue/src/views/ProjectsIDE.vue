<template>
  <div class="fixed inset-0 z-50 bg-[#1e1e1e] flex flex-col font-mono pt-[env(safe-area-inset-top)]">
    <div class="h-8 bg-[#3c3c3c] flex items-center justify-between px-2 select-none shrink-0">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 group">
           <router-link to="/" class="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 flex items-center justify-center">
             <span class="text-[8px] opacity-0 group-hover:opacity-100 text-black font-bold">×</span>
           </router-link>
           <div class="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
           <div class="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <div class="hidden md:flex gap-3 text-xs text-gray-300 ml-2">
           <span>File</span>
           <span>View</span>
           <span>Projects</span>
           <span>Run</span>
           <span>Help</span>
        </div>
      </div>
      <div class="text-[11px] sm:text-xs text-gray-400 truncate px-2 text-center flex-1">
        <span class="sm:hidden">project-workspace</span>
        <span class="hidden sm:inline">project-workspace - Visual Studio Code</span>
      </div>
      <div class="w-10"></div>
    </div>

    <div class="flex-1 overflow-hidden relative pb-[env(safe-area-inset-bottom)]">
      <IDEProjectViewer
        class="h-full w-full border-none rounded-none shadow-none"
        :initial-project-id="initialProjectId"
        :initial-file-name="initialFileName"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import IDEProjectViewer from '@/components/home/IDEProjectViewer.vue'

const route = useRoute()

const initialProjectId = computed(() => (
  typeof route.query.project === 'string' ? route.query.project : ''
))

const initialFileName = computed(() => (
  typeof route.query.file === 'string' ? route.query.file : 'README.md'
))
</script>

<style scoped>
:deep(.ide-container) {
  height: 100% !important;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}
</style>
