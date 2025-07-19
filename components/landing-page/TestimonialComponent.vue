<script setup lang="ts">
export type TestimonialProps = {
  name: string;
  age: number;
  quote: string;
  avatar: string;
};
defineProps<{ testimonial: TestimonialProps; color: string }>();
</script>

<template>
  <div class="testimonial" :style="{ borderColor: `var(--p-${color}-500)` }">
    <Avatar :image="testimonial.avatar" shape="circle" class="avatar" />
    <div class="content">
      <p class="quote">{{ testimonial.quote }}</p>
      <span class="author"
        >— {{ testimonial.name }}
        <template v-if="testimonial.age"
          >, {{ testimonial.age }} ans</template
        ></span
      >
    </div>
  </div>
</template>

<style scoped>
.testimonial {
  display: flex;
  align-items: center;
  gap: 1rem;
  border-radius: 8px;
  border-width: 1px;
  border-style: solid;
  padding: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  height: 100%;
}

.avatar {
  width: 3rem;
  height: 3rem;
  font-size: 1.2rem;
  background-color: var(--primary-color);
  color: white;
}

.content {
  flex: 1;
  text-align: start;
}

.quote {
  margin: 0;
  font-weight: 500;
  color: var(--text-color);
}

.author {
  display: block;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}
</style>
