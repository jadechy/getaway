<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
  completeJourney,
  findActivityFromAnswers,
} from "~/composables/service/journeyService";
import type { JourneyData } from "~/types/activity";

const route = useRoute();
const router = useRouter();

const journeyId = route.params.id as string;

const journey = ref<JourneyData | null>(null);
const baseJourney = ref<any | null>(null);
const activityList = ref<any[] | null>(null);
const restaurantsList = ref<any[] | null>(null);
const activity1 = ref(0);
const activity2 = ref(29);
const restaurant = ref(0);
const { searchRestaurantsByTypes, fetchJourneyById, fetchAnswersByJourneyId } =
  useJourney();
onMounted(async () => {
  journey.value = await fetchJourneyById({ journeyId });
  baseJourney.value = journey.value;
  const answers = await fetchAnswersByJourneyId({ journeyId });

  if (answers && journey.value) {
    activityList.value = await findActivityFromAnswers(answers, journey.value);
    const allAnswersType = Array.from(
      new Set(answers.flatMap((a: any) => a.restaurant))
    );
    const priceList = answers.map((a: any) => a.restoPriceRange[1]);
    const minPrice = Math.min(...priceList);
    restaurantsList.value = await searchRestaurantsByTypes(
      allAnswersType,
      journey.value.type,
      minPrice
    );
  }
});

function shuffleAct1() {
  activity1.value = (activity1.value + 1) % (activityList.value?.length || 1);
}

function shuffleAct2() {
  activity2.value = activity2.value > 0 ? activity2.value - 1 : 29;
}

function shuffleRest() {
  restaurant.value =
    (restaurant.value + 1) % (restaurantsList.value?.length || 1);
}

async function handleRegenerate() {
  shuffleAct1();
  shuffleAct2();
  shuffleRest();
}

async function handleSave() {
  const completeData = {
    isFullDay: baseJourney.value?.isFullDay,
    activity1Id: activityList.value?.[activity1.value].id,
    activity2Id: activityList.value?.[activity2.value].id,
    restaurantId: restaurantsList.value?.[restaurant.value].id,
  };
  try {
    await completeJourney({ journeyId, completeData });
    router.push({ name: "journey-id", params: { journeyId } });
  } catch (e) {
    console.error("Erreur lors de la sauvegarde de la journée", e);
  }
}
</script>

<template>
  <div v-if="restaurantsList">
    <section>
      <CardJouney :journey="journey" v-if="journey" />
      <div class="btns">
        <Button
          label="Régénérer"
          @click="handleRegenerate"
          backgroundColor="#333"
        />

        <Button label="Enregistrer la sortie" @click="handleSave" />
      </div>
    </section>

    <article id="restaurant">
      <h2>Le restaurant</h2>
      <RestaurantDisplay :restaurant="restaurantsList[restaurant]" />
    </article>

    <article v-if="activityList" id="activities">
      <h2>Les activités</h2>
      <div>
        <ActivityCard :activity="activityList[activity1]" />
        <ActivityCard
          :activity="activityList[activity2]"
          v-if="journey?.isFullDay"
        />
      </div>
    </article>
  </div>
</template>

<style scoped>
#restaurant {
  margin-top: 4rem;
}
#activities {
  & > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3rem;
  }
  margin-block: 4rem;
}
.btns {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
}

/* Tablette (≥ 768px) */
@media (min-width: 768px) {
  .btns {
    flex-direction: row;
    justify-content: center;
  }

  #activities > div {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
  }
}

/* Desktop (≥ 1024px) */
@media (min-width: 1024px) {
  section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .btns {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
