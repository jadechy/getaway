<script setup lang="ts">
import type { FormStepProps } from "~/types/form-types";
import { ACTIVITY_TYPES_LIST } from "~/utils/const/activityTypes";

const props = defineProps<FormStepProps>();

const activityTypesList = Object.entries(ACTIVITY_TYPES_LIST).map(
  ([id, label]) => ({
    id,
    label,
  })
);

const toggleActivity = (label: string) => {
  const exists = props.formAnswers.answerActivityOptions.includes(label);
  const updated = exists
    ? props.formAnswers.answerActivityOptions.filter((opt) => opt !== label)
    : [...props.formAnswers.answerActivityOptions, label];

  props.setFormAnswers({
    ...props.formAnswers,
    answerActivityOptions: updated,
  });
};

const updatePrice = (e: Event, index: 0 | 1) => {
  const input = e.target as HTMLInputElement;
  const value = Number(input.value);

  const newPrice: [number, number] = [
    ...props.formAnswers.answerPriceRange,
  ] as [number, number];
  newPrice[index] = value;

  props.setFormAnswers({
    ...props.formAnswers,
    answerPriceRange: newPrice,
  });
};
</script>

<template>
  <div>
    <div v-for="item in activityTypesList" :key="item.id">
      <button @click="toggleActivity(item.label)">
        {{ item.label }}
      </button>
    </div>

    <input
      type="range"
      min="0"
      max="100"
      :value="props.formAnswers.answerPriceRange[0]"
      @input="(e) => updatePrice(e, 0)"
    />
    <input
      type="range"
      min="0"
      max="100"
      :value="props.formAnswers.answerPriceRange[1]"
      @input="(e) => updatePrice(e, 1)"
    />
  </div>
</template>
