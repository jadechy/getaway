<script setup lang="ts">
defineProps<{
  address: string;
}>();
</script>

<template>
  <div class="map-container">
    <iframe
      class="map-iframe"
      :src="`https://www.google.com/maps?q=${encodeURIComponent(
        address
      )}&output=embed`"
      loading="lazy"
      allowfullscreen
      referrerpolicy="no-referrer-when-downgrade"
    />
  </div>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.map-iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
