<script setup lang="ts">
    import { Button, Password } from "primevue";
    import { Form } from "@primevue/forms";
    import type { FormSubmitEvent } from "@primevue/forms";
    import { zodResolver } from "@primevue/forms/resolvers/zod";
    import { useUserStore } from '../../stores/userStore'
    import { useRouter } from 'vue-router'
    import { LoginRequestSchema } from "~/types/authType";

    const userStore = useUserStore()
    const router = useRouter()

    const submitLogin = async (form: FormSubmitEvent) => {
      if (!form.valid) return;
      const emailField = form.states.email;
      const passwordField = form.states.password;

      if (!emailField || !passwordField) {
        console.error('Email or password field is missing');
        return;
      }
      
      try {
        await userStore.login(emailField.value, passwordField.value);
        router.push('/');
      } catch (err) {
        console.error('Login error:', userStore.error);
      }
    }
</script>

<template>
  <h2 class="text-center text-4xl mb-14">Connexion</h2>
  <Form
    v-slot="$form"
    :resolver="zodResolver(LoginRequestSchema)"
    class="flex flex-col md:w-1/2 mx-5 md:mx-auto gap-6 items-center"
    @submit="submitLogin"
  >
    <!-- <div class="flex justify-center">
      <GoogleComponent />
    </div> -->
    <FormInput
      name="email"
      placeholder="Ton email"
      :form="$form"
      autocomplete="util_mail"
    />
    <div class="w-full">
      <WrapperInput :form="$form" name="password" placeholder="Mot de passe">
        <Password
          fluid
          name="password"
          class="w-full"
          toggle-mask
          :feedback="false"
          :input-props="{ autocomplete: 'current-password' }"
        />
      </WrapperInput>
      <RouterLink
        :to="{ name: 'auth-forgot' }"
        class="w-full text-end block text-gray-400 hover:underline"
        >J'ai oublié mon mot de passe</RouterLink
      >
    </div>
    <div class="flex flex-col items-center gap-0.5">
      <Button type="submit" class="w-fit">Se connecter</Button>
      <RouterLink :to="{ name: 'auth-register' }" class="hover:underline"
        >Pas encore de compte</RouterLink
      >
    </div>
  </Form>
</template>
