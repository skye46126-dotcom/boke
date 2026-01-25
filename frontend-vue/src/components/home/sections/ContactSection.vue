<template>
  <section id="contact" class="content-section">
    <div class="section-inner">
      <h2 class="section-title">Get In Touch</h2>
      <p class="contact-text">
        I'm always open to new opportunities and collaborations. 
        Feel free to reach out if you'd like to work together!
      </p>
      <a :href="`mailto:${personalInfo.email}`" class="contact-button">
        Let's Work Together →
      </a>
    </div>
  </section>
</template>

<script setup>
import { personalInfo } from '@/data/portfolio'
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

.contact-text {
  color: var(--color-gh-text-muted);
  line-height: 1.8;
  margin-bottom: 2rem;
  max-width: 600px;
}

.contact-button {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: var(--color-vp-c-brand);
  color: white;
  border-radius: var(--border-radius-vp);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.contact-button:hover {
  background: var(--color-vp-c-brand-light);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 220, 130, 0.3);
}

@media (max-width: 768px) {
  .content-section {
    margin-bottom: 5rem;
  }
}
</style>
