import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { setDoc, doc, collection } from "firebase/firestore";
import { useFirebaseAuth, useFirestore } from "vuefire";
import { FirestoreUserSchema } from "~/types/user";

export const useAuth = () => {
  const currentUser = ref<User | null>(null);
  const userStore = useUserStore();

  let auth: ReturnType<typeof useFirebaseAuth>;
  let db: ReturnType<typeof useFirestore>;

  onMounted(() => {
    auth = useFirebaseAuth();
    db = useFirestore();

    if (!auth) throw new Error("Firebase Auth non initialisé");
    if (!db) throw new Error("Firestore non initialisé");

    currentUser.value = auth.currentUser;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      currentUser.value = user;
      userStore.setUser(user);
    });

    onUnmounted(() => {
      unsubscribe();
    });
  });

  const registerUser = async (userSignup: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    if (!auth || !db) throw new Error("Firebase not initialized");

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userSignup.email,
      userSignup.password
    );

    const user = userCredential.user;
    userStore.setUser(user);

    const userData = {
      util_id: user.uid,
      util_prenom: userSignup.firstName,
      util_nom: userSignup.lastName,
      util_mail: userSignup.email,
      util_sorties: [],
    };

    FirestoreUserSchema.parse(userData);

    await setDoc(doc(collection(db, "users"), user.uid), userData);

    return user;
  };

  return { currentUser, registerUser };
};
