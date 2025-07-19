<script setup lang="ts">
export type RecapInformation = {
  label: string;
  content: string;
};

defineProps<{
  informations: RecapInformation[];
  color: string;
}>();
</script>

<template>
  <div
    class="flex flex-row flex-nowrap rounded-2xl p-6"
    :style="{ backgroundColor: color }"
  >
    <div
      v-for="info in informations"
      :key="info.label"
      class="flex flex-row flex-nowrap gap-2 flex-1"
    >
      <div>
        <!-- <component :is="info.icon" class="w-5 h-5" :style="{ color: color }" /> -->
        <component class="w-5 h-5" :style="{ color: color }" />
      </div>
      <div class="flex flex-col">
        <span class="font-medium text-sm">{{ info.label }}</span>
        <span class="text-sm lowercase">{{ info.content }}</span>
      </div>
    </div>
  </div>
</template>
