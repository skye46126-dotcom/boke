<template>
  <section id="about" class="content-section">
    <div class="section-inner">
      <div class="about-content">
        <h2 class="section-title">About</h2>
        <div class="about-text">
          <p class="intro">
            你好！我是 <strong>{{ personalInfo.name }}</strong>，一名 {{ personalInfo.title }}。
            我热爱使用现代技术栈构建优雅、高效的 Web 应用程序。
          </p>
          
          <h3 class="subsection-title">💻 技术专长</h3>
          <p>
            我专注于全栈开发，擅长使用 <strong>Vue.js</strong>、<strong>React</strong> 和 
            <strong>TypeScript</strong> 构建现代化的前端应用。后端方面，熟练使用 
            <strong>Node.js</strong> 和 <strong>Python</strong>，对数据库设计和 API 开发
            有深入理解。
          </p>
          <p>
            我相信技术是用来解决问题的工具，而不是目的本身。选择合适的技术栈，
            写出简洁可维护的代码，是我一直追求的目标。
          </p>
          
          <h3 class="subsection-title">🚀 工作经历</h3>
          <p>
            拥有 <strong>{{ experiences[0]?.period || '多年' }}</strong> 的开发经验，
            曾在 <strong>{{ experiences[0]?.company || '多家' }}公司</strong> 担任核心开发角色。
            在工作中，我不仅注重技术实现，更关注用户体验和产品质量。
          </p>
          <p>
            参与过多个大型项目的架构设计和开发，从需求分析到上线部署，积累了丰富的实战经验。
            特别擅长性能优化、代码重构和团队协作。
          </p>
          
          <h3 class="subsection-title">💡 个人理念</h3>
          <p>
            <em>"代码是写给人读的，只是顺便让机器执行。"</em> —— 这是我一直坚持的开发理念。
            我认为优秀的代码应该像散文一样易读，逻辑清晰，注释恰当。
          </p>
          <p>
            热爱学习新技术，关注行业动态，乐于分享技术经验。
            业余时间喜欢阅读技术博客、参与开源项目，持续提升自己的技术能力。
          </p>
          
          <p class="cta">
            💬 想了解更多？可以通过下方的 Terminal 与我互动，或查看我的
            <a href="/#projects" class="inline-link">项目作品</a>。
          </p>
        </div>
        
        <!-- Terminal Component -->
        <div class="terminal-wrapper">
          <Terminal />
        </div>
        
        <!-- Skills -->
        <div class="skills">
          <span v-for="skill in skills" :key="skill" class="skill-tag">
            {{ skill }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import Terminal from '@/components/shared/Terminal.vue'
import { personalInfo, skills, experiences } from '@/data/portfolio'
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

.about-text p {
  color: var(--color-gh-text-muted);
  line-height: 1.8;
  margin-bottom: 1rem;
}

.about-text .intro {
  font-size: 1.125rem;
  color: var(--color-gh-text);
  margin-bottom: 2rem;
}

.subsection-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-gh-text);
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.about-text strong {
  color: var(--color-vp-c-brand);
  font-weight: 600;
}

.about-text em {
  color: var(--color-gh-text);
  font-style: italic;
}

.about-text .cta {
  margin-top: 2rem;
  font-size: 1rem;
  color: var(--color-gh-text);
}

.inline-link {
  color: var(--color-vp-c-brand);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s ease;
}

.inline-link:hover {
  border-bottom-color: var(--color-vp-c-brand);
}

.terminal-wrapper {
  margin: 2rem 0;
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}

.skill-tag {
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  background: rgba(0, 220, 130, 0.1);
  color: var(--color-vp-c-brand);
  border: 1px solid rgba(0, 220, 130, 0.3);
}

@media (max-width: 768px) {
  .content-section {
    margin-bottom: 5rem;
  }
}
</style>
