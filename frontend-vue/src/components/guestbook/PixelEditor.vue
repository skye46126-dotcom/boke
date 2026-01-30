<template>
  <div class="pixel-editor flex flex-col items-center gap-4">
    <!-- Tools & Palette -->
    <div class="flex flex-wrap items-center gap-4 justify-center w-full px-2">
      <!-- Color Palette: 4x4 Grid or wrap -->
      <div class="palette grid grid-cols-8 sm:grid-cols-4 gap-1 bg-gh-bg border border-gh-border p-2 rounded-lg shrink-0">
        <button
          v-for="color in palette"
          :key="color"
          class="w-8 h-8 rounded border transition-transform hover:scale-110 shrink-0"
          :class="{ 'ring-2 ring-offset-2 ring-vp-c-brand': selectedColor === color, 'border-gh-border': color === 'transparent' }"
          :style="{ backgroundColor: color }"
          @click="selectedColor = color"
          :title="color"
        ></button>
      </div>
      
      <div class="tools flex gap-2">
        <button 
          @click="clearCanvas"
          class="px-4 py-2 text-xs border border-gh-border rounded bg-gh-card hover:bg-gh-bg transition active:scale-95"
        >
          🗑️ Clear
        </button>
      </div>
    </div>

    <!-- Canvas Grid -->
    <div 
      class="canvas-grid grid border border-gh-border shadow-lg cursor-crosshair touch-none select-none"
      :style="{
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        maxWidth: '100%',
        width: '320px',
        aspectRatio: '1/1',
        height: 'auto'
      }"
      @mousedown="startDrawing"
      @mouseenter="handleMouseEnter"
      @mouseup="stopDrawing"
      @mouseleave="stopDrawing"
      @touchstart.passive="handleTouchStart"
      @touchmove.prevent="handleTouchMove"
      @touchend="stopDrawing"
    >
      <div
        v-for="(pixel, index) in pixels"
        :key="index"
        class="pixel w-full h-full border-[0.5px] border-gh-border/20 transition-colors duration-75"
        :style="{ backgroundColor: pixel }"
        @mousedown.prevent="drawPixel(index)"
        @mouseenter.prevent="drawPixel(index)"
      ></div>
    </div>

    <p class="text-xs text-gh-text-muted">
      Values: 16x16 Grid • Left click + Drag to draw
    </p>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  size: {
    type: Number,
    default: 16
  }
})

const emit = defineEmits(['update:pixels'])

// PICO-8 Palette (Iconic 16 colors) + Transparent/White
const palette = [
  '#000000', // Black
  '#1D2B53', // Dark Blue
  '#7E2553', // Dark Purple
  '#008751', // Dark Green
  '#AB5236', // Brown
  '#5F574F', // Dark Gray
  '#C2C3C7', // Light Gray
  '#FFF1E8', // White/Peach
  '#FF004D', // Red
  '#FFA300', // Orange
  '#FFEC27', // Yellow
  '#00E436', // Green
  '#29ADFF', // Blue
  '#83769C', // Indigo
  '#FF77A8', // Pink
  '#FFCCAA', // Peach
]

const selectedColor = ref(palette[0])
const isDrawing = ref(false)

// Initialize blank canvas (white or transparent)
const pixels = reactive(new Array(props.size * props.size).fill('#FFFFFF'))

const startDrawing = () => {
  isDrawing.value = true
}

const stopDrawing = () => {
  isDrawing.value = false
}

const drawPixel = (index) => {
  if (isDrawing.value || (event && event.type === 'mousedown')) {
    if (pixels[index] !== selectedColor.value) {
      pixels[index] = selectedColor.value
      emit('update:pixels', pixels)
    }
  }
}

const handleTouchStart = (e) => {
  isDrawing.value = true
  handleTouchMove(e)
}

const handleTouchMove = (e) => {
  if (!isDrawing.value) return
  
  const touch = e.touches[0]
  const element = document.elementFromPoint(touch.clientX, touch.clientY)
  
  if (element && element.classList.contains('pixel')) {
    // Find the index of the pixel element
    const pixelElements = Array.from(e.currentTarget.querySelectorAll('.pixel'))
    const index = pixelElements.indexOf(element)
    if (index !== -1) {
      drawPixel(index)
    }
  }
}

const handleMouseEnter = (e) => {
  // Only continue drawing if mouse button is held down (buttons === 1 is left click)
  if (e.buttons === 1) {
    isDrawing.value = true
  } else {
    isDrawing.value = false
  }
}

const clearCanvas = () => {
  // Reset to White
  for (let i = 0; i < pixels.length; i++) {
    pixels[i] = '#FFFFFF'
  }
  emit('update:pixels', pixels)
}

// Helper to generate Base64 Image
const generateImage = async () => {
  const canvas = document.createElement('canvas')
  canvas.width = props.size
  canvas.height = props.size
  const ctx = canvas.getContext('2d')
  
  pixels.forEach((color, i) => {
    const x = i % props.size
    const y = Math.floor(i / props.size)
    ctx.fillStyle = color
    ctx.fillRect(x, y, 1, 1)
  })
  
  // Return a larger image for better visibility (scaled up)
  const scaledCanvas = document.createElement('canvas')
  scaledCanvas.width = props.size * 10
  scaledCanvas.height = props.size * 10
  const scaledCtx = scaledCanvas.getContext('2d')
  scaledCtx.imageSmoothingEnabled = false
  scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height)
  
  return scaledCanvas.toDataURL('image/png')
}

defineExpose({
  generateImage,
  pixels
})
</script>

<style scoped>
.pixel:hover {
  border-color: rgba(0,0,0,0.2);
  z-index: 1;
}
</style>
