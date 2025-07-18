// middleware/auth.ts
export default defineNuxtRouteMiddleware(() => {
  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)

  if (!user.value) {
    return navigateTo('/auth/login')
  }
})
