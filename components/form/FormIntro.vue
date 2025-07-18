<script setup lang="ts">
import type { FormStepProps } from '~/types/form-types';

const props = defineProps<FormStepProps>();

const onNameChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  props.setFormAnswers({
    ...props.formAnswers,
    journeyName: input.value
  });
};

const onDateChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const selectedDate = new Date(input.value);
  if (!isNaN(selectedDate.getTime())) {
    props.setFormAnswers({
      ...props.formAnswers,
      journeyDate: selectedDate
    });
  }
};

const onStartTimeChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const [hStr, mStr] = input.value.split(':');
  const hours = Number(hStr);
  const minutes = Number(mStr);
  if (!isNaN(hours) && !isNaN(minutes)) {
    const newDate = new Date(props.formAnswers.journeyStartingTime);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    props.setFormAnswers({
      ...props.formAnswers,
      journeyStartingTime: newDate
    });
  }
};

const onEndTimeChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const [hStr, mStr] = input.value.split(':');
  const hours = Number(hStr);
  const minutes = Number(mStr);
  if (!isNaN(hours) && !isNaN(minutes)) {
    const newDate = new Date(props.formAnswers.journeyEndingTime);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    props.setFormAnswers({
      ...props.formAnswers,
      journeyEndingTime: newDate
    });
  }
};

const onPeopleChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const value = Number(input.value);
  if (!isNaN(value)) {
    props.setFormAnswers({
      ...props.formAnswers,
      journeyMemberNumber: value
    });
  }
};

const togglePMR = (value: boolean) => {
  props.setFormAnswers({
    ...props.formAnswers,
    journeyNeedPMR: value
  });
};
</script>

<template>
  <div>
    <input
      type="text"
      :value="props.formAnswers.journeyName"
      @input="onNameChange"
      placeholder="Nom de la sortie"
    />

    <input
      type="date"
      @input="onDateChange"
    />

    <input
      type="time"
      @input="onStartTimeChange"
    />

    <input
      type="time"
      @input="onEndTimeChange"
    />

    <input
      type="range"
      min="1"
      max="10"
      :value="props.formAnswers.journeyMemberNumber"
      @input="onPeopleChange"
    />

    <div>
      <button @click="togglePMR(true)">PMR Oui</button>
      <button @click="togglePMR(false)">PMR Non</button>
    </div>
  </div>
</template>
