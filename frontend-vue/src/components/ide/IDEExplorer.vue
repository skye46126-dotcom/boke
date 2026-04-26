<template>
  <div v-if="isMobileOpen" class="fixed inset-0 z-40 bg-black/50 backdrop-blur-[1px] lg:hidden" @click="$emit('close-mobile')"></div>

  <div
    class="ide-sidebar bg-[#252526] border-r border-[#2d2d2d] flex flex-col shrink-0 relative transition-all duration-300 ease-in-out"
    :class="[
      isMobileOpen ? 'fixed inset-y-0 left-0 z-50 w-[min(86vw,320px)] flex shadow-2xl' : 'hidden lg:flex',
    ]"
    :style="!isMobileOpen ? { width: width + 'px' } : {}"
  >
    <div class="p-3 text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between items-center group cursor-pointer hover:text-white border-b border-[#2d2d2d] lg:border-none">
       <div class="flex flex-col">
         <span>Explorer</span>
         <span class="mt-1 text-[10px] font-normal tracking-[0.16em] text-gray-500 lg:hidden">{{ projects.length }} projects</span>
       </div>
       <button @click.stop="$emit('close-mobile')" class="lg:hidden text-lg p-1 hover:bg-[#37373d] rounded">×</button>
       <span class="hidden lg:block opacity-0 group-hover:opacity-100" @click.stop="$emit('toggle-explorer')">...</span>
    </div>

    <div class="flex-1 overflow-y-auto select-none pb-6">
      <div class="px-2 py-1 flex items-center gap-1 text-sm text-gray-300 font-bold cursor-pointer hover:bg-[#37373d]" @click="toggleFolder('root')">
        <span class="transform transition-transform text-gray-500" :class="{ 'rotate-90': expandedFolders['root'] }">▶</span>
        <span class="text-blue-400">PORTFOLIO</span>
      </div>

      <div v-show="expandedFolders.root">
         <div v-for="proj in projects" :key="proj.id">
            <div
              class="pl-4 px-2 py-2 flex items-start gap-2 text-sm text-gray-400 hover:bg-[#37373d] cursor-pointer"
              @click="toggleFolder(proj.id)"
            >
               <span class="transform transition-transform text-white/50 text-xs mt-1" :class="{ 'rotate-90': expandedFolders[proj.id] }">▶</span>
               <span class="text-yellow-400/80 mt-0.5">📁</span>
               <div class="min-w-0 flex-1">
                 <div class="truncate text-gray-300">{{ proj.folderName }}</div>
                 <div class="truncate text-[11px] text-gray-500 lg:hidden">{{ proj.status }}</div>
               </div>
            </div>

            <div v-show="expandedFolders[proj.id]" class="pl-8 border-l border-[#333] ml-5">
               <div
                 v-for="file in proj.files"
                 :key="`${proj.id}-${file.name}`"
                 class="px-2 py-1.5 flex items-center gap-2 text-sm cursor-pointer hover:bg-[#37373d] transition-colors"
                 :class="{ 'bg-[#37373d] text-white': activeTabId === `${proj.id}:${file.name}` }"
                 @click="$emit('open-file', proj, file)"
               >
                 <span :class="getFileIconClass(file)" class="text-xs">{{ getFileIcon(file) }}</span>
                 <span class="truncate">{{ file.name }}</span>
               </div>
            </div>
         </div>
      </div>
    </div>

    <div class="absolute right-0 top-0 bottom-0 hidden lg:block w-1 cursor-col-resize hover:bg-vp-c-brand/50 z-10" @mousedown="$emit('resize-start')"></div>
  </div>
</template>

<script setup>
defineProps({
  projects: Array,
  expandedFolders: Object,
  activeTabId: String,
  width: Number,
  isMobileOpen: Boolean
})

const emit = defineEmits(['toggle-folder', 'open-file', 'resize-start', 'toggle-explorer', 'close-mobile'])

const toggleFolder = (id) => emit('toggle-folder', id)

const getFileIcon = (file) => {
  if (file.type === 'json') return '{}'
  return 'MD'
}

const getFileIconClass = (file) => {
  if (file.type === 'json') return 'text-red-400'
  return 'text-blue-400'
}
</script>

<style scoped>
/* Custom Scrollbar */
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: #252526; }
::-webkit-scrollbar-thumb { background: #424242; }
::-webkit-scrollbar-thumb:hover { background: #4f4f4f; }
</style>
