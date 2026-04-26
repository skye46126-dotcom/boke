<template>
  <AppSection id="contact" title="Contact">
    <p class="contact-text">
      如果你对这个内容平台、Agent 工作流、前端重构或产品实现方式感兴趣，
      可以直接邮件联系我。合作、交流、反馈都欢迎。
    </p>
    <a :href="`mailto:${personalInfo.email}`" class="contact-button">
      Send Email →
    </a>
  </AppSection>
</template>

<script setup>
import AppSection from '@/components/ui/AppSection.vue'
import { personalInfo } from '@/data/portfolio'
</script>

<style scoped>
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
</style>
