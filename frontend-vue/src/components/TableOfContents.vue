<template>
  <nav class="toc sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
    <div class="text-sm font-semibold text-gh-text mb-3">On this page</div>
    
    <!-- 滑块指示器（Stripe 风格） -->
    <div class="relative">
      <div
        :style="{ top: `${indicatorTop}px`, height: `${indicatorHeight}px` }"
        class="absolute left-0 w-0.5 bg-vp-c-brand transition-all duration-300"
      ></div>
      
      <ul class="space-y-2 border-l-2 border-gh-border pl-4">
        <li v-for="(heading, index) in headings" :key="heading.id">
          <a
            :ref="el => linkRefs[index] = el"
            :href="`#${heading.id}`"
            :class="[
              'block text-sm transition-colors py-1',
              activeId === heading.id 
                ? 'text-vp-c-brand font-medium' 
                : 'text-gh-text-muted hover:text-vp-c-brand',
              heading.level === 3 && 'ml-3'
            ]"
            @click.prevent="scrollToHeading(heading.id)"
          >
            {{ heading.text }}
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  headings: Array
})

const activeId = ref('')
const linkRefs = ref([])
const indicatorTop = ref(0)
const indicatorHeight = ref(0)

let observer = null

onMounted(() => {
  if (!props.headings.length) return

  // Wait for DOM update
  setTimeout(() => {
    const headingElements = props.headings
      .map(h => document.getElementById(h.id))
      .filter(Boolean)

    if (headingElements.length === 0) return

    observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(e => e.isIntersecting)
        if (visibleEntries.length) {
          const topEntry = visibleEntries.reduce((top, entry) => 
            entry.boundingClientRect.top < top.boundingClientRect.top ? entry : top
          )
          activeId.value = topEntry.target.id
        }
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: [0, 1]
      }
    )

    headingElements.forEach(el => observer.observe(el))
    
    // Set initial active if not set
    if (!activeId.value && headingElements.length > 0) {
      activeId.value = headingElements[0].id
    }
  }, 500) // Small delay to ensure content is rendered
})

// Update slider position
watch(activeId, () => {
  const activeIndex = props.headings.findIndex(h => h.id === activeId.value)
  if (activeIndex !== -1 && linkRefs.value[activeIndex]) {
    const linkEl = linkRefs.value[activeIndex]
    indicatorTop.value = linkEl.offsetTop
    indicatorHeight.value = linkEl.offsetHeight
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

function scrollToHeading(id) {
  const element = document.getElementById(id)
  if (element) {
    const offset = 80
    const top = element.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
    activeId.value = id
  }
}
</script>

<style scoped>
.toc::-webkit-scrollbar {
  width: 4px;
}

.toc::-webkit-scrollbar-thumb {
  background-color: var(--color-gh-border);
  border-radius: 9999px;
}
</style>
