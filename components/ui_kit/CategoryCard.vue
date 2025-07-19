<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import type { ActivityType } from "~/types/journey";
import {
  getIconAndColor,
  type IconAndColor,
} from "~/utils/getIconColorFormActivity";

const props = defineProps<{
  activityType: ActivityType;
  label: string;
}>();

const router = useRouter();

const color = computed<IconAndColor>(() => getIconAndColor(props.activityType));

const onClick = () => {
  router.push({
    name: `journey-generate`,
    params: { formType: props.activityType },
  });
};
</script>

<template>
  <div
    class="category-card"
    @click="onClick"
    :style="{
      backgroundColor: `var(--p-${color.color}-300)`,
      color: `var(--p-${color.color}-700)`,
    }"
  >
    <p class="label">
      <i class="pi icon" :class="`${color.icon}`"></i> {{ label }}
    </p>
  </div>
</template>

<style scoped>
.category-card {
  cursor: pointer;
  height: 175px;
  flex-grow: 1;
  border-radius: 1rem;
  position: relative;
  overflow: hidden;
  padding: 10px;
  display: flex;
  align-items: end;
}
.label {
  font-weight: 500;
  font-size: x-large;
  text-transform: capitalize;
  z-index: 1;
  margin-block: 0;
}
.icon {
  font-size: x-large;
}
</style>
