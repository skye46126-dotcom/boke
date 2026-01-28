<template>
  <AppSection id="experience" title="Experience">
    <div class="experience-list">
      <ExperienceCard
        v-for="(exp, index) in experiences"
        :key="exp.title"
        :index="index"
        :is-last="index === experiences.length - 1"
        v-bind="exp"
      />
    </div>
  </AppSection>
</template>

<script setup>
import ExperienceCard from '@/components/shared/ExperienceCard.vue'
import AppSection from '@/components/ui/AppSection.vue'
import { experiences } from '@/data/portfolio'
</script>

<style scoped>
.experience-list {
  display: flex;
  flex-direction: column;
}
</style>
