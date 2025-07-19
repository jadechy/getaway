<script setup lang="ts">
import { ref } from "vue";
import { testimonials } from "~/data/testimonials";
const responsiveOptions = ref([
  {
    breakpoint: "1400px",
    numVisible: 3,
    numScroll: 1,
  },
  {
    breakpoint: "1199px",
    numVisible: 3,
    numScroll: 1,
  },
  {
    breakpoint: "767px",
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: "575px",
    numVisible: 1,
    numScroll: 1,
  },
]);
</script>

<template>
  <section class="testimonials">
    <h3>Ils ont testé Getaway</h3>
    <Carousel
      :value="testimonials"
      :numVisible="1"
      :numScroll="1"
      :autoplayInterval="4000"
      :circular="true"
      :showIndicators="false"
      :showNavigators="false"
      :responsiveOptions="responsiveOptions"
    >
      <template #item="slotProps">
        <div class="testimonial-card">
          <TestimonialComponent :testimonial="slotProps.data" color="orange" />
        </div>
      </template>
    </Carousel>
  </section>
</template>

<style scoped>
.testimonial-card {
  max-width: 320px;
  margin: 0 auto;
  padding: 1.5rem;
}
</style>
