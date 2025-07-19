<script setup lang="ts">
import { ref } from "vue";
import CategoryCard from "~/components/ui_kit/CategoryCard.vue";
import { ActivityType } from "~/types/activity";

const userName = ref("cher ami");

const activityCards = [
  { type: ActivityType.friends, label: "Entre potes" },
  { type: ActivityType.family, label: "En famille" },
  { type: ActivityType.romantic, label: "En couple" },
  { type: ActivityType.random, label: "Aléatoire" },
];
</script>

<template>
  <section>
    <h1 class="greeting-title">Hello {{ userName }} 👋</h1>
    <h2 class="greeting-subtitle">Ravis de te revoir !</h2>
  </section>

  <h2 class="choose-title">Choisis ton type de sortie</h2>

  <section class="cards-container">
    <div class="cards-row">
      <CategoryCard
        v-for="card in activityCards.slice(0, 2)"
        :key="card.type"
        :activityType="card.type"
        :label="card.label"
      />
    </div>
    <div class="cards-row">
      <CategoryCard
        class="flex-grow"
        :activityType="activityCards[2].type"
        :label="activityCards[2].label"
      />
      <CategoryCard
        class="flex-shrink"
        :activityType="activityCards[3].type"
        :label="activityCards[3].label"
      />
    </div>
  </section>
</template>

<style scoped>
.greeting-title {
  font-size: 2rem;
  margin: 0;
}

.greeting-subtitle {
  font-size: 1.5rem;
  font-weight: lighter;
  margin: 0;
}

.choose-title {
  margin-top: 30px;
  margin-bottom: 1rem;
  font-weight: normal;
  font-size: 1.2rem;
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 0.5rem 0;
}

.cards-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.flex-grow {
  flex-grow: 1;
}

.flex-shrink {
  flex-shrink: 1;
  width: 30%;
}
</style>
