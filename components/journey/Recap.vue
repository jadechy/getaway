<script setup lang="ts">
import type { BaseJourney } from "~/types/journey";

export type RecapInformation = {
  label: string;
  content: string;
};

defineProps<{
  journeys: BaseJourney[];
  color: string;
}>();
</script>

<template>
  <div :style="{ backgroundColor: color }">
    <div v-for="journey in journeys" :key="journey.id">
      <div>
        <component :style="{ color: color }" />
      </div>
      <div>
        <span>Sortie le : {{ journey.date }}</span>
        <span>{{ journey.title }}</span>
      </div>
    </div>
  </div>
</template>
