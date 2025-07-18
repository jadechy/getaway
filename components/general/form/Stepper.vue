<script setup lang="ts">
    defineProps<{
    total: number;
    current: number;
    setCurrentStep: (step: number) => void;
    }>();

    const emit = defineEmits<{
        (e: 'stepClick', index: number): void;
    }>();
</script>

<template>
  <div style="display: flex; gap: 8px; width: 100%;">
    <div
      v-for="index in total"
      :key="index"
      @click="index - 1 < current ? setCurrentStep(index - 1) : null"
      style="flex: 1; height: 10px; border: 1px solid black; cursor: pointer;"
      :style="{ backgroundColor: index - 1 <= current ? 'black' : 'transparent' }"
    />
  </div>
</template>
