<script setup lang="ts">
  import { storeToRefs } from 'pinia'

  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)

  const router = useRouter()
  function goTo(type: string) {
    router.push({ name: 'generate-journey', query: { formType: type } })
  }
</script>

<template>
  <div v-if="user">
    <h1>Bienvenue {{ user.email }}</h1>
    <h2>Ravi de te revoir !</h2>
    <div class="space-y-4 mt-6">
      <div class="flex gap-4">
        <div
          class="flex flex-col justify-between p-4 rounded-xl shadow-md h-[175px] flex-1 bg-blue-100 cursor-pointer hover:scale-105 transition"
          @click="goTo('friends')"
        >
          <p class="font-semibold text-base mt-auto">Entre potes</p>
        </div>

        <div
          class="flex flex-col justify-between p-4 rounded-xl shadow-md h-[175px] flex-1 bg-green-100 cursor-pointer hover:scale-105 transition"
          @click="goTo('family')"
        >
          <p class="font-semibold text-base mt-auto">En famille</p>
        </div>
      </div>

      <div class="flex gap-4">
        <div
          class="flex flex-col justify-between p-4 rounded-xl shadow-md h-[175px] flex-grow bg-pink-100 cursor-pointer hover:scale-105 transition"
          @click="goTo('romantic')"
        >
          <p class="font-semibold text-base mt-auto">En couple</p>
        </div>

        <div
          class="relative flex items-center justify-center p-4 rounded-xl shadow-md h-[175px] w-[30%] bg-yellow-100 cursor-pointer hover:scale-105 transition"
          @click="goTo('random')"
        >
          <p class="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 font-semibold text-base">
            Aléatoire
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
