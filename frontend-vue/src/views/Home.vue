<template>
  <div class="portfolio-home">
    <!-- Mouse Spotlight Effect -->
    <MouseSpotlight />
    
    <!-- Desktop: Left-Right Split Layout -->
    <div class="layout-container">
      <!-- Left Sidebar (Fixed) -->
      <Sidebar :active-section="activeSection" />
      
      <!-- Right Content (Scrollable) -->
      <main ref="scrollContainerRef" class="main-content">
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        
        <!-- Blog Section (LatestPosts) -->
        <LatestPosts />
        
        <ContactSection />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { navItems } from '@/data/portfolio'
import { useScrollSpy } from '@/composables/useScrollSpy'

// Import components
import MouseSpotlight from '@/components/shared/MouseSpotlight.vue'
import Sidebar from '@/components/home/Sidebar.vue'
import AboutSection from '@/components/home/sections/AboutSection.vue'
import ExperienceSection from '@/components/home/sections/ExperienceSection.vue'
import ProjectsSection from '@/components/home/sections/ProjectsSection.vue'
import ContactSection from '@/components/home/sections/ContactSection.vue'
import LatestPosts from '@/components/shared/LatestPosts.vue'

// Create ref for scroll container
const scrollContainerRef = ref(null)

// Use scroll spy composable for navigation highlighting
const activeSection = useScrollSpy({
  items: navItems,
  container: scrollContainerRef
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
