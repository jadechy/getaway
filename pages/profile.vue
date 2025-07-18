<script setup lang="ts">
  definePageMeta({
    middleware: ['auth']
  })
  import { useUserStore } from '@/stores/userStore'
  import { storeToRefs } from 'pinia'

  const userStore = useUserStore()
  userStore.init()
  const { user } = storeToRefs(userStore)
</script>

<template>
  <div v-if="user">
    <h1>Bienvenue {{ user.email }}</h1>
  </div>
  <div v-else>
    <p>Vous n'êtes pas connecté.</p>
  </div>
</template>
