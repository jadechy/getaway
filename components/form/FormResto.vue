<script setup lang="ts">
import type { FormStepProps } from "~/types/form-types";
import { RESTAURANT_TYPES_LIST } from "~/utils/const/restaurantTypes";

const props = defineProps<FormStepProps>();

const restaurantTypesList = Object.entries(RESTAURANT_TYPES_LIST).map(
  ([id, label]) => ({
    id,
    label,
  })
);

const toggleResto = (label: string) => {
  const exists = props.formAnswers.answerRestaurantTypes.includes(label);
  const updated = exists
    ? props.formAnswers.answerRestaurantTypes.filter((opt) => opt !== label)
    : [...props.formAnswers.answerRestaurantTypes, label];

  props.setFormAnswers({
    ...props.formAnswers,
    answerRestaurantTypes: updated,
  });
};

const updatePrice = (e: Event, index: number) => {
  const input = e.target as HTMLInputElement;
  const value = Number(input.value);

  if (!isNaN(value)) {
    const current = props.formAnswers.answerRestaurantPriceRange;
    const newPrice: [number, number] =
      index === 0 ? [value, current[1]] : [current[0], value];

    props.setFormAnswers({
      ...props.formAnswers,
      answerRestaurantPriceRange: newPrice,
    });
  }
};
</script>

<template>
  <div>
    <div v-for="item in restaurantTypesList" :key="item.id">
      <button @click="toggleResto(item.label)">
        {{ item.label }}
      </button>
    </div>

    <input
      type="range"
      min="0"
      max="100"
      :value="props.formAnswers.answerRestaurantPriceRange[0]"
      @input="(e) => updatePrice(e, 0)"
    />
    <input
      type="range"
      min="0"
      max="100"
      :value="props.formAnswers.answerRestaurantPriceRange[1]"
      @input="(e) => updatePrice(e, 1)"
    />
  </div>
</template>
