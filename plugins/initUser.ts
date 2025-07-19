import { defineNuxtPlugin } from "nuxt/app";
import { useUserStore } from "../stores/userStore";

export default defineNuxtPlugin(() => {
  const userStore = useUserStore();
  userStore.init();
});
