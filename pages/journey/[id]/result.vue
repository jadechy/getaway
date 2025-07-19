<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import Recap from "@/components/journey/Recap.vue";
import StepPreview from "@/components/journey/StepPreview.vue";
import StepPreviewWithReload from "@/components/journey/StepPreviewWithReload.vue";
import {
  completeJourney,
  fetchBaseJourneyAnswersFromId,
  fetchBaseJourneyFromId,
  findActivityFromAnswers,
} from "~/composables/service/journeyService";
import { recapJourneyInformation } from "~/utils/journey/recapJourney";
import {
  formatActivityFromAPIToStep,
  formatRestaurantFromBDDToStep,
} from "@/utils/journey/formatStepJourney";

const route = useRoute();
const router = useRouter();

const journeyId = route.params.id as string;

const baseJourney = ref<any | null>(null);
const activityList = ref<any[] | null>(null);
const restaurantsList = ref<any[] | null>(null);

const activity1 = ref(0);
const activity2 = ref(29);
const restaurant = ref(0);
const { searchRestaurantsByTypes } = useJourney();
onBeforeMount(async () => {
  useAuth();

  const journey = await fetchBaseJourneyFromId(journeyId);
  baseJourney.value = journey;
  console.log('journey:', journey);
  console.log('baseJourney.value:', baseJourney.value)

  const answers = await fetchBaseJourneyAnswersFromId(journeyId);
  if (answers && journey) {
    activityList.value = await findActivityFromAnswers(answers, journey);

    const allAnswersType = Array.from(
      new Set(answers.flatMap((a: any) => a.restaurant))
    );
    const priceList = answers.map((a: any) => a.restoPriceRange[1]);
    const minPrice = Math.min(...priceList);
    restaurantsList.value = await searchRestaurantsByTypes(
      allAnswersType,
      journey.type,
      minPrice
    );
  }
});

console.log(baseJourney);

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
  <div>
    <Recap :journeys="[baseJourney]" color="green" />

    <div>
      <StepPreviewWithReload :reload="shuffleAct1">
        <StepPreview
          :step="formatActivityFromAPIToStep(activityList?.[activity1], true)"
        />
      </StepPreviewWithReload>

      <StepPreviewWithReload
        v-if="restaurantsList?.length"
        :reload="shuffleRest"
      >
        <StepPreview
          :step="formatRestaurantFromBDDToStep(restaurantsList[restaurant])"
        />
      </StepPreviewWithReload>

      <p v-else>Aucun restaurant trouvé...</p>

      <StepPreviewWithReload
        v-if="baseJourney?.isFullDay"
        :reload="shuffleAct2"
      >
        <StepPreview
          :step="formatActivityFromAPIToStep(activityList?.[activity2], false)"
        />
      </StepPreviewWithReload>
    </div>

    <Button
      label="Régénérer"
      @click="handleRegenerate"
      backgroundColor="#333"
    />

    <Button
      :label="
        baseJourney?.isFullDay
          ? 'Enregistrer la journée'
          : 'Enregistrer la demi-journée'
      "
      @click="handleSave"
    />
  </div>
</template>

<style scoped></style>
