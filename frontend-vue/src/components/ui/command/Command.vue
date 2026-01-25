<script setup>
import { computed } from 'vue'
import { ComboboxRoot, ComboboxInput, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxItem, ComboboxPortal } from 'radix-vue'
import { Search } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  searchTerm: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'update:searchTerm'])

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const query = computed({
  get: () => props.searchTerm,
  set: (val) => emit('update:searchTerm', val)
})
</script>

<template>
  <ComboboxRoot
    v-model:open="open"
    v-model:searchTerm="query"
    class="relative z-50"
    @update:modelValue="(val) => !val && emit('update:modelValue', false)"
  >
    <div v-if="open" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" @click="open = false" />
    
    <div class="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] p-4 sm:p-0">
      <ComboboxContent
        class="relative flex w-full flex-col overflow-hidden rounded-xl border border-gh-border bg-gh-card shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-2"
      >
        <div class="flex items-center border-b border-gh-border px-3">
          <Search class="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <ComboboxInput
            class="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gh-text-muted disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search articles..."
            autoFocus
            @input="(e) => query = e.target.value"
          />
        </div>

        <div class="max-h-[300px] overflow-y-auto p-2">
          <ComboboxEmpty class="py-6 text-center text-sm text-gh-text-muted">
            No results found.
          </ComboboxEmpty>

          <ComboboxGroup>
            <slot />
          </ComboboxGroup>
        </div>
      </ComboboxContent>
    </div>
  </ComboboxRoot>
</template>
