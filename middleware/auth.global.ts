// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return;

  const { $pinia } = useNuxtApp();
  const userStore = useUserStore($pinia);

  // Attendre que l'initialisation soit terminée
  if (userStore.loading) {
    await new Promise<void>((resolve) => {
      const checkLoading = () => {
        if (!userStore.loading) {
          resolve();
        } else {
          setTimeout(checkLoading, 50);
        }
      };
      checkLoading();
    });
  }

  // Maintenant on peut vérifier l'utilisateur en sécurité
  if (
    !userStore.user &&
    to.path !== "/auth/login" &&
    to.path !== "/auth/register"
  ) {
    return navigateTo({
      path: "/auth/login",
      query: {
        redirect: to.fullPath,
      },
    });
  }
});
