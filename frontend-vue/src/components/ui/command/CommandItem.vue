<script setup>
import { ComboboxItem } from 'radix-vue'
import { cn } from '@/lib/utils'

defineProps({
  value: { type: String, required: true },
  onSelect: { type: Function }
})
</script>

<template>
  <ComboboxItem
    :value="value"
    @select="onSelect"
    :class="cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-vp-c-brand/20 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      $attrs.class
    )"
  >
    <slot />
  </ComboboxItem>
</template>
