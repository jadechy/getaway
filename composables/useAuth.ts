import { createUserWithEmailAndPassword } from 'firebase/auth'
import { setDoc, doc, collection } from 'firebase/firestore'
import { useFirebaseAuth, useFirestore } from 'vuefire'
import { FirestoreUserSchema } from '~/types/user'

export const useAuth = () => {
  const auth = useFirebaseAuth()
  const db = useFirestore()
  const userStore = useUserStore()

  const registerUser = async (userSignup: {
    email: string
    password: string
    firstName: string
    lastName: string
  }) => {
    if (!auth || !db) throw new Error('Firebase not initialized')

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userSignup.email,
      userSignup.password
    )

    const user = userCredential.user
    userStore.setUser(user) 

    const userData = {
      util_id: user.uid,
      util_prenom: userSignup.firstName,
      util_nom: userSignup.lastName,
      util_mail: userSignup.email,
      util_sorties: [],
    }

    FirestoreUserSchema.parse(userData)

    await setDoc(doc(collection(db, 'users'), user.uid), userData)

    // await setDoc(doc(collection(db, 'users'), user.uid), {
    //   util_id: user.uid,
    //   util_prenom: userSignup.firstName,
    //   util_nom: userSignup.lastName,
    //   util_mail: userSignup.email,
    //   util_sorties: [],
    // })

    return user
  }

  return { registerUser }
}
