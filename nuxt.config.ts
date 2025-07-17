// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    'nuxt-vuefire'
  ],

  vuefire: {
    config: {
      apiKey: 'AIzaSyDyPHivLoP5kXFLbiS20GpoC1pEOF5cktQ',
      authDomain: 'getaway-e1d3b.firebaseapp.com',
      projectId: 'getaway-e1d3b',
      storageBucket: 'getaway-e1d3b.firebasestorage.app',
      messagingSenderId: '1005396245602',
      appId: '1:1005396245602:web:0fe2d63f1464e215f8a53b',
      measurementId: 'G-BYGXW9KYQZ'
    },
    auth: {
      enabled: true
    }
  }
})