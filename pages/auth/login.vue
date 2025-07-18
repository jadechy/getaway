<script setup lang="ts">
import { Button, Password } from "primevue";
import { Form } from "@primevue/forms";
import type { FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { useUserStore } from "../../stores/userStore";
import { useRouter } from "vue-router";
import { LoginRequestSchema } from "~/types/authType";

definePageMeta({
  layout: "auth",
});

const userStore = useUserStore();
const router = useRouter();

const submitLogin = async (form: FormSubmitEvent) => {
  if (!form.valid) return;
  const { email, password } = form.states;

  if (!email || !password) {
    console.error("Email or password field is missing");
    return;
  }

  try {
    await userStore.login(email.value, password.value);
    router.push("/");
  } catch (err) {
    console.error("Login error:", userStore.error);
  }
};
</script>

<template>
  <h2>Connexion</h2>
  <Form
    v-slot="$form"
    :resolver="zodResolver(LoginRequestSchema)"
    class="form-container"
    @submit="submitLogin"
  >
    <FormInput
      name="email"
      placeholder="Ton email"
      :form="$form"
      autocomplete="util_mail"
    />
    <div class="input-wrapper">
      <WrapperInput :form="$form" name="password" placeholder="Mot de passe">
        <Password
          fluid
          name="password"
          class="password-input"
          toggle-mask
          :feedback="false"
          :input-props="{ autocomplete: 'current-password' }"
        />
      </WrapperInput>
    </div>
    <div class="actions">
      <Button type="submit" class="submit-button">Se connecter</Button>
      <RouterLink :to="{ name: 'auth-register' }" class="register-link"
        >Pas encore de compte</RouterLink
      >
    </div>
  </Form>
</template>

<style scoped>
h2 {
  font-size: x-large;
  margin: 0px;
  margin-bottom: 10px;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  width: 100%;
}

@media (min-width: 768px) {
  h2 {
    text-align: center;
  }
  .form-container {
    width: 50%;
    margin-left: auto;
    margin-right: auto;
  }
}

.input-wrapper {
  width: 100%;
}

.password-input {
  width: 100%;
}

.actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}

.submit-button {
  width: fit-content;
}

.register-link {
  text-decoration: none;
  transition: text-decoration 0.2s;
}

.register-link:hover {
  text-decoration: underline;
}
</style>
