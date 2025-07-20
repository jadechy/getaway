<script setup lang="ts">
import { InputText } from "primevue";
import type { CreateJourneyAnswers } from "~/types/answer";

const form = defineModel<CreateJourneyAnswers>({ required: true });
</script>

<template>
  <div class="form-wrapper">
    <div class="form-group">
      <label for="journeyName">Nom de la sortie</label>
      <InputText
        id="journeyName"
        v-model="form.journeyName"
        placeholder="Nom de la sortie"
      />
    </div>

    <div class="form-group">
      <label for="journeyDate">Date</label>
      <DatePicker
        id="journeyDate"
        v-model="form.journeyDate"
        show-icon
        fluid
        icon-display="input"
        placeholder="jj/mm/aaaa"
      />
    </div>

    <div class="form-group">
      <label for="startTime">Heure de début</label>
      <DatePicker
        id="startTime"
        v-model="form.journeyStartingTime"
        show-icon
        fluid
        icon-display="input"
        time-only
        placeholder="--:--"
      >
        <template #inputicon="slotProps">
          <i class="pi pi-clock" @click="slotProps.clickCallback" />
        </template>
      </DatePicker>
    </div>

    <div class="form-group">
      <label for="endTime">Heure de fin</label>
      <DatePicker
        id="endTime"
        v-model="form.journeyEndingTime"
        show-icon
        fluid
        icon-display="input"
        time-only
        placeholder="--:--"
      >
        <template #inputicon="slotProps">
          <i class="pi pi-clock" @click="slotProps.clickCallback" />
        </template>
      </DatePicker>
    </div>

    <div class="form-group">
      <label>Type de journée</label>
      <SelectButton
        v-model="form.journeyIsFullDay"
        :options="[
          { label: 'Journée complète', value: true },
          { label: 'Demi-journée', value: false },
        ]"
        option-label="label"
        option-value="value"
        class="form-select"
      />
    </div>
    <div class="form-group">
      <div class="label-price-range">
        <label for="memberSlider">Nombre de membre</label>
        <p v-if="form.journeyMemberNumber">
          {{ form.journeyMemberNumber }} personnes(s)
        </p>
      </div>
      <Slider
        id="memberSlider"
        v-model="form.journeyMemberNumber"
        type="range"
        :min="1"
        :max="15"
        class="form-slider"
      />
    </div>

    <div class="form-group pmr">
      <label>Besoin PMR</label>
      <ToggleButton
        v-model="form.journeyNeedPMR"
        on-label="PMR"
        off-label="Non PMR"
      />
    </div>
  </div>
</template>

<style>
.form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-slider {
  padding-top: 0.5rem;
}

.pmr button {
  width: fit-content;
}
</style>
