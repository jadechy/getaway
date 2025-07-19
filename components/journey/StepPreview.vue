<script setup lang="ts">
    import type { Step } from '~/types/journey';

    defineProps<{
        step: Step
        color?: string
    }>()

    defineEmits(['navigate'])

    // const borderColor = computed(() => `border-${props.color ?? 'green'}-500`)
    // const bgColor = computed(() => `bg-${props.color ?? 'green'}-500`)
</script>

<template>
  <div
    class="rounded-2xl border p-4 w-full"
    
    @click="$emit('navigate', step)"
  >
    <div class="flex flex-col gap-4">
      <span
        class="px-2 py-1 text-xs rounded-full text-white w-fit"
        
      >
        {{ step.isRestaurant ? 'restaurant' : 'activité' }}
      </span>

      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold line-clamp-2">{{ step.name }}</h3>
        <span class="text-sm text-gray-600">
          {{ step.startingHour }} - {{ step.endingHour }}
        </span>
      </div>

      <div class="space-y-1 text-sm">
        <p>Prix : {{ step.price }}</p>
        <p>Lieu : {{ step.adress }}</p>
      </div>
    </div>
  </div>
</template>