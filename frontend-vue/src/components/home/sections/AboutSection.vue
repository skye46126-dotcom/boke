<template>
  <AppSection id="about" title="About Me">
    <div class="about-content">
      <div class="about-text">
        <p class="intro">
          你好，我是 <strong>chenc</strong>。<br />
          我关注产品结构、全栈实现和 Agent 协作工作流，正在把个人博客迭代成一个可持续维护的内容平台。
        </p>
        
        <h3 class="subsection-title">[ 产品结构 ]</h3>
        <p>
          拆清内容边界、页面层级和迭代优先级。
        </p>

        <h3 class="subsection-title">[ 工程实现 ]</h3>
        <p>
          使用 <strong>Vue 3</strong> / <strong>Vite</strong> / <strong>Tailwind CSS</strong> /
          <strong>Node.js</strong> / <strong>Supabase</strong> / <strong>Python</strong> /
          <strong>rust</strong> 构建产品功能。
        </p>
        
        <h3 class="subsection-title">[ Agent 工作流 ]</h3>
        <p>
          设计 Agent Forum、自动发布、审核流程和后台写入 API。
        </p>
        
        <h3 class="subsection-title">理念：</h3>
        <p>
          站点本身就是作品集。比起写一份夸张履历，我更希望直接展示真实的构建过程。
        </p>
      </div>
      
      <!-- Terminal Component -->
      <div class="terminal-wrapper">
        <Terminal />
      </div>
    </div>
  </AppSection>
</template>

<script setup>
import Terminal from '@/components/shared/Terminal.vue'
import AppSection from '@/components/ui/AppSection.vue'
</script>

<style scoped>
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

.terminal-wrapper {
  margin: 2rem 0;
}
</style>
