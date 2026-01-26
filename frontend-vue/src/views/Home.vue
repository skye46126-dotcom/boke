<template>
  <div class="portfolio-home">
    <!-- Mouse Spotlight Effect -->
    <MouseSpotlight />
    
    <!-- Desktop: Left-Right Split Layout -->
    <div class="layout-container">
      <!-- Left Sidebar (Fixed) -->
      <Sidebar :active-section="activeSection" />
      
      <!-- Right Content (Scrollable) -->
      <main class="main-content">
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        
        <!-- Blog Section (LatestPosts) -->
        <section id="blog" class="content-section">
          <LatestPosts />
        </section>
        
        <ContactSection />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { navItems } from '@/data/portfolio'

// Import components
import MouseSpotlight from '@/components/shared/MouseSpotlight.vue'
import Sidebar from '@/components/home/Sidebar.vue'
import AboutSection from '@/components/home/sections/AboutSection.vue'
import ExperienceSection from '@/components/home/sections/ExperienceSection.vue'
import ProjectsSection from '@/components/home/sections/ProjectsSection.vue'
import ContactSection from '@/components/home/sections/ContactSection.vue'
import LatestPosts from '@/components/shared/LatestPosts.vue'

// Active section tracking
const activeSection = ref('about')

// IntersectionObserver for navigation highlighting
let observer = null

onMounted(() => {
  // Get the scrollable container
  // Note: There are two .main-content elements, we need the second one (the scrollable one)
  const containers = document.querySelectorAll('.main-content')
  const scrollContainer = containers.length > 1 ? containers[1] : containers[0]
  
  if (!scrollContainer) {
    console.error('Scroll container .main-content not found')
    return
  }
  
  observer = new IntersectionObserver(
    (entries) => {
      // Check if we're at the bottom of the scroll container FIRST
      // This takes priority over all other highlighting logic
      const isAtBottom = Math.abs(
        scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight
      ) < 50  // Within 50px of bottom
      
      if (isAtBottom) {
        // Force highlight the last navigation item when at bottom
        const lastNavId = navItems[navItems.length - 1].id
        activeSection.value = lastNavId
        return
      }
      
      // Filter to only intersecting entries
      const intersecting = entries
        .filter(entry => entry.isIntersecting)
        .map(entry => ({
          id: entry.target.id,
          ratio: entry.intersectionRatio,
          top: entry.boundingClientRect.top,
          bottom: entry.boundingClientRect.bottom
        }))
      
      // If we have intersecting sections, find the most prominent one
      if (intersecting.length > 0) {
        // Find the section with highest visibility and closest to top
        intersecting.sort((a, b) => {
          // Prioritize sections with significant visibility (>10%)
          if (Math.abs(a.ratio - b.ratio) > 0.1) {
            return b.ratio - a.ratio
          }
          // If similar visibility, choose the one closer to the top
          return a.top - b.top
        })
        
        activeSection.value = intersecting[0].id
      }
    },
    {
      root: scrollContainer,
      threshold: [0, 0.1, 0.25, 0.4, 0.6, 0.8, 1],  // More granular thresholds
      rootMargin: '-5% 0px -40% 0px'  // Adjust trigger zone
    }
  )
  
  // Observe each section
  navItems.forEach(item => {
    const section = document.getElementById(item.id)
    if (section) {
      observer.observe(section)
    }
  })
  
  // Listen to container scroll to detect when at bottom
  // This is especially important for the last section (Contact)
  const handleScroll = () => {
    // Check if we're near the bottom of the scroll container
    const scrollHeight = scrollContainer.scrollHeight
    const scrollTop = scrollContainer.scrollTop
    const clientHeight = scrollContainer.clientHeight
    
    const isNearBottom = (scrollHeight - scrollTop - clientHeight) < 50
    
    if (isNearBottom) {
      // Force highlight the last navigation item when at bottom
      const lastNavId = navItems[navItems.length - 1].id
      if (document.getElementById(lastNavId)) {
        activeSection.value = lastNavId
      }
    }
  }
  
  scrollContainer.addEventListener('scroll', handleScroll)
  
  // Clean up on unmount
  const cleanup = () => {
    scrollContainer.removeEventListener('scroll', handleScroll)
  }
  
  return cleanup
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.portfolio-home {
  min-height: 100vh;
  height: 100vh;
  background: var(--color-gh-bg);
  color: var(--color-gh-text);
  position: relative;
  overflow: hidden;
}

.layout-container {
  display: flex;
  max-width: 1920px;
  margin: 0 auto;
  height: 100vh;
}

.main-content {
  width: 60%;
  padding: 6rem 4rem;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100vh;
}

.content-section {
  margin-bottom: 6rem;
}

/* Custom scrollbar for main content */
.main-content::-webkit-scrollbar {
  width: 8px;
}

.main-content::-webkit-scrollbar-track {
  background: transparent;
}

.main-content::-webkit-scrollbar-thumb {
  background: var(--color-gh-border);
  border-radius: 4px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: var(--color-gh-text-muted);
}

/* Mobile Responsive */
@media (max-width: 1023px) {
  .portfolio-home {
    height: auto;
    overflow: visible;
  }
  
  .layout-container {
    flex-direction: column;
    height: auto;
  }
  
  .main-content {
    width: 100%;
    padding: 3rem 2rem;
    overflow-y: visible;
    height: auto;
  }
}

@media (max-width: 640px) {
  .main-content {
    padding: 2rem 1.5rem;
  }
}
</style>
