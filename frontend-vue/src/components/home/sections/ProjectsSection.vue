<template>
  <AppSection id="projects" title="Projects">
    <!-- Featured Projects (IDE Link) -->
    <div class="featured-projects">
      <h3 class="subtle-title">Current Build Surface</h3>
      
      <router-link to="/projects" class="block group">
        <div class="bg-[#1e1e1e] border border-gh-border rounded-lg overflow-hidden shadow-2xl transition-all duration-300 group-hover:transform group-hover:-translate-y-1 group-hover:shadow-[0_10px_20px_rgba(0,0,0,0.3)] relative">
          
          <!-- Mock Window Header -->
          <div class="h-8 bg-[#2d2d2d] flex items-center px-4 border-b border-[#1e1e1e]">
            <div class="flex gap-2 mr-4">
              <div class="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div class="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div class="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            <div class="text-xs text-gray-500 font-mono">project-workspace.code-workspace - Visual Studio Code</div>
          </div>
          
          <!-- Content Preview -->
          <div class="p-8 flex flex-col items-center justify-center min-h-[200px] text-center bg-grid-pattern relative">
            <div class="absolute inset-0 bg-linear-to-t from-[#1e1e1e] to-transparent opacity-80"></div>
            
            <div class="relative z-10 flex flex-col items-center">
               <div class="w-16 h-16 mb-4 text-[#007acc] animate-pulse">
                 <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a1.5 1.5 0 0 0-1.797.09L.427 7.5a1.5 1.5 0 0 0 .16 2.374l10.329 8.024A1.5 1.5 0 0 0 11.93 18l11.66-13.68a1.5 1.5 0 0 0-.442-1.733zM9.54 17.14l-7.77-5.83 2.115-1.127 5.655 4.093v2.864z"/></svg>
               </div>
               <h4 class="text-2xl font-bold text-white mb-2 font-mono" id="launch-ide-mode">Project Workspace</h4>
               <p class="text-gray-400 max-w-sm mb-3">用 IDE 的方式浏览 {{ projects.length }} 个项目的简介、路线图、技术栈和构建日志。</p>
               <p class="text-[11px] uppercase tracking-[0.22em] text-gray-500 mb-6">README / Roadmap / Tech Stack / Build Log</p>
               <span class="inline-flex items-center gap-2 px-6 py-2 bg-[#007acc] text-white rounded font-medium text-sm group-hover:bg-[#0098ff] transition-colors">
                  <span>Open Workspace</span>
                  <span>→</span>
               </span>
            </div>
          </div>
        </div>
      </router-link>
    </div>
  </AppSection>
</template>

<script setup>
import AppSection from '@/components/ui/AppSection.vue'
import { projects } from '@/data/portfolio'
</script>

<style scoped>
.bg-grid-pattern {
  background-image: linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px);
  background-size: 20px 20px;
}

.subtle-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--color-gh-text-muted);
}

.featured-projects {
  margin-top: 3rem;
}
</style>
