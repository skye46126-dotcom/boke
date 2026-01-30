<template>
  <section :id="id" class="app-section" :class="{ 'no-spacing': noSpacing }">
    <div class="section-inner container mx-auto">
      <div v-if="$slots.title || title" class="section-header">
        <slot name="title">
          <h2 class="section-title">{{ title }}</h2>
        </slot>
        <slot name="subtitle">
           <p v-if="subtitle" class="section-subtitle">{{ subtitle }}</p>
        </slot>
      </div>
      
      <div class="section-content">
        <slot></slot>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  id: String,
  title: String,
  subtitle: String,
  noSpacing: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.app-section {
  margin-bottom: var(--section-spacing, 8rem);
  scroll-margin-top: 2rem;
}

.app-section.no-spacing {
  margin-bottom: 0;
}

.section-inner {
  max-width: 1200px;
  padding: 0 1.5rem;
}

@media (max-width: 640px) {
  .section-inner {
    padding: 0 0.5rem;
  }
}

.section-header {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-gh-text);
  margin-bottom: 0.5rem;
}

.section-subtitle {
  font-size: 1.125rem;
  color: var(--color-gh-text-muted);
}

@media (max-width: 768px) {
  .app-section {
    margin-bottom: var(--section-spacing-mobile, 5rem);
  }
  
  .section-header {
    margin-bottom: 2rem;
  }
}
</style>
