<script setup lang="ts">
import { ACTIVITY_TYPES_LIST } from "~/data/activityTypes";
import { RESTAURANT_TYPES_LIST } from "~/data/restaurantTypes";
import type { TypedPriceRange } from "~/types/answer";
export type Typed = Record<string, string>;
const form = defineModel<TypedPriceRange>({ required: true });
const { isActivity } = defineProps<{ isActivity?: boolean }>();
const typesList = Object.entries(
  isActivity ? ACTIVITY_TYPES_LIST : RESTAURANT_TYPES_LIST
).map(([id, label]) => ({
  id,
  label,
}));
</script>

<template>
  <div class="form-group">
    <div class="label-price-range">
      <label for="price"
        >Prix {{ isActivity ? "de l'activité" : "du restaurant" }}</label
      >
      <p v-if="form.priceRange">
        {{ form.priceRange[0] }} - {{ form.priceRange[1] }} €
      </p>
    </div>
    <Slider id="price" v-model="form.priceRange" range :max="100" :min="0" />
  </div>
  <div class="type-form">
    <p>Type {{ isActivity ? "d'activité" : "de restaurant" }}</p>
    <Listbox
      v-model="form.types"
      :options="typesList"
      optionLabel="label"
      class="type-form-listbox"
      multiple
      filter
    />
  </div>
</template>
<style>
.label-price-range {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.5rem;
  p {
    font-size: small;
    color: var(--p-gray-400);
  }
}
.type-form {
  margin-top: 3rem;
}
.type-form-listbox {
  background: none;
}
</style>
