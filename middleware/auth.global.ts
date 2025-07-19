export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return;

  const { $pinia } = useNuxtApp();
  const userStore = useUserStore($pinia);

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

  if (
    !userStore.user &&
    to.path !== "/auth/login" &&
    to.path !== "/auth/register" &&
    to.path !== "/"
  ) {
    return navigateTo({
      path: "/auth/login",
      query: {
        redirect: to.fullPath,
      },
    });
  }
});
