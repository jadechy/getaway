<script setup lang="ts">
  defineProps<{
    activity: {
      title: string;
      description: string;
      cover_url: string;
      cover_alt: string;
      address_street: string;
      address_zipcode: string;
      address_city: string;
      url: string;
    };
  }>();
</script>

<template>
  <Card class="activity-card" style="max-width: 400px; overflow: hidden">
    <template #header>
      <img
        :src="activity.cover_url"
        :alt="activity.cover_alt"
        class="activity-image"
        loading="lazy"
      />
    </template>
    <template #title>{{ activity.title }}</template>

    <template #content>
      <div class="activity-desc">
        <p>{{ activity.description }}</p>
      </div>
    </template>
    <template #footer>
      <p class="activity-address">
        📍 {{ activity.address_street }}, {{ activity.address_zipcode }}
        {{ activity.address_city }}
      </p>
    </template>

    <!-- <Button
      label="En savoir plus"
      icon="pi pi-external-link"
      class="p-button-text p-button-sm"
      @click="window.open(activity.url, '_blank')"
    /> -->
  </Card>
</template>

<style scoped>
.activity-image {
  width: 100%;
  /* border-radius: 6px; */
  object-fit: cover;
  /*margin-bottom: 1rem;
  height: 220px; */
}
.activity-desc * {
  margin-block: 0.5rem;
}
.activity-address {
  color: var(--p-gray-600);
  font-style: italic;
  margin-block: 0;
}
</style>
