import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { DataBaseCollections } from "~/utils/const/databaseCollections";

import type { createJourneyAnswers, Answer } from "~/types/answer";

import type { FirestoreUser } from "~/types/user";
import type { Restaurant } from "~/types/restaurant";
import { ActivityType, type BaseJourney } from "~/types/activity";

export function useJourney() {
  const db = getFirestore();
  const auth = getAuth();

  async function createJourney(
    form: createJourneyAnswers
  ): Promise<BaseJourney> {
    const formattedDate = form.journeyDate.toLocaleDateString("fr-FR");
    const formattedStart = form.journeyStartingTime.toLocaleTimeString(
      "fr-FR",
      { hour: "2-digit", minute: "2-digit" }
    );
    const formattedEnd = form.journeyEndingTime.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const docRef = await addDoc(collection(db, DataBaseCollections.sorties), {
      UTIL_ID: form.userId,
      SOR_JOURNEE: form.journeyIsFullDay,
      SOR_TITRE: form.journeyName,
      SOR_DATE: formattedDate,
      SOR_HEURE_DEB: formattedStart,
      SOR_HEURE_FIN: formattedEnd,
      SOR_NB_PRSN: form.journeyMemberNumber,
      SOR_PMR: form.journeyNeedPMR,
      SOR_TYPE: form.journeyActivityType,
    });

    const sortieId = docRef.id;

    await modifyUser(form.userId, sortieId, form.journeyIsFullDay);

    await createAnswer({
      id: null,
      sortieId,
      activities: form.answerActivityOptions,
      activityPriceRange: form.answerPriceRange,
      restaurant: form.answerRestaurantTypes,
      restoPriceRange: form.answerRestaurantPriceRange,
      isowner: true,
    });

    return {
      id: sortieId,
      title: form.journeyName,
      type: form.journeyActivityType,
      date: form.journeyDate,
      timeStart: form.journeyStartingTime,
      timeFinish: form.journeyEndingTime,
      isFullDay: form.journeyIsFullDay,
      ownerId: form.userId,
      needPMR: form.journeyNeedPMR,
    };
  }

  async function createAnswer(answer: Answer): Promise<void> {
    await addDoc(collection(db, DataBaseCollections.reponses), {
      sortieId: answer.sortieId,
      activities: answer.activities,
      activityPriceRange: answer.activityPriceRange,
      restaurant: answer.restaurant,
      restoPriceRange: answer.restoPriceRange,
      isowner: answer.isowner,
    });
  }

  async function modifyUser(
    userId: string,
    sortieId: string,
    isFullDay: boolean
  ): Promise<void> {
    const user = auth.currentUser;
    if (!user || user.uid !== userId) return;

    const userDoc = doc(db, "users", userId);
    const userSnap = await getDoc(userDoc);

    if (!userSnap.exists()) return;

    const userData = userSnap.data() as FirestoreUser;
    const sorties = userData.util_sorties || [];

    const updatedData = {
      ...userData,
      util_sorties: [
        ...sorties,
        { sor_id: sortieId, nb_activité: isFullDay ? 2 : 1 },
      ],
    };

    await updateDoc(userDoc, updatedData);
  }
  const searchRestaurantsByTypes = async (
    types: string[],
    sortieType: ActivityType,
    prixMax: number
  ): Promise<Restaurant[]> => {
    try {
      const restaurantsCollectionRef = collection(
        db,
        DataBaseCollections.restaurants
      );

      let q;

      if (sortieType === ActivityType.random) {
        q = query(restaurantsCollectionRef);
      } else {
        q = query(
          restaurantsCollectionRef,
          where("REST_TYPE", "in", types),
          where(journeyTypeQueryParam(sortieType), "==", true)
        );
      }

      const querySnapshot = await getDocs(q);

      const matchingRestaurants = querySnapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            address: data.REST_ADRESSE,
            amis: data.REST_AMIS,
            couple: data.REST_COUPLE,
            famille: data.REST_FAMILLE,
            metro: data.REST_METRO,
            title: data.REST_NOM,
            prix_max: Number(data.REST_PRIX_MAX),
            prix_min: Number(data.REST_PRIX_MIN),
            type: data.REST_TYPE,
          } as Restaurant;
        })
        .filter((restaurant) => restaurant.prix_max <= prixMax);

      return matchingRestaurants;
    } catch (error) {
      console.error("Erreur lors de la recherche des restaurants :", error);
      throw error;
    }
  };
  return {
    createJourney,
    searchRestaurantsByTypes,
  };
}

const journeyTypeQueryParam = (
  type: ActivityType
): "REST_FAMILLE" | "REST_AMIS" | "REST_COUPLE" => {
  switch (type) {
    case ActivityType.family:
      return "REST_FAMILLE";
    case ActivityType.friends:
      return "REST_AMIS";
    case ActivityType.romantic:
      return "REST_COUPLE";
    default:
      return "REST_AMIS";
  }
};
