<template>
  <div class="h-6 bg-[#007acc] px-3 text-xs text-white select-none z-30 shrink-0">
    <div class="flex h-full items-center justify-between gap-4">
      <div class="flex min-w-0 items-center gap-3 overflow-hidden">
        <span>main*</span>
        <span class="rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.16em]">{{ currentProject?.status || 'Idle' }}</span>
        <span class="hidden sm:inline">0 errors</span>
        <span class="hidden sm:inline">0 warnings</span>
      </div>

      <div class="hidden min-w-0 flex-1 items-center justify-center text-white/90 md:flex">
        <span class="truncate">{{ currentPath }}</span>
      </div>

      <div class="flex min-w-0 items-center gap-2 sm:gap-3 overflow-hidden">
        <span v-if="activeTab" class="hidden sm:inline">Ln {{ lineCount }}, Col 1</span>
        <span v-if="activeTab" class="truncate">{{ mobileFileLabel }}</span>
        <span class="hidden sm:inline truncate">{{ updatedLabel }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  activeTab: Object,
  lineCount: Number,
  currentProject: Object
})

const fileTypeLabel = computed(() => {
  if (props.activeTab?.file?.type === 'json') return 'JSON'
  if (props.activeTab?.file?.type === 'markdown') return 'Markdown'
  return 'Workspace'
})

const mobileFileLabel = computed(() => {
  if (!props.activeTab?.file) return 'Workspace'
  return `${props.activeTab.file.name} · ${fileTypeLabel.value}`
})

const currentPath = computed(() => {
  if (!props.activeTab?.project || !props.activeTab?.file) return props.currentProject?.name || 'Workspace'
  return `${props.activeTab.project.folderName} / ${props.activeTab.file.name}`
})

const updatedLabel = computed(() => {
  if (props.currentProject?.updatedAt) return `Updated ${props.currentProject.updatedAt}`
  return 'Updated recently'
})
</script>
