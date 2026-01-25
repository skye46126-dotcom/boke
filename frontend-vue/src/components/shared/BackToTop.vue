<template>
  <Transition name="fade">
    <button
      v-if="showButton"
      @click="scrollToTop"
      class="back-to-top"
      aria-label="Back to top"
    >
      <ChevronUp :size="24" />
    </button>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
import { useScroll } from '@vueuse/core'
import { ChevronUp } from 'lucide-vue-next'

const { y } = useScroll(window)
const showButton = ref(false)

// Show button when scrolled down 300px
const checkScroll = () => {
  showButton.value = y.value > 300
}

// Watch scroll position
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', checkScroll)
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: var(--color-vp-c-brand);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  z-index: 1000;
}

.back-to-top:hover {
  background: var(--color-vp-c-brand-light);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

.back-to-top:active {
  transform: translateY(0);
}

/* Mobile optimization */
@media (max-width: 768px) {
  .back-to-top {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 2.75rem;
    height: 2.75rem;
  }
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
