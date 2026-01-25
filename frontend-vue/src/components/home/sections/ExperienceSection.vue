<template>
  <section id="experience" class="content-section">
    <div class="section-inner">
      <h2 class="section-title">Experience</h2>
      <div class="experience-list">
        <ExperienceCard
          v-for="(exp, index) in experiences"
          :key="exp.title"
          :index="index"
          :is-last="index === experiences.length - 1"
          v-bind="exp"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import ExperienceCard from '@/components/shared/ExperienceCard.vue'
import { experiences } from '@/data/portfolio'
</script>

<style scoped>
.content-section {
  margin-bottom: 8rem;
  scroll-margin-top: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--color-gh-text);
}

.experience-list {
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .content-section {
    margin-bottom: 5rem;
  }
}
</style>
