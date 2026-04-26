<template>
  <IDEWindow @resize-move="handleResize" @resize-end="stopResize">
    <template #header>
      <div class="ide-header border-b border-[#2d2d2d] bg-[#1e1e1e] shrink-0 select-none">
        <div class="flex h-10 items-center justify-between px-2">
          <div class="flex min-w-0 items-center gap-3">
            <button
              @click="isMobileExplorerOpen = !isMobileExplorerOpen"
              class="lg:hidden p-2 rounded transition-colors text-gray-400 hover:bg-[#2d2d2d]"
              title="Toggle Explorer"
            >
              <span class="text-lg">📁</span>
            </button>

            <div class="flex items-center h-full overflow-x-auto no-scrollbar max-w-[calc(100vw-124px)] sm:max-w-[calc(100vw-150px)] lg:max-w-[calc(100vw-520px)]">
              <button
                v-for="tab in openTabs"
                :key="tab.id"
                @click="activeTabId = tab.id"
                class="group flex h-full min-w-[132px] sm:min-w-[180px] items-center gap-2 border-r border-[#2d2d2d] px-2.5 sm:px-3 py-2 text-xs transition-colors relative"
                :class="activeTabId === tab.id ? 'bg-[#1e1e1e] text-white border-t-2 border-t-[#007acc]' : 'bg-[#252526] text-gray-400 hover:bg-[#2a2a2a]'"
              >
                <span :class="getFileIconClass(tab.file)" class="text-[11px]">{{ getFileIcon(tab.file) }}</span>
                <span class="truncate">{{ tab.mobileLabel }}</span>
                <span
                  @click.stop="closeTab(tab.id)"
                  class="ml-auto flex h-4 w-4 items-center justify-center rounded text-gray-500 transition-colors hover:bg-[#444] hover:text-white"
                  :class="activeTabId === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 hidden sm:flex'"
                >
                  ×
                </span>
              </button>
            </div>
          </div>

          <div class="flex items-center gap-2 sm:gap-3 pr-1 sm:pr-2">
            <span v-if="currentProject" class="hidden rounded-full border border-[#2d2d2d] px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-gray-400 md:inline-flex">
              {{ currentProject.status }}
            </span>
            <button
              @click="runProject"
              title="Run Project Check"
              class="flex items-center gap-1.5 rounded px-2.5 sm:px-3 py-1.5 transition-all active:scale-95"
              :class="isRunning ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-green-600 text-white hover:bg-green-500'"
            >
              <span class="text-[10px]">{{ isRunning ? '■' : '▶' }}</span>
              <span class="text-xs font-bold">{{ isRunning ? 'Stop' : 'Run' }}</span>
            </button>
          </div>
        </div>

        <div class="lg:hidden border-t border-[#252526] px-3 py-2">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="truncate text-sm font-semibold text-white">{{ currentProject?.name || 'Workspace' }}</div>
              <div class="mt-1 truncate text-[11px] uppercase tracking-[0.18em] text-gray-500">
                {{ currentProject?.status || 'Idle' }} · {{ activeTab?.file?.name || 'README.md' }}
              </div>
            </div>
            <button
              @click="isMobileInspectorOpen = !isMobileInspectorOpen"
              class="shrink-0 rounded border border-[#2d2d2d] px-2 py-1 text-[11px] uppercase tracking-[0.16em] text-gray-300"
            >
              {{ isMobileInspectorOpen ? 'Hide Info' : 'Project Info' }}
            </button>
          </div>
          <div class="mt-2 flex flex-wrap gap-2">
            <span
              v-for="item in currentProject?.stack?.slice(0, 3) || []"
              :key="item"
              class="rounded bg-[#0f2c3f] px-2 py-1 text-[11px] text-[#8fd4ff]"
            >
              {{ item }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <template #sidebar>
      <IDEExplorer
        :projects="projectsData"
        :expandedFolders="expandedFolders"
        :activeTabId="activeTabId"
        :width="sidebarWidth"
        :isMobileOpen="isMobileExplorerOpen"
        @toggle-folder="toggleProjectFolder"
        @open-file="openFile"
        @resize-start="startResize"
        @toggle-explorer="toggleExplorer"
        @close-mobile="isMobileExplorerOpen = false"
      />
    </template>

    <template #editor>
      <div class="flex h-full min-h-0 flex-col">
        <div class="flex min-h-0 flex-1 flex-col lg:flex-row">
          <IDEEditor
            :activeTab="activeTab"
            class="min-h-0 min-w-0 flex-1"
            @update-line-count="(count) => lineCount = count"
          />

          <IDEProjectInspector :project="currentProject" />
        </div>

        <div class="lg:hidden border-t border-[#2d2d2d] bg-[#181818]">
          <button
            @click="isMobileInspectorOpen = !isMobileInspectorOpen"
            class="flex w-full items-center justify-between px-4 py-3 text-xs uppercase tracking-[0.2em] text-gray-400"
          >
            <span>Project Inspector</span>
            <span>{{ isMobileInspectorOpen ? '−' : '+' }}</span>
          </button>
          <IDEProjectInspector v-if="isMobileInspectorOpen" :project="currentProject" mobile />
        </div>
      </div>
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
      <IDEStatusBar :activeTab="activeTab" :lineCount="lineCount" :currentProject="currentProject" />
    </template>
  </IDEWindow>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { projects } from '@/data/portfolio'

import IDEWindow from '@/components/ide/IDEWindow.vue'
import IDEExplorer from '@/components/ide/IDEExplorer.vue'
import IDEEditor from '@/components/ide/IDEEditor.vue'
import IDETerminal from '@/components/ide/IDETerminal.vue'
import IDEStatusBar from '@/components/ide/IDEStatusBar.vue'
import IDEProjectInspector from '@/components/ide/IDEProjectInspector.vue'

const MAX_TABS = 3

const props = defineProps({
  initialProjectId: {
    type: String,
    default: ''
  },
  initialFileName: {
    type: String,
    default: 'README.md'
  }
})

const slugify = (value = '') => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const normalizeFileType = (file = {}) => {
  if (file.type) return file.type
  if (file.name?.endsWith('.json')) return 'json'
  return 'markdown'
}

const createFallbackFiles = (project) => {
  const stackContent = {
    name: project.name,
    status: project.status,
    role: project.role,
    stack: project.stack,
    features: ['Project Overview', 'Roadmap', 'Documentation Workspace']
  }

  return [
    {
      name: 'README.md',
      type: 'markdown',
      content: `# ${project.name}

${project.summary}

## Why

继续整理这个项目的目标、价值和边界。

## Core Modules

- Overview
- Documentation
- Delivery

## My Role

${project.role.join(' / ')}

## Current Status

${project.status}
`
    },
    {
      name: 'roadmap.md',
      type: 'markdown',
      content: `# Roadmap

## Phase 1

- Clarify project structure
- Improve presentation order

## Phase 2

- Fill data and workflows
- Tighten delivery details
`
    },
    {
      name: 'architecture.md',
      type: 'markdown',
      content: `# Architecture

- UI layer
- Data layer
- Delivery workflow
`
    },
    {
      name: 'stack.json',
      type: 'json',
      content: stackContent
    },
    {
      name: 'changelog.md',
      type: 'markdown',
      content: `# Changelog

- Workspace content prepared
- Project summary normalized
`
    }
  ]
}

const createFallbackTerminalOutput = (project) => [
  '> npm run inspect:project',
  'Loading project metadata...',
  'Checking modules...',
  'Core Module ........ ready',
  'Delivery Layer ..... building',
  `Project status: ${project.status}`,
  'Next step: fill project-specific documentation'
]

const normalizeProject = (project, index) => {
  const name = project.name || project.title || `Project ${index + 1}`
  const folderName = project.folderName || slugify(name)
  const stack = Array.isArray(project.stack) && project.stack.length ? project.stack : (project.technologies || [])
  const role = Array.isArray(project.role) && project.role.length
    ? project.role
    : ['Product Structure', 'Frontend Development']
  const status = project.status || 'Building'
  const summary = project.summary || project.description || 'Project summary is being prepared.'
  const links = Array.isArray(project.links) && project.links.length
    ? project.links
    : [
        ...(project.demo ? [{ label: 'Live Demo', url: project.demo }] : []),
        ...(project.github ? [{ label: 'Source Repo', url: project.github }] : [])
      ]
  const progress = Array.isArray(project.progress) && project.progress.length
    ? project.progress
    : [
        { label: 'Structure', value: 60 },
        { label: 'Data Layer', value: 40 },
        { label: 'Polish', value: 30 }
      ]
  const normalizedProject = {
    ...project,
    id: project.id || folderName,
    name,
    title: name,
    folderName,
    status,
    summary,
    description: summary,
    role,
    stack,
    technologies: Array.isArray(project.technologies) && project.technologies.length ? project.technologies : stack,
    links,
    progress,
    updatedAt: project.updatedAt || '2026-04'
  }

  normalizedProject.files = Array.isArray(project.files) && project.files.length
    ? project.files.map((file) => ({
        ...file,
        type: normalizeFileType(file)
      }))
    : createFallbackFiles(normalizedProject)

  normalizedProject.terminalOutput = Array.isArray(project.terminalOutput) && project.terminalOutput.length
    ? project.terminalOutput
    : createFallbackTerminalOutput(normalizedProject)

  return normalizedProject
}

const projectsData = computed(() => projects.map(normalizeProject))
const expandedFolders = ref({ root: true })
const activeTabId = ref(null)
const openTabs = ref([])
const selectedProjectId = ref(null)
const activeTab = computed(() => openTabs.value.find((tab) => tab.id === activeTabId.value) || null)
const currentProject = computed(() => {
  if (activeTab.value?.project) return activeTab.value.project
  return projectsData.value.find((project) => project.id === selectedProjectId.value) || projectsData.value[0] || null
})

const isMobileExplorerOpen = ref(false)
const isMobileInspectorOpen = ref(false)
const isTerminalOpen = ref(false)
const isRunning = ref(false)
const terminalLogs = ref([])
const sidebarWidth = ref(250)
const isResizing = ref(false)
const lineCount = ref(1)
let runToken = 0

const toggleExplorer = () => {}

const getDefaultFile = (project) => project?.files?.find((file) => file.name === 'README.md') || project?.files?.[0] || null
const findProjectById = (projectId) => projectsData.value.find((project) => project.id === projectId) || null
const getProjectFile = (project, fileName) => {
  if (!project) return null
  return project.files.find((file) => file.name === fileName) || getDefaultFile(project)
}

const toggleProjectFolder = (id) => {
  expandedFolders.value[id] = !expandedFolders.value[id]
  if (id !== 'root') selectedProjectId.value = id
}

const openFile = (project, file) => {
  if (!project || !file) return

  selectedProjectId.value = project.id
  isMobileExplorerOpen.value = false

  const id = `${project.id}:${file.name}`
  const existing = openTabs.value.find((tab) => tab.id === id)

  if (existing) {
    activeTabId.value = id
    return
  }

  if (openTabs.value.length >= MAX_TABS) {
    const removableIndex = openTabs.value.findIndex((tab) => tab.id !== activeTabId.value)
    openTabs.value.splice(removableIndex === -1 ? 0 : removableIndex, 1)
  }

  openTabs.value.push({
    id,
    name: file.name,
    label: `${project.folderName} / ${file.name}`,
    mobileLabel: file.name,
    file,
    project
  })
  activeTabId.value = id
}

const closeTab = (id) => {
  const idx = openTabs.value.findIndex((tab) => tab.id === id)
  if (idx === -1) return

  const closedTab = openTabs.value[idx]
  openTabs.value.splice(idx, 1)
  if (activeTabId.value === id) {
    activeTabId.value = openTabs.value[Math.max(0, idx - 1)]?.id || null
  }
  if (!activeTabId.value && closedTab?.project) {
    selectedProjectId.value = closedTab.project.id
  }
}

const openProjectSelection = (projectId, fileName) => {
  const project = findProjectById(projectId) || projectsData.value[0] || null
  if (!project) return

  expandedFolders.value.root = true
  expandedFolders.value[project.id] = true

  const file = getProjectFile(project, fileName || props.initialFileName)
  if (!file) return

  openFile(project, file)
}

const startResize = () => {
  isResizing.value = true
  document.body.style.cursor = 'col-resize'
}

const stopResize = () => {
  isResizing.value = false
  document.body.style.cursor = ''
}

const handleResize = (event) => {
  if (!isResizing.value) return

  const container = document.querySelector('.ide-container')
  if (!container) return

  const rect = container.getBoundingClientRect()
  const nextWidth = event.clientX - rect.left
  sidebarWidth.value = Math.max(180, Math.min(nextWidth, 420))
}

const getFileIcon = (file) => (file?.type === 'json' ? '{}' : 'MD')

const getFileIconClass = (file) => (file?.type === 'json' ? 'text-red-400' : 'text-blue-400')

const getLogStyle = (line) => {
  if (line.startsWith('>')) return 'text-gray-400'
  if (line.includes('ready')) return 'text-emerald-300'
  if (line.includes('building') || line.includes('refining') || line.includes('syncing')) return 'text-amber-300'
  if (line.startsWith('Project status:')) return 'text-sky-300'
  if (line.startsWith('Next step:')) return 'text-white'
  return ''
}

const addLog = (text) => {
  terminalLogs.value.push({ text, style: getLogStyle(text) })
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const runProject = async () => {
  if (isRunning.value) {
    runToken += 1
    addLog('^C')
    isRunning.value = false
    return
  }

  const project = currentProject.value
  isTerminalOpen.value = true
  terminalLogs.value = []

  if (!project) {
    addLog('> No project selected')
    return
  }

  isRunning.value = true
  const token = ++runToken

  for (const line of project.terminalOutput) {
    if (token !== runToken) return
    addLog(line)
    await delay(line.startsWith('>') ? 180 : 320)
  }

  if (token === runToken) {
    isRunning.value = false
  }
}

watch(
  [projectsData, () => props.initialProjectId, () => props.initialFileName],
  ([availableProjects, projectId, fileName]) => {
    if (!availableProjects.length) return
    openProjectSelection(projectId, fileName)
  },
  { immediate: true }
)
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
