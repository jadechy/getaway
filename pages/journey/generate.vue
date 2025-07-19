<script setup lang="ts">
import { ref, type Component } from "vue";
import type { CreateJourneyAnswers } from "~/types/answer";
import { useJourney } from "~/composables/useJourney";
import { ActivityType } from "~/types/journey";
import FormIntro from "~/components/form/FormIntro.vue";
import FormTypeRange from "~/components/form/FormTypeRange.vue";

const { createJourney } = useJourney();

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const router = useRouter();
const route = useRoute();
const rawType = route.query.formType as string;
const isValidActivityType = Object.values(ActivityType).includes(
  rawType as ActivityType
);
const journeyActivityType = isValidActivityType
  ? (rawType as ActivityType)
  : ActivityType.random;

const formAnswers = ref<CreateJourneyAnswers>({
  userId: "",
  journeyName: "",
  journeyDate: new Date(),
  journeyStartingTime: new Date(),
  journeyEndingTime: new Date(),
  journeyMemberNumber: 1,
  journeyNeedPMR: false,
  journeyIsFullDay: false,
  journeyActivityType: journeyActivityType,
  activity: {
    types: [],
    priceRange: [0, 100],
  },
  restaurant: {
    types: [],
    priceRange: [0, 100],
  },
});

onMounted(async () => {
  if (!user.value) return;
  formAnswers.value.userId = user.value.uid;
});

type Step = {
  label: string;
  component: Component;
};
const steps: Step[] = [
  { label: "Info générale", component: FormIntro },
  { label: "Activité", component: FormTypeRange },
  {
    label: "Restaurant",
    component: FormTypeRange,
  },
];

const handleSubmit = async (answers: CreateJourneyAnswers) => {
  console.log("Soumission des réponses :", answers);
  if (!formAnswers.value) return;
  try {
    const journey = await createJourney(formAnswers.value);
    router.push(`/journey/${journey.id}/result`);
  } catch (e) {
    console.error("Erreur lors de la création :", e);
  }
};
</script>

<template>
  <p v-if="userStore.loading">Chargement en cours...</p>
  <p v-else-if="!userStore.user">Utilisateur non connecté.</p>
  <template v-else>
    <Stepper :value="0">
      <StepList>
        <Step v-for="(step, i) in steps" :key="i" :value="i">{{
          step.label
        }}</Step>
      </StepList>
      <StepPanels>
        <StepPanel
          class="journey-stepper"
          v-for="(step, i) in steps"
          :key="i"
          :value="i"
          v-slot="{ activateCallback }"
        >
          <component
            :is="step.component"
            v-model="formAnswers"
            :isActivity="step.label === 'Activité'"
          />
          <div class="btns">
            <Button
              :disabled="i === 0"
              label="Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              @click="activateCallback(i - 1)"
            />
            <Button
              v-if="i !== steps.length - 1"
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              @click="activateCallback(i + 1)"
            />
            <Button
              v-if="i === steps.length - 1"
              @click="handleSubmit(formAnswers)"
              :label="
                formAnswers.journeyIsFullDay
                  ? 'Génère ton incroyable journée !'
                  : 'Génère ton incroyable demi-journée !'
              "
            />
          </div>
        </StepPanel>
      </StepPanels>
    </Stepper>
  </template>
</template>

<style scoped>
.btns {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

:deep(.journey-stepper) {
  padding: 20px;
}
</style>
