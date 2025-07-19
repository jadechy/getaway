<script setup lang="ts">
import type { InputTextProps } from "primevue";
import WrapperInput from "./WrapperInput.vue";
import type { FormState } from "~/types/formType";

interface Props {
  name: InputTextProps["name"];
  required?: InputTextProps["required"];
  placeholder?: InputTextProps["placeholder"];
  disabled?: InputTextProps["disabled"];
  readonly?: InputTextProps["readonly"];
  type?: InputTextProps["type"];
  autocomplete?: InputTextProps["autocomplete"];
  form: FormState;
}

defineProps<Props>();
</script>

<template>
  <WrapperInput :name :placeholder :form class="wrapper">
    <InputText
      :id="name"
      :name="name"
      :disabled="disabled"
      :readonly="readonly"
      :type="type || 'text'"
      fluid
      :autocomplete="autocomplete"
    />
  </WrapperInput>
</template>
<style scoped>
.wrapper {
  width: 100%;
}
</style>
