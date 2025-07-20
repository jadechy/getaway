<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "@/composables/useAuth";
import { InputText } from "primevue";
definePageMeta({
  layout: "auth",
});

const { registerUser } = useAuth();

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const error = ref("");

const handleRegister = async () => {
  try {
    error.value = "";
    await registerUser({
      email: email.value,
      password: password.value,
      firstName: firstName.value,
      lastName: lastName.value,
    });

    navigateTo("/");
  } catch (err: any) {
    error.value = err.message;
  }
};
</script>

<template>
  <h2>Créer un compte</h2>
  <form @submit.prevent="handleRegister">
    <div>
      <InputText v-model="firstName" placeholder="Prénom" />
      <InputText v-model="lastName" placeholder="Nom" />
      <InputText v-model="email" placeholder="Email" />
      <InputText v-model="email" placeholder="Age" />
      <InputText
        v-model="password"
        type="password"
        placeholder="Mot de passe"
      />
      <InputText
        v-model="password"
        type="password"
        placeholder="Confirmation de mot de passe"
      />
    </div>
    <Button type="submit">Créer un compte</Button>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  align-items: center;
  & > div {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
}
</style>
