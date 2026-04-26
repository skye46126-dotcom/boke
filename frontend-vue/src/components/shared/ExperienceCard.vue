<template>
  <div
    ref="itemRef"
    class="timeline-item experience-item"
    :class="{ 'is-visible': isVisible }"
    :style="{ '--index': index }"
  >
    <div class="timeline-marker">
      <div class="timeline-dot"></div>
      <div class="timeline-line" v-if="!isLast"></div>
    </div>

    <BaseCard class="experience-card experience-card-container" variant="glass">
      <div class="card-padding">
        <div class="period">{{ period }}</div>
        <h4 class="title">{{ title }}</h4>
        <div class="company">@ {{ company }}</div>

        <p v-if="summaryText" class="summary">
          {{ summaryText }}
        </p>

        <ul v-if="highlightItems.length" class="highlights">
          <li v-for="(item, i) in highlightItems" :key="i">{{ item }}</li>
        </ul>

        <div v-if="stackItems.length" class="technologies">
          <span
            v-for="(tech, i) in stackItems"
            :key="tech"
            class="tech-item"
          >
            {{ tech }}
            <span v-if="i < stackItems.length - 1" class="tech-divider">·</span>
          </span>
        </div>

        <div v-if="ctaTarget" class="card-footer">
          <router-link :to="ctaTarget" class="cta-link">
            {{ ctaText }} <span aria-hidden="true">→</span>
          </router-link>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import BaseCard from '@/components/ui/BaseCard.vue'

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
  summary: {
    type: String,
    default: ''
  },
  highlights: {
    type: Array,
    default: () => []
  },
  stack: {
    type: Array,
    default: () => []
  },
  description: {
    type: Array,
    default: () => []
  },
  technologies: {
    type: Array,
    default: () => []
  },
  relatedProjectId: {
    type: String,
    default: ''
  },
  relatedFile: {
    type: String,
    default: 'README.md'
  },
  ctaLabel: {
    type: String,
    default: 'Open in Project Workspace'
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
const itemRef = ref(null)
let observer = null

const summaryText = computed(() => props.summary || '')
const highlightItems = computed(() => (
  Array.isArray(props.highlights) && props.highlights.length ? props.highlights : props.description
))
const stackItems = computed(() => (
  Array.isArray(props.stack) && props.stack.length ? props.stack : props.technologies
))
const ctaText = computed(() => props.ctaLabel || 'Open in Project Workspace')
const ctaTarget = computed(() => {
  if (!props.relatedProjectId) return null

  return {
    path: '/projects',
    query: {
      project: props.relatedProjectId,
      file: props.relatedFile || 'README.md'
    }
  }
})

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return

        isVisible.value = true
        if (observer) {
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.2,
      rootMargin: '0px'
    }
  )

  if (itemRef.value) {
    observer.observe(itemRef.value)
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
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  opacity: 0;
  transform: translateX(-30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.timeline-item.is-visible {
  opacity: 1;
  transform: translateX(0);
  transition-delay: calc(var(--index) * 0.15s);
}

.timeline-marker {
  position: relative;
  flex-shrink: 0;
  width: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

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

.timeline-line {
  position: absolute;
  top: 12px;
  left: 50%;
  width: 2px;
  height: calc(100% + 1.5rem);
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

.timeline-item:hover .timeline-dot {
  width: 14px;
  height: 14px;
  background: #00dc82;
  box-shadow: 0 0 18px rgba(0, 220, 130, 0.7);
}

.timeline-item:hover .timeline-line {
  background: repeating-linear-gradient(
    to bottom,
    rgba(0, 220, 130, 0.5) 0px,
    rgba(0, 220, 130, 0.5) 4px,
    transparent 4px,
    transparent 8px
  );
}

.experience-card-container {
  flex: 1;
  max-width: 680px;
}

.card-padding {
  padding: 1.25rem 1.25rem 1rem;
}

.period {
  display: inline-flex;
  margin-bottom: 0.6rem;
  font-size: 0.8rem;
  color: #00dc82;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  color: #ffffff;
  line-height: 1.35;
}

.company {
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.64);
  margin-bottom: 0.85rem;
}

.summary {
  margin: 0 0 0.85rem;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.55;
  font-size: 0.92rem;
}

.highlights {
  list-style: none;
  padding: 0;
  margin: 0 0 0.9rem;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.5;
  font-size: 0.86rem;
}

.highlights li {
  position: relative;
  padding-left: 1rem;
  margin-bottom: 0.42rem;
}

.highlights li:last-child {
  margin-bottom: 0;
}

.highlights li::before {
  content: '•';
  position: absolute;
  left: 0;
  top: -0.02rem;
  color: #00dc82;
}

.technologies {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.76rem;
  font-weight: 500;
  color: #8dddbc;
}

.tech-item {
  white-space: nowrap;
}

.tech-divider {
  color: rgba(255, 255, 255, 0.25);
  margin: 0 0.25rem;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.95rem;
}

.cta-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: #c9ffe6;
  text-decoration: none;
  padding: 0.45rem 0.75rem;
  border: 1px solid rgba(0, 220, 130, 0.22);
  border-radius: 999px;
  background: rgba(0, 220, 130, 0.06);
  transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
}

.cta-link:hover {
  color: #ffffff;
  border-color: rgba(0, 220, 130, 0.45);
  background: rgba(0, 220, 130, 0.12);
}

@media (max-width: 768px) {
  .timeline-item {
    gap: 0.9rem;
    margin-bottom: 1.25rem;
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

  .card-padding {
    padding: 1rem;
  }

  .title {
    font-size: 1.06rem;
  }

  .summary,
  .highlights {
    font-size: 0.82rem;
  }

  .card-footer {
    justify-content: flex-start;
  }
}
</style>
