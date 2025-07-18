<script setup lang="ts">
  const router = useRouter();
</script>

<template>
  <h2>Bienvenue sur Getaway</h2>
  <p>Avec Getaway créé des sorties inoubliables sur mesure</p>
  <button @click="router.push({ name: 'auth-register' })">Créer un compte gratuitement</button>
  <button @click="router.push({ name: 'auth-login' })">Se connecter</button>
</template>

<style></style>
