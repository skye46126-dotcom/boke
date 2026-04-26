<template>
  <AppSection id="tech-stack" title="Tech Stack">
    <div class="tech-stack-copy">
      <div class="eyebrow">Built With</div>
      <p class="tech-stack-text">
        这个站点不是静态模板，而是一个持续迭代的个人内容平台。下面这些工具分别承担前端界面、内容数据、接口流程和阅读体验。
      </p>
    </div>

    <div class="stack-grid">
      <article
        v-for="group in techStackGroups"
        :key="group.title"
        class="stack-card"
      >
        <div class="stack-card-header">
          <h3 class="stack-title">{{ group.title }}</h3>
          <p class="stack-description">{{ group.description }}</p>
        </div>

        <div class="stack-items">
          <span v-for="item in group.items" :key="item" class="skill-tag">
            {{ item }}
          </span>
        </div>
      </article>
    </div>
  </AppSection>
</template>

<script setup>
import AppSection from '@/components/ui/AppSection.vue'

const techStackGroups = [
  {
    title: 'Frontend',
    description: '负责首页结构、交互界面和组件组织。',
    items: ['Vue 3', 'Vite', 'Tailwind CSS', 'TypeScript']
  },
  {
    title: 'Data & Content',
    description: '负责内容数据、项目信息和站点配置管理。',
    items: ['Supabase', 'PostgreSQL']
  },
  {
    title: 'Workflow',
    description: '负责接口流程、脚本整理和辅助处理。',
    items: ['Node.js', 'Python']
  },
  {
    title: 'Experience',
    description: '负责代码高亮、离线能力和阅读体验。',
    items: ['Shiki', 'PWA']
  }
]
</script>

<style scoped>
.tech-stack-copy {
  margin-bottom: 1.5rem;
  max-width: 760px;
}

.eyebrow {
  display: inline-flex;
  margin-bottom: 0.6rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #00dc82;
}

.tech-stack-text {
  color: rgba(255, 255, 255, 0.76);
  line-height: 1.8;
  margin: 0;
}

.stack-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.stack-card {
  border: 1px solid rgba(0, 220, 130, 0.14);
  border-radius: 16px;
  padding: 1rem 1rem 1.05rem;
  background:
    linear-gradient(180deg, rgba(0, 220, 130, 0.06), rgba(0, 220, 130, 0.02)),
    rgba(17, 24, 39, 0.56);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.16);
}

.stack-card-header {
  margin-bottom: 0.9rem;
}

.stack-title {
  margin: 0 0 0.3rem;
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
}

.stack-description {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.62);
}

.stack-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.skill-tag {
  font-size: 0.82rem;
  padding: 0.46rem 0.85rem;
  border-radius: 9999px;
  background: rgba(0, 220, 130, 0.1);
  color: #b9f5d9;
  border: 1px solid rgba(0, 220, 130, 0.24);
}

@media (max-width: 768px) {
  .stack-grid {
    grid-template-columns: 1fr;
  }

  .stack-card {
    padding: 0.95rem;
  }

  .tech-stack-text {
    font-size: 0.95rem;
  }
}
</style>
