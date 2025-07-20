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
    error.value = `Erreur lors du chargement des journeys, ${e}`;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div v-if="loading">Chargement...</div>
  <div v-else-if="error">{{ error }}</div>
  <ul v-else-if="journeys.length > 0">
    <li
      v-for="journey in journeys"
      :key="journey.id"
      @click="router.push(`/journey/${journey.id}`)"
    >
      <CardJouney :journey="journey" />
    </li>
  </ul>
  <p v-else>Pas encore de sortie enregistées</p>
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
