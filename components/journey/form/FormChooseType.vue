<script setup lang="ts">
import { ref, defineEmits } from 'vue';

const activityCards = [
  { type: 'friends', label: "Entre potes" },
  { type: 'family', label: "En famille" },
  { type: 'romantic', label: "En couple" },
  { type: 'random', label: "Aléatoire" },
];

const emits = defineEmits<{
  (e: 'update:type', type: string): void;
}>();

const selectedType = ref<string | null>(null);

function selectType(type: string) {
  selectedType.value = type;
  emits('update:type', type);
}
</script>

<template>
  <div class="choose-type-step">
    <h2>Choisis ton type de sortie</h2>

    <section class="cards-container">
      <div class="cards-row">
        <div
          v-for="card in activityCards.slice(0, 2)"
          :key="card.type"
          :class="['category-card', { selected: selectedType === card.type }]"
          @click="selectType(card.type)"
        >
          <h3>{{ card.label }}</h3>
        </div>
      </div>
      <div class="cards-row">
        <div
          v-for="card in activityCards.slice(2)"
          :key="card.type"
          :class="['category-card', { selected: selectedType === card.type }]"
          @click="selectType(card.type)"
        >
          <h3>{{ card.label }}</h3>
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
  border-color: #007bff;
  background-color: #e7f1ff;
}

.category-card.selected {
  border-color: #0056b3;
  background-color: #cce4ff;
  font-weight: bold;
}
</style>
