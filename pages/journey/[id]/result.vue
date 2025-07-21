<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useActivity } from "~/composables/useActivity";
import { useAnswer } from "~/composables/useAnswer";

import type { ActivityApiType, JourneyData } from "~/types/activity";
import type { CompleteData } from "~/types/journey";
import type { Restaurant } from "~/types/restaurant";

const route = useRoute();
const router = useRouter();

const journeyId = route.params.id as string;

const journey = ref<JourneyData | null>(null);
const activityList = ref<ActivityApiType[] | null>(null);
const restaurantsList = ref<Restaurant[] | null>(null);
const activity1 = ref(0);
const activity2 = ref(29);
const restaurant = ref(0);
const { searchRestaurantsByTypes, fetchJourneyById, completeJourney } =
  useJourney();
const { fetchAnswersByJourneyId } = useAnswer();
const { findActivityFromAnswers } = useActivity();
onMounted(async () => {
  try {
    journey.value = await fetchJourneyById({ journeyId });
    const answers = await fetchAnswersByJourneyId({ journeyId });
    if (!answers || !journey.value) return;

    activityList.value = await findActivityFromAnswers(answers, journey.value);
    const allAnswersType = Array.from(
      new Set(answers.flatMap((a) => a.restaurant))
    );

    const priceList = answers.map((a) => a.restoPriceRange[1]);
    const minPrice = Math.min(...priceList);
    restaurantsList.value = await searchRestaurantsByTypes(
      allAnswersType,
      journey.value.type,
      minPrice
    );
  } catch (e) {
    console.error(e);
  }
});

const shuffleAct1 = () => {
  activity1.value = (activity1.value + 1) % (activityList.value?.length || 1);
};

const shuffleAct2 = () => {
  activity2.value = activity2.value > 0 ? activity2.value - 1 : 29;
};

const shuffleRest = () => {
  restaurant.value =
    (restaurant.value + 1) % (restaurantsList.value?.length || 1);
};

const handleRegenerate = async () => {
  shuffleAct1();
  shuffleAct2();
  shuffleRest();
};

const handleSave = async () => {
  const activity1Id = activityList.value?.[activity1.value]?.id;
  const activity2Id = activityList.value?.[activity2.value]?.id;
  const restaurantId = restaurantsList.value?.[restaurant.value]?.id;

  if (
    journey.value?.isFullDay === undefined ||
    !activity1Id ||
    !activity2Id ||
    !restaurantId
  ) {
    console.warn("Certaines données sont manquantes :");
    console.warn({ activity1Id, activity2Id, restaurantId });
    return;
  }
  const completeData: CompleteData = {
    isFullDay: journey.value?.isFullDay,
    activity1Id: activity1Id,
    activity2Id: activity2Id,
    restaurantId: restaurantId,
  };
  try {
    await completeJourney({ journeyId, completeData });
    router.push({ name: "journey-id", params: { journeyId } });
  } catch (e) {
    console.error("Erreur lors de la sauvegarde de la journée", e);
  }
};
</script>

<template>
  <div v-if="restaurantsList">
    <section>
      <CardJouney v-if="journey" :journey="journey" />
      <div class="btns">
        <Button
          label="Régénérer"
          background-color="#333"
          @click="handleRegenerate"
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
          v-if="journey?.isFullDay"
          :activity="activityList[activity2]"
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
