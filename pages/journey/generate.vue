<script setup lang="ts">
import { ref } from "vue";
import Stepper from "~/components/general/form/Stepper.vue";
import FormIntro from "~/components/form/FormIntro.vue";
import FormChoice from "~/components/form/FormChoice.vue";
import FormActivity from "~/components/form/FormActivity.vue";
import FormResto from "~/components/form/FormResto.vue";
import type { createJourneyAnswers } from "~/types/answer";
import { useJourney } from "~/composables/useJourney";
import { ActivityType } from "~/types/activity";

const { createJourney } = useJourney();

const router = useRouter();
const route = useRoute();
const { currentUser } = useAuth();
if (!currentUser.value) {
  throw new Error("Utilisateur non connecté");
}

const currentStep = ref(0);

const isLastStep = computed(() => currentStep.value === steps.length - 1);

const steps = [FormIntro, FormChoice, FormActivity, FormResto];

const rawType = route.query.type as string;
const isValidActivityType = Object.values(ActivityType).includes(
  rawType as ActivityType
);
const journeyActivityType = isValidActivityType
  ? (rawType as ActivityType)
  : ActivityType.random;

const formAnswers = ref<createJourneyAnswers>({
  userId: currentUser.value.uid,
  journeyName: "",
  journeyDate: new Date(),
  journeyStartingTime: new Date(),
  journeyEndingTime: new Date(),
  journeyMemberNumber: 1,
  journeyNeedPMR: false,
  journeyIsFullDay: false,
  journeyActivityType: journeyActivityType,
  answerActivityOptions: [],
  answerPriceRange: [0, 100],
  answerRestaurantTypes: [],
  answerRestaurantPriceRange: [0, 100],
});

function setCurrentStep(index: number) {
  currentStep.value = index;
}

function goToNextStep() {
  if (currentStep.value < steps.length - 1) currentStep.value++;
}

function goToPreviousStep() {
  if (currentStep.value > 0) currentStep.value--;
}

function setFormAnswers(newAnswers: any) {
  formAnswers.value = newAnswers;
}

async function handleSubmit(answers: createJourneyAnswers) {
  console.log("Soumission des réponses :", answers);
  try {
    const journey = await createJourney(formAnswers.value);
    router.push(`/journey/${journey.id}`);
  } catch (e) {
    console.error("Erreur lors de la création :", e);
  }
}
</script>

<template>
  <button @click="router.push({ name: 'home' })">Retour à l'accueil</button>
  <div>
    <Stepper
      :total="steps.length"
      :current="currentStep"
      :set-current-step="setCurrentStep"
    />

    <component
      :is="steps[currentStep]"
      :form-answers="formAnswers"
      :set-form-answers="setFormAnswers"
    />

    <div>
      <button @click="goToPreviousStep" :disabled="currentStep === 0">
        Précédent
      </button>

      <button v-if="isLastStep" @click="handleSubmit(formAnswers)">
        {{
          formAnswers.journeyIsFullDay
            ? "Génère ton incroyable journée !"
            : "Génère ton incroyable demi-journée !"
        }}
      </button>

      <button v-else @click="goToNextStep">
        {{ currentStep === 0 ? "Suivant" : "Passe à la suite !" }}
      </button>
    </div>
  </div>
</template>
