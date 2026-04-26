<template>
  <aside
    class="project-inspector border-t border-[#2d2d2d] bg-[#181818] lg:border-t-0 lg:border-l lg:border-[#2d2d2d]"
    :class="mobile ? 'w-full' : 'hidden lg:flex lg:w-[320px] lg:shrink-0'"
  >
    <div v-if="project" class="flex h-full flex-col">
      <div class="border-b border-[#2d2d2d] px-4 py-3">
        <div class="text-[11px] uppercase tracking-[0.24em] text-gray-500">Project Inspector</div>
        <div class="mt-3 flex items-start justify-between gap-3">
          <div>
            <h3 class="text-base font-semibold text-white">{{ project.name }}</h3>
            <p class="mt-1 text-sm leading-6 text-gray-400">{{ project.summary }}</p>
          </div>
          <span class="rounded-full border border-[#2d2d2d] px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-[#7cc7ff]">
            {{ project.status }}
          </span>
        </div>
      </div>

      <div class="flex-1 space-y-5 overflow-y-auto px-4 py-4 text-sm">
        <section>
          <div class="section-label">Role</div>
          <div class="mt-2 flex flex-wrap gap-2">
            <span
              v-for="item in project.role"
              :key="item"
              class="rounded-md border border-[#2d2d2d] bg-[#202020] px-2 py-1 text-xs text-gray-300"
            >
              {{ item }}
            </span>
          </div>
        </section>

        <section>
          <div class="section-label">Stack</div>
          <div class="mt-2 flex flex-wrap gap-2">
            <span
              v-for="item in project.stack"
              :key="item"
              class="rounded-md bg-[#0f2c3f] px-2 py-1 text-xs text-[#8fd4ff]"
            >
              {{ item }}
            </span>
          </div>
        </section>

        <section>
          <div class="section-label">Progress</div>
          <div class="mt-3 space-y-3">
            <div v-for="item in project.progress" :key="item.label">
              <div class="mb-1 flex items-center justify-between text-xs text-gray-400">
                <span>{{ item.label }}</span>
                <span>{{ item.value }}%</span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-[#252526]">
                <div class="progress-bar h-full rounded-full" :style="{ width: `${item.value}%` }"></div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div class="section-label">Links</div>
          <div class="mt-3 flex flex-col gap-2">
            <a
              v-for="link in project.links"
              :key="link.label"
              :href="link.url"
              class="flex items-center justify-between rounded-md border border-[#2d2d2d] px-3 py-2 text-sm text-gray-300 transition-colors hover:border-[#007acc] hover:text-white"
            >
              <span>{{ link.label }}</span>
              <span class="text-xs text-gray-500">↗</span>
            </a>
          </div>
        </section>
      </div>
    </div>

    <div v-else class="px-4 py-6 text-sm text-gray-500">
      Select a project to inspect.
    </div>
  </aside>
</template>

<script setup>
defineProps({
  project: {
    type: Object,
    default: null
  },
  mobile: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.project-inspector {
  min-height: 0;
}

.section-label {
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #6b7280;
}

.progress-bar {
  background: linear-gradient(90deg, #007acc 0%, #36cfc9 100%);
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #181818;
}

::-webkit-scrollbar-thumb {
  background: #3d3d3d;
}

::-webkit-scrollbar-thumb:hover {
  background: #4b4b4b;
}
</style>
