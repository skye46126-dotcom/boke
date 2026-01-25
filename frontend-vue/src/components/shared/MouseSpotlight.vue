<template>
  <div class="mouse-spotlight" ref="spotlightRef"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const spotlightRef = ref(null)
const mouseX = ref(0)
const mouseY = ref(0)

const updateSpotlight = (e) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
  
  if (spotlightRef.value) {
    spotlightRef.value.style.background = `radial-gradient(
      600px circle at ${mouseX.value}px ${mouseY.value}px,
      rgba(0, 220, 130, 0.15),
      transparent 80%
    )`
  }
}

onMounted(() => {
  window.addEventListener('mousemove', updateSpotlight)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateSpotlight)
})
</script>

<style scoped>
.mouse-spotlight {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  transition: background 0.1s ease;
}
</style>
