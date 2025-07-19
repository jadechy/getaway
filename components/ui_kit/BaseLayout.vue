<script setup lang="ts">
import Logo from "../assets/img/logo.svg?component";
const router = useRouter();
</script>

<template>
  <header>
    <nav>
      <Button asChild v-slot="slotProps" variant="link">
        <RouterLink to="/journey/generate" :class="slotProps.class"
          >Nouvelle sortie</RouterLink
        >
      </Button>
      <Button asChild v-slot="slotProps" variant="link">
        <RouterLink to="/journey/generate" :class="slotProps.class"
          >Sortie précédente</RouterLink
        >
      </Button>
      <Logo class="logo" @click="router.push('/')" />
      <Button asChild v-slot="slotProps" variant="link">
        <RouterLink to="/journey/all" :class="slotProps.class"
          >Mes sorties</RouterLink
        >
      </Button>
      <Button asChild v-slot="slotProps" variant="link">
        <RouterLink to="/profil" :class="slotProps.class">Profile</RouterLink>
      </Button>
    </nav>
  </header>
  <main>
    <slot />
  </main>
</template>
<style scoped>
header {
  margin-block: 30px;
  position: sticky;
  padding-inline: 20px;
}
nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}
main {
  padding-inline: 20px;
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
