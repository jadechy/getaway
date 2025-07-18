<script setup lang="ts">
    import { ref } from 'vue'
    import { useUserStore } from '../../stores/userStore'
    import { useRouter } from 'vue-router'

    const userStore = useUserStore()
    const router = useRouter()
    
    const email = ref('')
    const password = ref('')

    const login = async () => {
        try {
            await userStore.login(email.value, password.value)
            router.push('/')
        } catch (err) {
            console.error('Login error:', userStore.error)
        }
    }
</script>

<template>
  <h2 class="text-center text-4xl mb-14">Connexion</h2>
  <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="email">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            class="w-full p-3 border rounded-md"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="password">Mot de passe</label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="w-full p-3 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Se connecter
        </button>
    </form>
</template>

<style></style>
