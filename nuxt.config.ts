// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { MyPreset } from "./themes/mytheme";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "nuxt-vuefire",
    "@pinia/nuxt",
    "@primevue/nuxt-module"
  ],

  primevue: {
    options: {
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: false,
          cssLayer: {
            name: "primevue",
            order: "theme, base, primevue",
          },
        },
      },
    },
  },
  css: ["primeicons/primeicons.css", "~/assets/css/main.css"],

  vuefire: {
    config: {
      apiKey: "AIzaSyDyPHivLoP5kXFLbiS20GpoC1pEOF5cktQ",
      authDomain: "getaway-e1d3b.firebaseapp.com",
      projectId: "getaway-e1d3b",
      storageBucket: "getaway-e1d3b.firebasestorage.app",
      messagingSenderId: "1005396245602",
      appId: "1:1005396245602:web:0fe2d63f1464e215f8a53b",
      measurementId: "G-BYGXW9KYQZ",
    },
    auth: {
      enabled: true,
    },
  },

  components: [
    { path: "~/components", pathPrefix: false },
    { path: "~/components/ui-kit", pathPrefix: false }
  ],

  vite: {
    plugins: [tailwindcss()],
  },
  typescript: { strict: true },
});
