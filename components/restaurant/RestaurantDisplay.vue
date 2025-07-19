<script setup lang="ts">
const props = defineProps<{
  restaurant: {
    id: string;
    title: string;
    type: string;
    prix_min: number;
    prix_max: number;
    metro: string;
    couple: boolean;
    amis: boolean;
    famille: boolean;
  };
}>();

const audienceIcons = computed(() => {
  const icons: string[] = [];
  if (props.restaurant.couple) icons.push("❤️ Couple");
  if (props.restaurant.amis) icons.push("👫 Amis");
  if (props.restaurant.famille) icons.push("👨‍👩‍👧‍👦 Famille");
  return icons;
});

function formatType(type: string): string {
  return type
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}
</script>

<template>
  <Card class="restaurant-display">
    <template #title> 🍽️ {{ restaurant.title }}</template>
    <template #content>
      <p class="restaurant-type">👨‍🍳 {{ formatType(restaurant.type) }}</p>
      <p class="restaurant-price">
        💰 {{ restaurant.prix_min }}€ – {{ restaurant.prix_max }}€
      </p>
      <p class="restaurant-metro">🚇 {{ restaurant.metro }}</p>
    </template>
    <template #footer>
      <div class="restaurant-audience">
        <span v-for="icon in audienceIcons" :key="icon" class="audience-tag">
          {{ icon }}
        </span>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.restaurant-type,
.restaurant-price,
.restaurant-metro {
  margin: 0.25rem 0;
}

.restaurant-audience {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}

.audience-tag {
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.8rem;
}
</style>
