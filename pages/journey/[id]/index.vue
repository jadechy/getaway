<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, computed, onMounted } from "vue";
import { useJourney } from "~/composables/useJourney";
import type { JourneyData } from "~/types/activity";
import { getIconAndColor } from "~/utils/getIconColorFormActivity";
import { Badge, Tag } from "primevue";

const route = useRoute();
const { fetchJourneyById, deleteJourney } = useJourney();

const journeyData = ref<JourneyData | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const id = route.params.id as string;
    journeyData.value = await fetchJourneyById({ journeyId: id });
    if (!journeyData.value) error.value = "Aucune sortie trouvée.";
  } catch (e) {
    error.value = "Erreur lors du chargement.";
    console.error(e);
  } finally {
    loading.value = false;
  }
});

const typeInfo = computed(() =>
  journeyData.value
    ? getIconAndColor(journeyData.value.type)
    : { color: "gray", icon: "pi-question" }
);

const formattedDate = computed(() =>
  journeyData.value
    ? getFormattedDate({ date: new Date(journeyData.value.date) })
    : ""
);

const duration = computed(() =>
  journeyData.value ? getDurationHours({ journey: journeyData.value }) : ""
);
</script>

<template>
  <div v-if="loading" class="center">Chargement...</div>
  <div v-else-if="error" class="error">{{ error }}</div>

  <section v-else-if="journeyData" class="journey-details">
    <div class="journey-header-container">
      <div class="journey-header">
        <i
          :class="['pi', typeInfo.icon]"
          :style="{ color: `var(--p-${typeInfo.color}-500)`, fontSize: '2rem' }"
          aria-hidden="true"
        />
        <h1>{{ journeyData.title }}</h1>
      </div>
      <Button
        label="Supprimé"
        @click="deleteJourney({ journeyId: journeyData.id })"
      />
    </div>

    <p class="date">{{ formattedDate }}</p>
    <div class="tags-row">
      <Tag
        :severity="journeyData.isFullDay ? 'info' : 'success'"
        :value="journeyData.isFullDay ? 'Journée complète' : duration"
      />
      <Tag
        v-if="journeyData.needPMR"
        severity="warning"
        value="Accessible PMR"
      />
    </div>

    <section class="activities-section">
      <h2>Activités</h2>
      <ul>
        <li
          v-for="activity in journeyData.activities"
          :key="activity.id"
          class="activity-item"
        >
          <ActivityCard :activity="activity" />
        </li>
      </ul>
    </section>

    <section class="restaurant-section">
      <h2>Restaurant</h2>
      <div v-if="journeyData.restaurant" class="restaurant-info">
        <div class="header">
          <h3>{{ journeyData.restaurant.title }}</h3>
          <Badge>
            {{ journeyData.restaurant.prix_min }}€ -
            {{ journeyData.restaurant.prix_max }}€
          </Badge>
        </div>
        <p>{{ journeyData.restaurant.type }}</p>

        <div class="tags-row">
          <Tag
            v-if="journeyData.restaurant.amis"
            severity="info"
            value="Amis"
          />
          <Tag
            v-if="journeyData.restaurant.couple"
            severity="warning"
            value="Couple"
          />
          <Tag
            v-if="journeyData.restaurant.famille"
            severity="success"
            value="Famille"
          />
        </div>
        <div>
          <h4>Accès</h4>
          <p>Métro : {{ journeyData.restaurant.metro }}</p>
          <MapEmbed :address="journeyData.restaurant.address" />
        </div>
      </div>
      <p v-else class="no-restaurant">Aucun restaurant associé</p>
    </section>
  </section>
</template>

<style scoped>
.center {
  text-align: center;
  font-size: 1.1rem;
}

.error {
  color: #d9534f;
  text-align: center;
  font-weight: bold;
}

.journey-header-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.journey-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-left: 0.5rem;
  margin-bottom: 0.5rem;
}

.journey-header h1 {
  font-weight: 700;
  font-size: 1.8rem;
  margin: 0;
  color: var(--p-primary-400);
}

.date {
  font-size: 1rem;
  color: var(--p-gray-600);
  margin-bottom: 1rem;
}

.tags-row {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.activities-section,
.restaurant-section {
  margin-bottom: 2rem;
}

.activities-section h2,
.restaurant-section h2 {
  font-weight: 600;
  font-size: 1.4rem;
  margin-bottom: 0.75rem;
  border-bottom: 2px solid var(--p-primary-400);
  padding-bottom: 0.3rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.external-link {
  margin-left: auto;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
}

.external-link:hover {
  text-decoration: underline;
}

.restaurant-info h3 {
  margin: 0 0 0.25rem 0;
  font-weight: 700;
  font-size: 1.3rem;
}

.restaurant-info p {
  margin: 0.2rem 0;
  font-size: 1rem;
}

.no-restaurant {
  font-style: italic;
  text-align: center;
}
.header {
  display: flex;
  justify-content: space-between;
}
@media (min-width: 768px) {
  .journey-header-container {
    flex-direction: row;
  }
}
</style>
