<script setup lang="ts">
import CardJouney from "~/components/journey/CardJouney.vue";
import type { BaseJourney } from "~/types/journey";

const { fetchJourneysByUser } = useJourney();

const journeys = ref<BaseJourney[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const router = useRouter();

onMounted(async () => {
  loading.value = true;
  try {
    journeys.value = await fetchJourneysByUser();
  } catch (e) {
    error.value = "Erreur lors du chargement des journeys";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div v-if="loading">Chargement...</div>
  <div v-if="error">{{ error }}</div>
  <ul v-if="!loading && !error">
    <li
      v-for="(journey, i) in journeys"
      :key="journey.id"
      @click="router.push(`/journey/${journey.id}`)"
    >
      <CardJouney :journey="journey" />
    </li>
  </ul>
</template>

<style scoped>
ul {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  padding: 0;
  margin: 0;
  list-style: none;
}
</style>
