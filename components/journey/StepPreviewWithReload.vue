<script setup lang="ts">
    defineProps<{
        reload: () => void
    }>()
</script>
<template>
  <div class="flex items-center space-x-4 w-full">
    <slot />
    <button
      class="p-2 transition-transform hover:rotate-180"
      aria-label="Recharger"
      @click="reload"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-gray-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 4v6h6M20 20v-6h-6M4 14a8 8 0 0113.856-5.856M20 10a8 8 0 01-13.856 5.856"
        />
      </svg>
    </button>
  </div>
</template>