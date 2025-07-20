// https://nuxt.com/docs/api/configuration/nuxt-config
import { MyPreset } from "./themes/mytheme";
import svgLoader from "vite-svg-loader";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "nuxt-vuefire",
    "@pinia/nuxt",
    "@primevue/nuxt-module",
  ],
  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Roboto&display=swap",
        },
      ],
    },
  },
  primevue: {
    options: {
      theme: {
        preset: MyPreset,
      },
    },
  },
  css: ["~/assets/css/main.css"],

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

      sessionCookie: true,
    },
    ssr: true,
  },

  components: [
    { path: "~/components", pathPrefix: false },
    { path: "~/components/ui_kit", pathPrefix: false },
    { path: "~/components/journey", pathPrefix: false },
    { path: "~/components/activity", pathPrefix: false },
    { path: "~/components/restaurant", pathPrefix: false },
  ],

  vite: {
    plugins: [svgLoader()],
  },
  typescript: { strict: true },
});