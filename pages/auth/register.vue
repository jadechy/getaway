<script setup lang="ts">
    import { ref } from 'vue'
    import { useAuth } from '@/composables/useAuth'

    const { registerUser } = useAuth()

    const firstName = ref('')
    const lastName = ref('')
    const email = ref('')
    const password = ref('')
    const error = ref('')

    const handleRegister = async () => {
        try {
            error.value = ''
            await registerUser({
            email: email.value,
            password: password.value,
            firstName: firstName.value,
            lastName: lastName.value,
            })
            
            navigateTo('/')
        } catch (err: any) {
            error.value = err.message
        }
    }
</script>

<template>
  <h2 class="text-center text-4xl mb-14">Créer un compte</h2>
  <form @submit.prevent="handleRegister">
    <input v-model="firstName" placeholder="Prénom" />
    <input v-model="lastName" placeholder="Nom" />
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Mot de passe" />
    <button type="submit">Créer un compte</button>
  </form>
</template>

<style></style>
