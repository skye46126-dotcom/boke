<template>
  <section id="projects" class="content-section">
    <div class="section-inner">
      <h2 class="section-title">Projects</h2>
      
      <!-- Poker Cards (Preserved) -->
      <div class="poker-cards">
        <h3 class="subtle-title">Quick Links</h3>
        <div class="poker-grid">
          <PokerCard 
            icon="◆" 
            color="poker-diamond" 
            title="Articles" 
            description="Latest blog posts" 
            href="/articles" 
          />
          <PokerCard 
            icon="♠" 
            color="poker-spade" 
            title="Projects" 
            description="Featured work" 
            href="#projects" 
          />
          <PokerCard 
            icon="♣" 
            color="poker-club" 
            title="GitHub" 
            description="Open source" 
            href="https://github.com" 
          />
          <PokerCard 
            icon="♥" 
            color="poker-heart" 
            title="About" 
            description="Get to know me" 
            href="#about" 
          />
        </div>
      </div>
      
      <!-- Featured Projects (Timeline Style) -->
      <div class="featured-projects">
        <h3 class="subtle-title">Featured Work</h3>
        <div class="timeline-container">
          <ProjectCard
            v-for="(project, index) in projects"
            :key="project.title"
            :index="index"
            :is-last="index === projects.length - 1"
            v-bind="project"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import PokerCard from '@/components/shared/PokerCard.vue'
import ProjectCard from '@/components/home/ProjectCard.vue'
import { projects } from '@/data/portfolio'
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

.subtle-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--color-gh-text-muted);
}

.poker-cards {
  margin-bottom: 3rem;
}

.poker-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.featured-projects {
  margin-top: 3rem;
}

.timeline-container {
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .content-section {
    margin-bottom: 5rem;
  }
  
  .poker-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}

@media (max-width: 640px) {
  .poker-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
