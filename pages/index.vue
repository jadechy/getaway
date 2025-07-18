<script setup lang="ts">
import { Image } from "primevue";
import picture from "../assets/img/homepage.jpg";
const router = useRouter();
</script>

<template>
  <article>
    <div class="leftSection">
      <h1>Bienvenue sur Getaway</h1>
      <h2>Avec Getaway créé des sorties inoubliables sur mesure</h2>
      <div class="group-btn">
        <Button @click="router.push('/auth/register')" label="Démarrer" />
        <Button
          @click="router.push('/auth/login')"
          label="Se connecter"
          variant="outlined"
        />
      </div>
    </div>
    <img :src="picture" />
  </article>
</template>

<style scoped>
h1 {
  font-size: medium;
  font-weight: 500;
}
h2 {
  font-size: xx-large;
  font-weight: bold;
}
.group-btn {
  display: flex;
  gap: 8px;
}
.leftSection {
  width: 50%;
}
article {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
img {
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 5px;
}
</style>
