<template>
  <div 
    class="timeline-item"
    :class="{ 'is-visible': isVisible }"
    :style="{ '--index': index }"
  >
    <!-- Timeline Decoration -->
    <div class="timeline-marker">
      <div class="timeline-dot"></div>
      <div class="timeline-line" v-if="!isLast"></div>
    </div>
    
    <!-- Glassmorphism Card -->
    <div class="project-glass-card">
      <div class="glass-background"></div>
      
      <div class="glass-content">
        <!-- Project Header -->
        <div class="project-header">
          <span class="project-icon">{{ emoji }}</span>
          <h4 class="project-title">{{ title }}</h4>
        </div>
        
        <!-- Description -->
        <p class="project-description">{{ description }}</p>
        
        <!-- Technologies -->
        <div class="project-tech">
          <span 
            v-for="(tech, i) in technologies" 
            :key="tech"
            class="tech-item"
          >
            {{ tech }}
            <span v-if="i < technologies.length - 1" class="tech-divider">·</span>
          </span>
        </div>
        
        <!-- Links -->
        <div class="project-links">
          <a 
            v-if="github" 
            :href="github" 
            target="_blank" 
            rel="noopener noreferrer"
            class="project-link"
          >
            GitHub →
          </a>
          <a 
            v-if="demo" 
            :href="demo" 
            target="_blank" 
            rel="noopener noreferrer"
            class="project-link"
          >
            Live Demo →
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  emoji: {
    type: String,
    required: true
  },
  technologies: {
    type: Array,
    required: true
  },
  github: {
    type: String,
    default: null
  },
  demo: {
    type: String,
    default: null
  },
  index: {
    type: Number,
    default: 0
  },
  isLast: {
    type: Boolean,
    default: false
  }
})

const isVisible = ref(false)
const elementRef = ref(null)

// Intersection Observer for scroll-triggered animation
let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible.value = true
          // Once visible, stop observing
          if (observer && entry.target) {
            observer.unobserve(entry.target)
          }
        }
      })
    },
    {
      threshold: 0.2, // Trigger when 20% visible
      rootMargin: '0px'
    }
  )
  
  // Get the DOM element
  const element = document.querySelector(`.timeline-item:nth-child(${props.index + 1})`)
  if (element) {
    observer.observe(element)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
.timeline-item {
  position: relative;
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateX(-30px);
  transition: none;
}

/* Visible state with staggered animation */
.timeline-item.is-visible {
  animation: slide-in-left 0.6s ease-out forwards;
  animation-delay: calc(var(--index) * 0.15s);
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Timeline Marker */
.timeline-marker {
  position: relative;
  flex-shrink: 0;
  width: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Timeline Dot (Green initially) */
.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #00dc82;
  box-shadow: 0 0 10px rgba(0, 220, 130, 0.5);
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

/* Timeline Line (Connecting dots) */
.timeline-line {
  position: absolute;
  top: 12px;
  left: 50%;
  width: 2px;
  height: calc(100% + 2rem);
  transform: translateX(-50%);
  background: repeating-linear-gradient(
    to bottom,
    rgba(0, 220, 130, 0.3) 0px,
    rgba(0, 220, 130, 0.3) 4px,
    transparent 4px,
    transparent 8px
  );
  transition: background 0.3s ease;
}

/* Hover: Dot enlarges and glows more */
.timeline-item:hover .timeline-dot {
  width: 14px;
  height: 14px;
  background: #a855f7; /* Change to purple */
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.8);
}

/* Hover: Line changes to purple */
.timeline-item:hover .timeline-line {
  background: repeating-linear-gradient(
    to bottom,
    rgba(168, 85, 247, 0.5) 0px,
    rgba(168, 85, 247, 0.5) 4px,
    transparent 4px,
    transparent 8px
  );
}

/* Glassmorphism Card */
.project-glass-card {
  position: relative;
  flex: 1;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  
  /* Performance optimizations */
  contain: layout style paint;
  will-change: transform;
}

.project-glass-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
}

/* Fallback for browsers without backdrop-filter */
@supports not (backdrop-filter: blur(6px)) {
  .project-glass-card {
    background: rgba(22, 27, 34, 0.95);
  }
}

.glass-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.glass-content {
  position: relative;
  z-index: 1;
}

/* Project Header */
.project-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.project-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.project-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

/* Description */
.project-description {
  font-size: 0.875rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Technologies */
.project-tech {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #00dc82;
  margin-bottom: 1rem;
}

.tech-item {
  white-space: nowrap;
}

.tech-divider {
  color: rgba(255, 255, 255, 0.3);
  margin: 0 0.25rem;
}

/* Links */
.project-links {
  display: flex;
  gap: 1.5rem;
}

.project-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: #00dc82;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
}

.project-link:hover {
  background: linear-gradient(135deg, #00dc82, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transform: translateX(4px);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .timeline-item {
    gap: 1rem;
  }
  
  .timeline-marker {
    width: 8px;
  }
  
  .timeline-dot {
    width: 8px;
    height: 8px;
  }
  
  .timeline-item:hover .timeline-dot {
    width: 10px;
    height: 10px;
  }
  
  .timeline-line {
    display: none; /* Hide connecting line on mobile */
  }
  
  .project-glass-card {
    max-width: 100%;
    padding: 1.25rem;
  }
  
  .project-title {
    font-size: 1.125rem;
  }
  
  .project-description {
    font-size: 0.8125rem;
  }
}
</style>
