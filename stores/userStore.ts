import { defineStore } from "pinia";
import { ref } from "vue";
import { useFirebaseAuth } from "vuefire";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import type { User } from "firebase/auth";
import type { FirebaseError } from "firebase-admin";
import type { FirestoreUser } from "~/types/user";
import { doc, getDoc, getFirestore } from "firebase/firestore";

export const useUserStore = defineStore("user", () => {
  const auth = useFirebaseAuth();
  const user = ref<User | null>(null);
  const userData = ref<FirestoreUser | null>(null);
  const db = getFirestore();

  const loading = ref(true);
  const error = ref<string | null>(null);
  const init = () => {
    if (!auth) return;

    loading.value = true;
    onAuthStateChanged(auth, async (u) => {
      user.value = u;
      loading.value = false;
      if (u) {
        await fetchUserData(u.uid);
      } else {
        userData.value = null;
      }
    });
  };
  const fetchUserData = async (uid: string) => {
    const docRef = doc(db, "users", uid);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      userData.value = snapshot.data() as FirestoreUser;
    }
  };
  const login = async (email: string, password: string) => {
    if (!auth) return;
    error.value = null;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      user.value = userCredential.user;
    } catch (err: unknown) {
      const firebaseErro = err as FirebaseError;
      error.value = firebaseErro.message;
      throw firebaseErro;
    }
  };

  const setUser = (u: User | null) => {
    user.value = u;
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
    user.value = null;
  };

  return {
    user,
    loading,
    error,
    init,
    login,
    logout,
    setUser,
    userData,
  };
});
