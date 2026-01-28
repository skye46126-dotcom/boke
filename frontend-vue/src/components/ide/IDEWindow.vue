<template>
  <div class="ide-container bg-gh-bg border border-gh-border rounded-lg overflow-hidden flex flex-col h-full shadow-2xl relative">
    <!-- Header Slot -->
    <slot name="header"></slot>

    <!-- Main Body -->
    <div class="flex flex-1 overflow-hidden relative" @mouseup="onMouseUp" @mousemove="onMouseMove">
      <!-- Sidebar Slot -->
      <slot name="sidebar"></slot>

      <!-- Editor Area -->
      <div class="ide-editor flex-1 bg-[#1e1e1e] flex flex-col overflow-hidden relative">
        <slot name="editor"></slot>
      </div>
      
      <!-- Terminal Slot (Overlay) -->
      <slot name="terminal"></slot>
    </div>

    <!-- Status Bar Slot -->
    <slot name="footer"></slot>
  </div>
</template>

<script setup>
const emit = defineEmits(['resize-move', 'resize-end'])

const onMouseMove = (e) => emit('resize-move', e)
const onMouseUp = () => emit('resize-end')
</script>

<style scoped>
.ide-container {
  font-family: 'JetBrains Mono', Consolas, monospace;
}
</style>
