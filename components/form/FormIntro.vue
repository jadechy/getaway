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
        showIcon
        fluid
        iconDisplay="input"
        placeholder="jj/mm/aaaa"
      />
    </div>

    <div class="form-group">
      <label for="startTime">Heure de début</label>
      <DatePicker
        id="startTime"
        v-model="form.journeyStartingTime"
        showIcon
        fluid
        iconDisplay="input"
        timeOnly
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
        showIcon
        fluid
        iconDisplay="input"
        timeOnly
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
        v-model="form.journeyNeedPMR"
        :options="[true, false]"
        class="form-select"
      >
        <template #option="slotProps">
          <span>
            {{
              slotProps.option === true ? "Journée complète" : "Demi-journée"
            }}
          </span>
        </template>
      </SelectButton>
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
        type="range"
        :min="1"
        :max="15"
        class="form-slider"
        v-model="form.journeyMemberNumber"
      />
    </div>

    <div class="form-group">
      <label>Besoin PMR</label>
      <SelectButton
        v-model="form.journeyNeedPMR"
        :options="[true, false]"
        class="form-select"
      >
        <template #option="slotProps">
          <span>
            {{ slotProps.option === true ? "PMR" : "Pas PMR" }}
          </span>
        </template>
      </SelectButton>
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
</style>
