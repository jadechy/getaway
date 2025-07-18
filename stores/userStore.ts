import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useFirebaseAuth } from 'vuefire'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import type { User } from 'firebase/auth'

export const useUserStore = defineStore('user', () => {
  const auth = useFirebaseAuth()
  const user = ref<User | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  const init = () => {
    if (!auth) return
    onAuthStateChanged(auth, (u) => {
      user.value = u
      loading.value = false
    })
  }

  const login = async (email: string, password: string) => {
    if (!auth) return
    error.value = null
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const setUser = (u: User | null) => {
    user.value = u
  }

  const logout = async () => {
    if (!auth) return
    await signOut(auth)
    user.value = null
  }

  return {
    user,
    loading,
    error,
    init,
    login,
    logout,
    setUser
  }
})
