<script setup lang="ts">
import HeaderComponent from "./HeaderComponent.vue";
const router = useRouter();
</script>

<template>
  <HeaderComponent />
  <main>
    <slot />
  </main>
</template>
<style scoped>
main {
  padding-inline: 2.5rem;
  margin-top: 3rem;
}
svg {
  max-width: 200px;
}
.p-button-link {
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
</style>
