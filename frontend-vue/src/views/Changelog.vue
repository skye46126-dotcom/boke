<template>
  <div class="min-h-screen bg-gh-bg text-gh-text pt-24 pb-12 px-6 relative overflow-hidden">
    <div class="container mx-auto max-w-4xl relative z-10">
      <header class="mb-12">
        <h1 class="text-3xl font-bold mb-4 flex items-center gap-3">
          <span class="text-vp-c-brand">git</span>
          <span>log</span>
          <span class="text-gh-text-muted text-lg font-normal">--graph --oneline</span>
        </h1>
        <p class="text-gh-text-muted">Tracking the evolution of this project and my journey.</p>
      </header>

      <GitLogGraph :changelog="changelog" />
    </div>
  </div>
</template>

<script setup>
import { changelog } from '@/data/changelog'
import GitLogGraph from '@/components/ide/git/GitLogGraph.vue'
</script>
