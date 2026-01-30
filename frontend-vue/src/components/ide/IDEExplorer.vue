<template>
  <div 
    class="ide-sidebar bg-[#252526] border-r border-[#2d2d2d] flex flex-col shrink-0 relative transition-all duration-300 ease-in-out" 
    :class="[
      isMobileOpen ? 'fixed inset-y-0 left-0 z-50 w-[280px] flex shadow-2xl' : 'hidden lg:flex',
    ]"
    :style="!isMobileOpen ? { width: width + 'px' } : {}"
  >
    <div class="p-3 text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between items-center group cursor-pointer hover:text-white border-b border-[#2d2d2d] lg:border-none" @click="$emit('toggle-explorer')">
       <span>Explorer</span>
       <button @click.stop="$emit('close-mobile')" class="lg:hidden text-lg p-1 hover:bg-[#37373d] rounded">×</button>
       <span class="hidden lg:block opacity-0 group-hover:opacity-100">...</span>
    </div>
    
    <div class="flex-1 overflow-y-auto select-none">
      <!-- Root Folder -->
      <div class="px-2 py-1 flex items-center gap-1 text-sm text-gray-300 font-bold cursor-pointer hover:bg-[#37373d]" @click="toggleFolder('root')">
        <span class="transform transition-transform text-gray-500" :class="{ 'rotate-90': expandedFolders['root'] }">▶</span>
        <span class="text-blue-400">PORTFOLIO</span>
      </div>
      
      <div v-show="expandedFolders['root']">
         <div v-for="(proj, index) in projects" :key="proj.title">
            <!-- Project Folder -->
            <div 
              class="pl-4 px-2 py-1 flex items-center gap-1 text-sm text-gray-400 hover:bg-[#37373d] cursor-pointer"
              @click="toggleFolder(proj.title)"
            >
               <span class="transform transition-transform text-white/50 text-xs" :class="{ 'rotate-90': expandedFolders[proj.title] }">▶</span>
               <span class="text-yellow-400/80">📁</span>
               <span class="truncate text-gray-300">{{ proj.title.replace(/\s+/g, '-').toLowerCase() }}</span>
            </div>

            <!-- Project Files -->
            <div v-show="expandedFolders[proj.title]" class="pl-8 border-l border-[#333] ml-5">
               <!-- file: index.js -->
               <div 
                 class="px-2 py-0.5 flex items-center gap-2 text-sm cursor-pointer hover:bg-[#37373d] transition-colors"
                 :class="{ 'bg-[#37373d] text-white': activeTabId === `file-${index}-js` }"
                 @click="$emit('open-file', proj, 'index.js', 'js')"
               >
                 <span class="text-yellow-400 text-xs">JS</span>
                 <span class="truncate">index.js</span>
               </div>
               <!-- file: package.json -->
               <div 
                 class="px-2 py-0.5 flex items-center gap-2 text-sm cursor-pointer hover:bg-[#37373d] transition-colors"
                 :class="{ 'bg-[#37373d] text-white': activeTabId === `file-${index}-json` }"
                 @click="$emit('open-file', proj, 'package.json', 'json')"
               >
                 <span class="text-red-400 text-xs">{}</span>
                 <span class="truncate">package.json</span>
               </div>
               <!-- file: README.md -->
               <div 
                 class="px-2 py-0.5 flex items-center gap-2 text-sm cursor-pointer hover:bg-[#37373d] transition-colors"
                 :class="{ 'bg-[#37373d] text-white': activeTabId === `file-${index}-md` }"
                 @click="$emit('open-file', proj, 'README.md', 'md')"
               >
                 <span class="text-blue-400 text-xs">ℹ</span>
                 <span class="truncate">README.md</span>
               </div>
            </div>
         </div>
      </div>
    </div>

    <!-- Drag Handle -->
    <div class="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-vp-c-brand/50 z-10" @mousedown="$emit('resize-start')"></div>
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
</script>

<style scoped>
/* Custom Scrollbar */
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: #252526; }
::-webkit-scrollbar-thumb { background: #424242; }
::-webkit-scrollbar-thumb:hover { background: #4f4f4f; }
</style>
