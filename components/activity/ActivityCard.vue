<script setup lang="ts">
import DOMPurify from "dompurify";

const { activity } = defineProps<{
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
const sanitizedDescription = computed(() => {
  return DOMPurify.sanitize(activity.description);
});
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
      <div class="activity-desc" v-html="sanitizedDescription"></div>
    </template>
    <template #footer>
      <p class="activity-address">
        📍 {{ activity.address_street }}, {{ activity.address_zipcode }}
        {{ activity.address_city }}
      </p>
    </template>
  </Card>
</template>

<style scoped>
.activity-image {
  width: 100%;
  object-fit: cover;
}
.activity-desc {
  max-height: 8rem;
  overflow: hidden;
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
