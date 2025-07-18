<script setup lang="ts"></script>

<template>
  <h2>Bienvenue sur Getaway</h2>
  <p>Avec Getaway créé des sorties inoubliables sur mesure</p>
  <Button asChild v-slot="slotProps">
    <RouterLink to="/auth/register" :class="slotProps.class">
      Créer un compte gratuitement
    </RouterLink>
  </Button>
  <Button asChild v-slot="slotProps">
    <RouterLink to="/auth/login" :class="slotProps.class">
      Se connecter
    </RouterLink>
  </Button>
</template>

<style></style>
