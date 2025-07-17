import { initializeApp } from 'firebase/app'
import { getAuth } from "firebase/auth"
import { getFirestore } from 'firebase/firestore'
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'

export default defineNuxtPlugin(nuxtApp => {
    const config = useRuntimeConfig()

    const firebaseConfig = {
        apiKey: config.FIREBASE_PRIVATE_KEY as string,
        clientEmail: config.FIREBASE_CLIENT_EMAIL as string,
        projectId: config.FIREBASE_PROJECT_ID as string,
    };

    const app = initializeApp(firebaseConfig)

    const auth = getAuth(app)
    const firestore = getFirestore(app)

    nuxtApp.vueApp.provide('auth', auth)
    nuxtApp.provide('auth', auth)

    nuxtApp.vueApp.provide('firestore', firestore)
    nuxtApp.provide('firestore', firestore)
})