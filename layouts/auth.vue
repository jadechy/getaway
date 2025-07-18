<script setup lang="ts">
import picture from "../assets/img/auth.jpg";
</script>

<template>
  <BaseLayout>
    <article>
      <section>
        <slot />
      </section>
      <img :src="picture" alt="" />
    </article>
  </BaseLayout>
</template>

<style scoped>
article {
  display: flex;
  flex-direction: column;
  gap: 30px;
}
img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
}
section {
  width: 100%;
}

@media (min-width: 768px) {
  article {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 40px;
  }

  img {
    width: 400px;
    height: 300px;
  }

  .content {
    flex: 1;
  }
}
</style>
