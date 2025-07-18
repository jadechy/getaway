import { getFirestore, collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { DataBaseCollections } from '~/utils/const/databaseCollections'

import type { createJourneyAnswers, Answer } from '~/types/answer'

import type { FirestoreUser } from '~/types/user'
import type { BaseJourney } from '~/types/activity'


export function useJourney() {
  const db = getFirestore()
  const auth = getAuth()

  async function createJourney(form: createJourneyAnswers): Promise<BaseJourney> {
    const formattedDate = form.journeyDate.toLocaleDateString('fr-FR')
    const formattedStart = form.journeyStartingTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    const formattedEnd = form.journeyEndingTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

    const docRef = await addDoc(collection(db, DataBaseCollections.sorties), {
      UTIL_ID: form.userId,
      SOR_JOURNEE: form.journeyIsFullDay,
      SOR_TITRE: form.journeyName,
      SOR_DATE: formattedDate,
      SOR_HEURE_DEB: formattedStart,
      SOR_HEURE_FIN: formattedEnd,
      SOR_NB_PRSN: form.journeyMemberNumber,
      SOR_PMR: form.journeyNeedPMR,
      SOR_TYPE: form.journeyActivityType
    })

    const sortieId = docRef.id

    await modifyUser(form.userId, sortieId, form.journeyIsFullDay)

    await createAnswer({
      id: null,
      sortieId,
      activities: form.answerActivityOptions,
      activityPriceRange: form.answerPriceRange,
      restaurant: form.answerRestaurantTypes,
      restoPriceRange: form.answerRestaurantPriceRange,
      isowner: true
    })

    return {
      id: sortieId,
      title: form.journeyName,
      type: form.journeyActivityType,
      date: form.journeyDate,
      timeStart: form.journeyStartingTime,
      timeFinish: form.journeyEndingTime,
      isFullDay: form.journeyIsFullDay,
      ownerId: form.userId,
      needPMR: form.journeyNeedPMR
    }
  }

  async function createAnswer(answer: Answer): Promise<void> {
    await addDoc(collection(db, DataBaseCollections.reponses), {
      sortieId: answer.sortieId,
      activities: answer.activities,
      activityPriceRange: answer.activityPriceRange,
      restaurant: answer.restaurant,
      restoPriceRange: answer.restoPriceRange,
      isowner: answer.isowner
    })
  }

  async function modifyUser(userId: string, sortieId: string, isFullDay: boolean): Promise<void> {
    const user = auth.currentUser
    if (!user || user.uid !== userId) return

    const userDoc = doc(db, 'users', userId)
    const userSnap = await getDoc(userDoc)

    if (!userSnap.exists()) return

    const userData = userSnap.data() as FirestoreUser
    const sorties = userData.util_sorties || []

    const updatedData = {
      ...userData,
      util_sorties: [
        ...sorties,
        { sor_id: sortieId, nb_activité: isFullDay ? 2 : 1 }
      ]
    }

    await updateDoc(userDoc, updatedData)
  }

  return {
    createJourney
  }
}
