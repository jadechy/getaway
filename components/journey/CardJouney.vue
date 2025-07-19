<script setup lang="ts">
import { computed } from "vue";
import { getIconAndColor } from "../../utils/getIconColorFormActivity";
import type { JourneyData } from "~/types/activity";

interface Props {
  journey: JourneyData;
}
const props = defineProps<Props>();
console.log(props.journey);

const typeInfo = computed(() => getIconAndColor(props.journey.type));

const durationHours = computed(() =>
  getDurationHours({ journey: props.journey })
);

const formattedDate = computed(() =>
  getFormattedDate({ date: props.journey.date })
);
</script>

<template>
  <Card
    class="journey-card"
    :style="{ borderColor: `var(--p-${typeInfo.color}-500)` }"
  >
    <template #content>
      <div class="header">
        <i
          :class="['pi', typeInfo.icon]"
          :style="{
            color: `var(--p-${typeInfo.color}-500)`,
            fontSize: '1.5rem',
          }"
        />
        <h3 class="title">{{ journey.title }}</h3>
      </div>

      <p class="date">{{ formattedDate }}</p>

      <div class="info">
        <Tag
          :severity="journey.isFullDay ? 'info' : 'success'"
          :value="journey.isFullDay ? 'Full Day' : durationHours"
        />
        <Tag v-if="journey.needPMR" severity="warning" value="Accessible PMR" />
      </div>
    </template>
  </Card>
</template>

<style scoped>
.journey-card {
  width: 100%;
  cursor: pointer;
  border-width: 2px;
  border-style: solid;
  padding: 1rem;
  border-radius: 0.5rem;
  transition: box-shadow 0.2s ease-in-out;
  user-select: none;
}

.journey-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title {
  margin: 0;
  font-weight: 600;
  font-size: 1.25rem;
  flex-grow: 1;
}

.date {
  margin-top: 0.25rem;
  font-size: 0.9rem;
  color: var(--p-gray-600);
}

.info {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}
</style>
