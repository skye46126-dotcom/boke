<template>
  <div 
    class="base-card"
    :class="[
      `variant-${variant}`,
      { 'hover-effect': hover, 'clickable': clickable }
    ]"
  >
    <div v-if="variant === 'glass'" class="glass-background"></div>
    <div class="card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'glass', // glass, ghost, border
    validator: (v) => ['glass', 'ghost', 'border'].includes(v)
  },
  hover: {
    type: Boolean,
    default: true
  },
  clickable: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.base-card {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-vp, 12px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid transparent;
  contain: layout style paint;
}

.card-content {
  position: relative;
  z-index: 1;
}

/* Glass Variant */
.variant-glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-color: rgba(255, 255, 255, 0.1);
}

.variant-glass.hover-effect:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

/* Border Variant */
.variant-border {
  background: var(--color-gh-card);
  border-color: var(--color-gh-border);
}

.variant-border.hover-effect:hover {
  border-color: var(--color-vp-c-brand);
}

/* Ghost Variant */
.variant-ghost {
  background: transparent;
  border-color: transparent;
  box-shadow: none;
}

/* General Interactions */
.hover-effect:hover {
  transform: translateY(var(--card-hover-lift, -4px));
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
}

.clickable {
  cursor: pointer;
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

/* Fallback for browsers without backdrop-filter */
@supports not (backdrop-filter: blur(6px)) {
  .variant-glass {
    background: rgba(22, 27, 34, 0.95);
  }
}
</style>
