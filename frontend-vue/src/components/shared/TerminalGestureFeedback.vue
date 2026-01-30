<template>
  <Transition name="fade">
    <div v-if="active" class="fixed inset-0 z-40 pointer-events-none overflow-hidden bg-black/20">
      <canvas ref="canvasRef" class="w-full h-full opacity-60"></canvas>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  active: Boolean
})

const canvasRef = ref(null)
let animationId = null

const startAnimation = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const characters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const fontSize = 14
  const columns = canvas.width / fontSize
  const drops = Array(Math.floor(columns)).fill(0)

  const draw = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#3eaf7c' // Brand color
    ctx.font = `${fontSize}px monospace`

    for (let i = 0; i < drops.length; i++) {
      const text = characters.charAt(Math.floor(Math.random() * characters.length))
      ctx.fillText(text, i * fontSize, drops[i] * fontSize)

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0
      }
      drops[i]++
    }
    animationId = requestAnimationFrame(draw)
  }
  
  draw()
}

const stopAnimation = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

watch(() => props.active, (newVal) => {
  if (newVal) {
    nextTick(() => startAnimation())
  } else {
    stopAnimation()
  }
})

onUnmounted(() => {
  stopAnimation()
})

// need nextTick
import { nextTick } from 'vue'
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
