<template>
  <div class="cursor-container" v-if="!isMobile">
    <!-- 外环（慢速跟随，空心圆环） -->
    <div 
      ref="outerCursor"
      class="cursor-outer"
      :class="{ 'cursor-hover': isHovering, 'cursor-click': isClicking }"
    ></div>
    
    <!-- 内点（快速跟随，变形） -->
    <div 
      ref="innerCursor"
      class="cursor-inner"
      :class="{ 'cursor-hover': isHovering }"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const outerCursor = ref(null)
const innerCursor = ref(null)
const isHovering = ref(false)
const isClicking = ref(false)
const isMobile = ref(false)

// 鼠标位置
const mouse = {
  x: 0,
  y: 0
}

// 当前光标位置（用于平滑跟随）
const outerPos = {
  x: 0,
  y: 0
}

const innerPos = {
  x: 0,
  y: 0
}

// 性能优化：检测是否静止
let isMoving = false
let idleTimer = null

// 线性插值函数（平滑跟随）
const lerp = (start, end, factor) => {
  return start + (end - start) * factor
}

// 更新光标位置
let animationFrameId = null

const updateCursor = () => {
  // 计算当前位置到目标位置的距离
  const outerDist = Math.abs(outerPos.x - mouse.x) + Math.abs(outerPos.y - mouse.y)
  const innerDist = Math.abs(innerPos.x - mouse.x) + Math.abs(innerPos.y - mouse.y)
  
  // 如果距离很小（<0.5px），认为已经到达目标，停止动画
  if (outerDist < 0.5 && innerDist < 0.5) {
    isMoving = false
    outerPos.x = mouse.x
    outerPos.y = mouse.y
    innerPos.x = mouse.x
    innerPos.y = mouse.y
    
    // 最后一次更新位置
    if (outerCursor.value) {
      outerCursor.value.style.transform = `translate3d(${outerPos.x}px, ${outerPos.y}px, 0)`
    }
    if (innerCursor.value) {
      innerCursor.value.style.transform = `translate3d(${innerPos.x}px, ${innerPos.y}px, 0)`
    }
    
    return // 停止动画循环
  }
  
  // 外环慢速跟随（0.08）
  outerPos.x = lerp(outerPos.x, mouse.x, 0.08)
  outerPos.y = lerp(outerPos.y, mouse.y, 0.08)
  
  // 内点快速跟随（0.15）
  innerPos.x = lerp(innerPos.x, mouse.x, 0.15)
  innerPos.y = lerp(innerPos.y, mouse.y, 0.15)
  
  // 使用 transform（GPU加速）
  if (outerCursor.value) {
    outerCursor.value.style.transform = `translate3d(${outerPos.x}px, ${outerPos.y}px, 0)`
  }
  
  if (innerCursor.value) {
    innerCursor.value.style.transform = `translate3d(${innerPos.x}px, ${innerPos.y}px, 0)`
  }
  
  // 持续动画
  animationFrameId = requestAnimationFrame(updateCursor)
}

// 启动动画（仅在移动时）
const startAnimation = () => {
  if (!isMoving) {
    isMoving = true
    animationFrameId = requestAnimationFrame(updateCursor)
  }
}

// 鼠标移动事件（优化：使用被动监听器）
const handleMouseMove = (e) => {
  mouse.x = e.clientX
  mouse.y = e.clientY
  
  // 启动动画
  startAnimation()
  
  // 清除空闲计时器
  if (idleTimer) {
    clearTimeout(idleTimer)
  }
}

// 优化：使用事件委托检测可交互元素
let currentHoverElement = null

const checkHoverable = (element) => {
  if (!element) return false
  
  return (
    element.tagName === 'A' ||
    element.tagName === 'BUTTON' ||
    element.classList.contains('clickable') ||
    element.classList.contains('nav-item') ||
    element.classList.contains('project-link') ||
    element.classList.contains('social-link')
  )
}

const handleMouseOver = (e) => {
  const target = e.target
  
  // 检查自己或最近的可交互父元素
  let element = target
  while (element && element !== document.body) {
    if (checkHoverable(element)) {
      if (currentHoverElement !== element) {
        currentHoverElement = element
        isHovering.value = true
      }
      return
    }
    element = element.parentElement
  }
  
  // 没有找到可交互元素
  if (currentHoverElement) {
    currentHoverElement = null
    isHovering.value = false
  }
}

// 点击效果
const handleMouseDown = () => {
  isClicking.value = true
}

const handleMouseUp = () => {
  isClicking.value = false
}

// 检测是否移动设备
const checkMobile = () => {
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.matchMedia('(hover: none)').matches
}

onMounted(() => {
  checkMobile()
  
  if (!isMobile.value) {
    // 监听事件（使用 passive 优化滚动性能）
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseover', handleMouseOver, { passive: true })
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    
    // 初始化位置
    mouse.x = window.innerWidth / 2
    mouse.y = window.innerHeight / 2
    outerPos.x = mouse.x
    outerPos.y = mouse.y
    innerPos.x = mouse.x
    innerPos.y = mouse.y
  }
})

onUnmounted(() => {
  if (!isMobile.value) {
    window.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseover', handleMouseOver)
    document.removeEventListener('mousedown', handleMouseDown)
    document.removeEventListener('mouseup', handleMouseUp)
    
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
    
    if (idleTimer) {
      clearTimeout(idleTimer)
    }
  }
})
</script>

<style scoped>
.cursor-container {
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
}

/* 外环（空心圆环，渐变色） */
.cursor-outer {
  position: fixed;
  width: 40px;
  height: 40px;
  margin-left: -20px;
  margin-top: -20px;
  border: 2px solid transparent;
  border-radius: 50%;
  background: linear-gradient(135deg, #00dc82, #a855f7) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
  opacity: 0.6;
}

/* Hover 时外环放大 */
.cursor-outer.cursor-hover {
  width: 60px;
  height: 60px;
  margin-left: -30px;
  margin-top: -30px;
  opacity: 0.8;
}

/* 点击时 pulse 效果 */
.cursor-outer.cursor-click {
  animation: cursor-pulse 0.5s ease-out;
}

@keyframes cursor-pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
  }
}

/* 内点（快速跟随） */
.cursor-inner {
  position: fixed;
  width: 8px;
  height: 8px;
  margin-left: -4px;
  margin-top: -4px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00dc82, #a855f7);
  transition: all 0.15s ease-out;
  will-change: transform;
  box-shadow: 0 0 10px rgba(0, 220, 130, 0.5);
}

/* Hover 时内点变形 */
.cursor-inner.cursor-hover {
  width: 4px;
  height: 4px;
  margin-left: -2px;
  margin-top: -2px;
  transform: scale(0.5);
}
</style>
