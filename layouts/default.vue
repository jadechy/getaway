<template>
  <header>
    <h1>Geteway</h1>
    <nav>
      <Button asChild v-slot="slotProps" variant="link">
        <RouterLink to="/" :class="slotProps.class">Accueil</RouterLink>
      </Button>
      <Button asChild v-slot="slotProps" variant="link">
        <RouterLink to="/my-journeys" :class="slotProps.class"
          >Ma journée</RouterLink
        >
      </Button>
      <Button asChild v-slot="slotProps" variant="link">
        <RouterLink to="/profile" :class="slotProps.class">Profile</RouterLink>
      </Button>
    </nav>
  </header>
  <main>
    <slot />
  </main>
</template>
<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  padding-inline: 20px;
}
main {
  padding-inline: 20px;
}
</style>
