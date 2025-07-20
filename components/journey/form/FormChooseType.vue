<script setup lang="ts">
import type { CreateJourneyAnswers } from "~/types/answer";
import { ActivityType } from "~/types/journey";
const activityTypes = Object.values(ActivityType);
const renderLabel = (type: ActivityType) => {
  switch (type) {
    case ActivityType.friends:
      return "Entre potes";
    case ActivityType.family:
      return "En famille";
    case ActivityType.romantic:
      return "En couple";
    case ActivityType.random:
      return "Aléatoire";
  }
};

const form = defineModel<CreateJourneyAnswers>({ required: true });
const selectType = ({ type }: { type: ActivityType }) => {
  form.value.journeyActivityType = type;
};
</script>

<template>
  <div class="choose-type-step">
    <h2>Choisis ton type de sortie</h2>

    <section class="cards-container">
      <div class="cards-row">
        <div
          v-for="(activity, i) in activityTypes.slice(0, 2)"
          :key="i"
          :class="[
            'category-card',
            { selected: form.journeyActivityType === activity },
          ]"
          @click="selectType({ type: activity })"
        >
          <h3>{{ renderLabel(activity) }}</h3>
        </div>
      </div>
      <div class="cards-row">
        <div
          v-for="(activity, i) in activityTypes.slice(2)"
          :key="i"
          :class="[
            'category-card',
            { selected: form.journeyActivityType === activity },
          ]"
          @click="selectType({ type: activity })"
        >
          <h3>{{ renderLabel(activity) }}</h3>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.choose-type-step {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cards-row {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.category-card {
  flex: 1;
  padding: 1rem;
  border: 2px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  user-select: none;
  transition: border-color 0.3s, background-color 0.3s;
}

.category-card:hover {
  border-color: var(--p-primary-color);
  color: var(--p-primary-color);
}

.category-card.selected {
  border-color: var(--p-primary-color);
  color: white;
  background-color: var(--p-primary-color);
  font-weight: bold;
}
</style>
