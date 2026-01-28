<template>
  <div class="git-graph relative pl-8">
    <!-- Vertical Line (Branch) -->
    <div class="absolute left-[11px] top-0 bottom-0 w-0.5 bg-gh-border"></div>

    <div v-for="(group, groupIndex) in changelog" :key="group.date" class="mb-12 relative animate-fade-in" :style="{ animationDelay: `${groupIndex * 100}ms` }">
      <!-- Date Label -->
      <div class="flex items-center gap-4 mb-4">
         <div class="w-6 h-6 rounded-full bg-gh-card border-2 border-vp-c-brand z-10 relative flex items-center justify-center shadow-lg shadow-vp-c-brand/20">
            <div class="w-2 h-2 rounded-full bg-vp-c-brand"></div>
         </div>
         <h2 class="text-lg font-bold text-vp-c-brand font-mono">{{ group.date }}</h2>
      </div>

      <!-- Commits -->
      <div class="space-y-4 pl-10">
        <div 
          v-for="(commit, index) in group.commits" 
          :key="commit.hash"
          class="commit-card group flex items-start gap-4 p-3 rounded hover:bg-gh-card border border-transparent hover:border-gh-border transition-all cursor-default"
        >
          <!-- Branch curve (visual only, simplified) -->
          <div class="absolute left-[11px] w-4 h-0.5 bg-gh-border mt-5 -translate-x-full opacity-50"></div>

          <div class="font-mono text-sm text-yellow-500 w-20 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
            {{ commit.hash }}
          </div>
          
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <span 
                class="text-xs px-2 py-0.5 rounded border opacity-90 font-mono"
                :class="getTypeClass(commit.type)"
              >
                {{ commit.type }}
              </span>
              <span class="text-gh-text group-hover:text-white transition-colors">
                {{ commit.message }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tip -->
    <div class="flex items-center gap-4 mt-8 opacity-50">
       <div class="w-6 h-6 rounded-full bg-gh-border z-10 relative flex items-center justify-center">
          <div class="w-2 h-2 rounded-full bg-gh-text-muted"></div>
       </div>
       <p class="text-sm font-mono text-gh-text-muted">HEAD -> main</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  changelog: Array
})

const getTypeClass = (type) => {
  const classes = {
    feat: 'bg-green-500/10 text-green-400 border-green-500/20',
    fix: 'bg-red-500/10 text-red-400 border-red-500/20',
    style: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    docs: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    init: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
  }
  return classes[type] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
  transform: translateY(10px);
}

@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
