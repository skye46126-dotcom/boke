<template>
  <IDEWindow 
    @resize-move="handleResize" 
    @resize-end="stopResize"
  >
    <template #header>
      <!-- Title Bar / Controls -->
      <div class="ide-header flex items-center justify-between bg-[#1e1e1e] border-b border-[#2d2d2d] px-2 h-10 shrink-0 select-none">
        <div class="flex items-center gap-4">
          <!-- Tabs (Scrollable) -->
          <div class="flex items-center h-full overflow-x-auto no-scrollbar max-w-[calc(100vw-200px)]">
            <button 
              v-for="tab in openTabs" 
              :key="tab.id"
              @click="activeTabId = tab.id"
              class="group flex items-center gap-2 px-3 py-2 text-xs border-r border-[#2d2d2d] min-w-[120px] transition-colors h-full relative"
              :class="activeTabId === tab.id ? 'bg-[#1e1e1e] text-white border-t-2 border-t-vp-c-brand' : 'bg-[#2d2d2d] text-gray-500 hover:bg-[#2a2a2a]'"
            >
              <span :class="getFileIconClass(tab.name)">{{ getFileIcon(tab.name) }}</span>
              <span class="truncate">{{ tab.name }}</span>
              <span 
                @click.stop="closeTab(tab.id)"
                class="ml-auto opacity-0 group-hover:opacity-100 hover:bg-[#444] rounded text-gray-400 hover:text-white w-4 h-4 flex items-center justify-center transition-opacity"
              >×</span>
            </button>
          </div>
        </div>

        <!-- Run Button -->
        <div class="flex items-center gap-3 pr-2">
           <button 
             @click="runProject" 
             class="flex items-center gap-1.5 px-3 py-1.5 rounded transition-all active:scale-95"
             :class="isRunning ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-green-600 hover:bg-green-500 text-white'"
             :disabled="isRunning && !isTerminalOpen"
           >
             <span class="text-[10px]">{{ isRunning ? '■' : '▶' }}</span>
             <span class="text-xs font-bold">{{ isRunning ? 'Stop' : 'Run' }}</span>
           </button>
        </div>
      </div>
    </template>

    <template #sidebar>
      <IDEExplorer 
        :projects="projectsData"
        :expandedFolders="expandedFolders"
        :activeTabId="activeTabId"
        :width="sidebarWidth"
        @toggle-folder="toggleProjectFolder"
        @open-file="openFile"
        @resize-start="startResize"
        @toggle-explorer="toggleExplorer"
      />
    </template>

    <template #editor>
      <IDEEditor 
        :activeTab="activeTab"
        @update-line-count="(count) => lineCount = count"
      />
    </template>

    <template #terminal>
      <IDETerminal 
        :isOpen="isTerminalOpen"
        :logs="terminalLogs"
        @close="isTerminalOpen = false"
        @minimize="isTerminalOpen = false"
      />
    </template>

    <template #footer>
      <IDEStatusBar 
        :activeTab="activeTab"
        :lineCount="lineCount"
      />
    </template>
  </IDEWindow>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { projects } from '@/data/portfolio'

// Modular Components
import IDEWindow from '@/components/ide/IDEWindow.vue'
import IDEExplorer from '@/components/ide/IDEExplorer.vue'
import IDEEditor from '@/components/ide/IDEEditor.vue'
import IDETerminal from '@/components/ide/IDETerminal.vue'
import IDEStatusBar from '@/components/ide/IDEStatusBar.vue'

// State
const projectsData = computed(() => projects)
const expandedFolders = ref({ 'root': true })
const activeTabId = ref(null)
const openTabs = ref([])
const activeTab = computed(() => openTabs.value.find(t => t.id === activeTabId.value))

// Runner State
const isTerminalOpen = ref(false)
const isRunning = ref(false)
const terminalLogs = ref([])

// UI State
const sidebarWidth = ref(250)
const isResizing = ref(false)
const lineCount = ref(1)

// Actions
const toggleExplorer = () => {
    // Optional implementation if needed to collapse fully
}

const toggleProjectFolder = (id) => {
  if (id === 'root')             expandedFolders.value['root'] = !expandedFolders.value['root']
  else                           expandedFolders.value[id] = !expandedFolders.value[id]
}

const openFile = (project, fileName, type) => {
  const id = `file-${projectsData.value.indexOf(project)}-${type}`
  const existing = openTabs.value.find(t => t.id === id)
  
  if (existing) {
    activeTabId.value = id
    return
  }
  
  openTabs.value.push({ id, name: fileName, type, project })
  activeTabId.value = id
}

const closeTab = (id) => {
  const idx = openTabs.value.findIndex(t => t.id === id)
  if (idx === -1) return
  openTabs.value.splice(idx, 1)
  if (activeTabId.value === id) {
    activeTabId.value = openTabs.value[Math.max(0, idx - 1)]?.id || null
  }
}

// Sidebar Resize
const startResize = () => {
    isResizing.value = true
    document.body.style.cursor = 'col-resize'
}

const stopResize = () => {
    isResizing.value = false
    document.body.style.cursor = ''
}

const handleResize = (e) => {
  if (!isResizing.value) return
  
  // Calculate relative to container left
  const container = document.querySelector('.ide-container') 
  if (container) {
      const rect = container.getBoundingClientRect()
      const newWidth = e.clientX - rect.left
      sidebarWidth.value = Math.max(150, Math.min(newWidth, 600))
  }
}

// Formatting Helpers (kept for Header Tabs)
const formatVarName = (name) => name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')
const getFileIcon = (name) => {
  if (name.endsWith('.js')) return 'JS'
  if (name.endsWith('.json')) return '{}'
  if (name.endsWith('.md')) return 'ℹ'
  return '📄'
}
const getFileIconClass = (name) => {
  if (name.endsWith('.js')) return 'text-yellow-400'
  if (name.endsWith('.json')) return 'text-red-400'
  if (name.endsWith('.md')) return 'text-blue-400'
  return 'text-gray-400'
}

// Runner Logic
const runProject = async () => {
  if (isRunning.value) {
    addLog('^C')
    isRunning.value = false
    return
  }

  isTerminalOpen.value = true
  isRunning.value = true
  terminalLogs.value = []
  
  if (!activeTab.value) {
     addLog('> No project selected')
     isRunning.value = false
     return
  }
  
  const proj = activeTab.value.project
  addLog(`> ${formatVarName(proj.title).toLowerCase()}@1.0.0 dev`)
  addLog(`> vite`)
  addLog('')
  await delay(800)
  addLog('  VITE v5.0.0  ready in 350 ms')
  addLog('')
  await delay(600)
  addLog('  ➜  Local:   http://localhost:5173/')
  if (proj.demo) {
      await delay(1000)
      addLog(`Opening demo: ${proj.demo}...`, 'text-blue-300')
  }
}

const addLog = (text, style) => {
  terminalLogs.value.push({ text, style })
  // Scroll logic moved to IDETerminal component via watch props
}
const delay = (ms) => new Promise(r => setTimeout(r, ms))

// Init
const init = () => {
    if (projectsData.value.length > 0) {
        toggleProjectFolder(projectsData.value[0].title)
        openFile(projectsData.value[0], 'README.md', 'md')
    }
}
nextTick(init)
</script>

<style scoped>
/* Scoped styles are mostly moved to components, keep any specific overrides if needed */
</style>
