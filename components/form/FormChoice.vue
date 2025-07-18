<script setup lang="ts">
import type { FormStepProps } from '~/types/form-types';

const props = defineProps<FormStepProps>();

const setChoice = (val: boolean) => {
  props.setFormAnswers({
    ...props.formAnswers,
    journeyIsFullDay: val
  });
};
</script>

<template>
  <div>
    <button @click="setChoice(false)">Demi-journée</button>
    <button @click="setChoice(true)">Journée complète</button>
  </div>
</template>
