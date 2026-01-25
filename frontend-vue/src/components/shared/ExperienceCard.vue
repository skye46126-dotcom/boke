<template>
  <div 
    class="timeline-item experience-item"
    :class="{ 'is-visible': isVisible }"
    :style="{ '--index': index }"
  >
    <!-- Timeline Decoration -->
    <div class="timeline-marker">
      <div class="timeline-dot"></div>
      <div class="timeline-line" v-if="!isLast"></div>
    </div>
    
    <!-- Glassmorphism Card -->
    <div class="experience-glass-card">
      <div class="glass-background"></div>
      
      <div class="glass-content">
        <!-- Period -->
        <div class="period">{{ period }}</div>
        
        <!-- Title and Company -->
        <h4 class="title">{{ title }}</h4>
        <div class="company">@ {{ company }}</div>
        
        <!-- Description -->
        <ul class="description">
          <li v-for="(item, i) in description" :key="i">{{ item }}</li>
        </ul>
        
        <!-- Technologies -->
        <div class="technologies">
          <span 
            v-for="(tech, i) in technologies" 
            :key="tech"
            class="tech-item"
          >
            {{ tech }}
            <span v-if="i < technologies.length - 1" class="tech-divider">·</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  period: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  description: {
    type: Array,
    required: true
  },
  technologies: {
    type: Array,
    required: true
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

// Intersection Observer for scroll-triggered animation
let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible.value = true
          if (observer && entry.target) {
            observer.unobserve(entry.target)
          }
        }
      })
    },
    {
      threshold: 0.2,
      rootMargin: '0px'
    }
  )
  
  const element = document.querySelector(`.experience-item:nth-child(${props.index + 1})`)
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

/* Timeline Line */
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

/* Hover: Green to Purple */
.timeline-item:hover .timeline-dot {
  width: 14px;
  height: 14px;
  background: #a855f7;
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.8);
}

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
.experience-glass-card {
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

.experience-glass-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
}

/* Fallback for browsers without backdrop-filter */
@supports not (backdrop-filter: blur(6px)) {
  .experience-glass-card {
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

/* Period */
.period {
  font-size: 0.875rem;
  color: #00dc82;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Title */
.title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: #ffffff;
  transition: color 0.3s ease;
}

.timeline-item:hover .title {
  background: linear-gradient(135deg, #00dc82, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Company */
.company {
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
}

/* Description */
.description {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  font-size: 0.875rem;
}

.description li {
  position: relative;
  padding-left: 1.25rem;
  margin-bottom: 0.5rem;
}

.description li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #00dc82;
  font-size: 1.2rem;
  line-height: 1.4;
}

/* Technologies */
.technologies {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #00dc82;
}

.tech-item {
  white-space: nowrap;
}

.tech-divider {
  color: rgba(255, 255, 255, 0.3);
  margin: 0 0.25rem;
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
    display: none;
  }
  
  .experience-glass-card {
    max-width: 100%;
    padding: 1.25rem;
  }
  
  .title {
    font-size: 1.125rem;
  }
  
  .description {
    font-size: 0.8125rem;
  }
}
</style>
