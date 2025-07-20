<script setup lang="ts">
import { ref } from "vue";
import Logo from "~/assets/img/logo.svg?component";

const router = useRouter();
const showSidebar = ref(false);
const { user } = storeToRefs(useUserStore());
</script>

<template>
  <ClientOnly>
    <header class="site-header" v-if="user">
      <div class="mobile-header">
        <Button
          icon="pi pi-bars"
          class="burger-btn"
          @click="showSidebar = true"
          text
        />
        <Logo class="logo" @click="router.push('/home')" />
      </div>

      <nav class="desktop-nav">
        <RouterLink to="/journey/generate">Nouvelle sortie</RouterLink>
        <RouterLink to="/journey/generate">Résultat</RouterLink>
        <Logo class="logo" @click="router.push('/home')" />
        <RouterLink to="/journey/all">Sorties enregistrées</RouterLink>
        <RouterLink to="/profil">Profil</RouterLink>
      </nav>

      <Sidebar
        v-model:visible="showSidebar"
        position="left"
        class="mobile-sidebar"
      >
        <div class="sidebar-links">
          <RouterLink to="/journey/generate" @click="showSidebar = false"
            >Nouvelle sortie</RouterLink
          >
          <RouterLink to="/journey/generate" @click="showSidebar = false"
            >Résultat</RouterLink
          >
          <RouterLink to="/journey/all" @click="showSidebar = false"
            >Sorties enregistrées</RouterLink
          >
          <RouterLink to="/profil" @click="showSidebar = false"
            >Profil</RouterLink
          >
        </div>
      </Sidebar>
    </header>
    <header v-else class="site-header-default site-header">
      <nav>
        <Logo class="logo" @click="router.push('/')" />
        <RouterLink to="/auth/login">Connexion</RouterLink>
      </nav>
    </header>
  </ClientOnly>
</template>

<style scoped>
.site-header {
  padding: 1.75rem 1rem;
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: var(--p-surface-900);
}

.mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  width: 6rem;
  cursor: pointer;
}

.desktop-nav {
  display: none;
}

.mobile-sidebar .sidebar-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
}

a {
  text-decoration: none;
  color: var(--p-primary-color);
  &:hover {
    text-decoration: underline;
  }
}
.desktop-nav a.router-link-active,
.mobile-sidebar a.router-link-active {
  color: white !important;
  font-weight: bold;
}

.site-header-default {
  width: 100%;
  nav {
    display: flex;
    justify-content: space-between;
  }
}
</style>

<!-- Responsive styles -->
<style scoped>
@media (min-width: 768px) {
  .mobile-header {
    display: none;
  }

  .desktop-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }

  .logo {
    width: 8rem;
  }
}
</style>
