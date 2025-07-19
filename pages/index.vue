<script setup lang="ts">
const router = useRouter();
</script>

<template>
  <div class="landing">
    <!-- Hero -->
    <section class="hero">
      <div class="overlay"></div>
      <h1>Bienvenue sur Getaway</h1>
      <h2>
        Planifie des moments uniques selon tes envies, tes proches et ton
        humeur. Getaway te propose des idées de sorties, rien que pour toi.
      </h2>
      <div class="group-btn">
        <Button @click="router.push('/auth/register')" label="Démarrer" />
        <Button
          @click="router.push('/auth/login')"
          label="Se connecter"
          variant="outlined"
        />
      </div>
    </section>

    <!-- Fonctionnalités clés -->
    <section class="features">
      <h3>Comment ça marche ?</h3>
      <ul>
        <li>
          <p>🧠</p>
          <p>Réponds à quelques questions simples</p>
        </li>
        <li>
          <p>📍</p>
          <p>Obtiens un parcours d’activités & resto personnalisé</p>
        </li>
        <li>
          <p>💾</p>
          <p>Enregistre ta sortie et partage-la</p>
        </li>
      </ul>
    </section>

    <TestimonialSection />
  </div>
</template>
<style>
.landing {
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}
.hero {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  text-align: center;
  background-image: url("/assets/img/homepage.jpg");
  background-position: center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 100vh;
  padding: 2rem;
}
.hero .overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1;
}
.hero h1,
.hero h2,
.hero .group-btn {
  z-index: 2;
}
.hero h2 {
  font-weight: 500;
  font-size: large;
  max-width: 600px;
}

.hero .group-btn {
  max-width: 200px;
  margin: 1rem auto;

  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.features h3,
.testimonials h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  text-align: center;
}
.features {
  margin-top: 100vh;
}

.features ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.features li {
  text-align: center;
  max-width: 200px;
}

@media (min-width: 768px) {
  .features ul {
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
  }
}
</style>
