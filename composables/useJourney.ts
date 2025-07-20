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
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { DataBaseCollections } from "~/utils/const/databaseCollections";
import type { CreateJourneyAnswers, Answer } from "~/types/answer";
import type { FirestoreUser } from "~/types/user";
import type { Restaurant, RestaurantFromDB } from "~/types/restaurant";
import {
  ActivityType,
  type BaseJourney,
  type JourneyFromDB,
} from "~/types/journey";
import type { ActivityApiType, JourneyData } from "~/types/activity";
import {
  mapRawJourneyToJourney,
  mapRawRestaurantToRestaurant,
} from "~/utils/formatJourney";
import {fetchActivityFromId} from "@/composables/service/journeyService";

export const useJourney = () => {
  const db = getFirestore();
  const auth = getAuth();
  const { user } = useUserStore();
  const router = useRouter();
  const createJourney = async (
    form: CreateJourneyAnswers
  ): Promise<BaseJourney> => {
    const formattedDate = form.journeyDate.toLocaleDateString("fr-FR");
    const formattedStart = form.journeyStartingTime.toLocaleTimeString(
      "fr-FR",
      { hour: "2-digit", minute: "2-digit" }
    );
    const formattedEnd = form.journeyEndingTime.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // TODO : Changer le mot sorties en journeys
    // TODO : CHanger le format SOR_DATE de string pour passer en date
    // ? Même principe pour le heure deb et heure fin
    const docRef = await addDoc(collection(db, DataBaseCollections.sorties), {
      UTIL_ID: user?.uid,
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
      activities: form.activity.types,
      activityPriceRange: form.activity.priceRange,
      restaurant: form.restaurant.types,
      restoPriceRange: form.restaurant.priceRange,
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
  };

  const createAnswer = async (answer: Answer): Promise<void> => {
    await addDoc(collection(db, DataBaseCollections.reponses), {
      sortieId: answer.sortieId,
      activities: answer.activities,
      activityPriceRange: answer.activityPriceRange,
      restaurant: answer.restaurant,
      restoPriceRange: answer.restoPriceRange,
      isowner: answer.isowner,
    });
  };

  const modifyUser = async (
    userId: string,
    sortieId: string,
    isFullDay: boolean
  ): Promise<void> => {
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
  };

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

  const fetchJourneysByUser = async (): Promise<BaseJourney[]> => {
    if (!user?.uid) {
      console.warn("fetchJourneysByUser called with undefined userId");
      return [];
    }
    // TODO : Changer le mot sorties en journeys
    const journeysCol = collection(db, "sorties");
    const q = query(journeysCol, where("UTIL_ID", "==", user?.uid));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const rawData = doc.data() as JourneyFromDB;
      rawData.id = doc.id;
      return mapRawJourneyToJourney(rawData);
    });
  };

  const fetchJourneyById = async ({
    journeyId,
  }: {
    journeyId: string;
  }): Promise<JourneyData | null> => {
    // TODO : Changer le mot sorties en journeys
    const docRef = doc(db, DataBaseCollections.sorties, journeyId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    const data = snapshot.data();
    const activitiesId = [];
    if (data.ACT_ID1) activitiesId.push(Number(data.ACT_ID1));
    if (data.ACT_ID2) activitiesId.push(Number(data.ACT_ID2));
    const rawData = {
      ...data,
      id: snapshot.id,
      ACT_ID1: data.ACT_ID1 ? Number(data.ACT_ID1) : undefined,
      ACT_ID2: data.ACT_ID2 ? Number(data.ACT_ID2) : undefined,
    } as JourneyFromDB;
    rawData.id = snapshot.id;
    const journey = mapRawJourneyToJourney(rawData);
    let restaurant: Restaurant | undefined;
    if (data.RES_ID) {
      const restoSnap = await getDoc(
        doc(db, DataBaseCollections.restaurants, data.RES_ID)
      );

      if (restoSnap.exists()) {
        const rawRestaunt = {
          id: restoSnap.id,
          ...restoSnap.data(),
        } as RestaurantFromDB;
        restaurant = mapRawRestaurantToRestaurant(rawRestaunt);
      }
    }
    let activities: ActivityApiType[] | undefined;
    if (activitiesId.length > 0) {
      const activitiesResults = await Promise.all(
        activitiesId.map(id => fetchActivityFromId(id))
      );
      activities = activitiesResults.filter(
        (activity): activity is ActivityApiType => activity !== null
      );
    }
    return {
      ...journey,
      restaurant: restaurant,
      activities: activities
    };
  };

  const fetchAnswersByJourneyId = async ({
    journeyId,
  }: {
    journeyId: string;
  }): Promise<Answer[] | undefined> => {
    try {
      const answersColRef = collection(db, DataBaseCollections.reponses);
      const q = query(answersColRef, where("sortieId", "==", journeyId));
      const querySnapshot = await getDocs(q);

      const answers: Answer[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Answer;
        answers.push(data);
      });

      return answers;
    } catch (error) {
      console.error("Erreur lors du fetch des réponses:", error);
      return undefined;
    }
  };

  const deleteJourney = async ({ journeyId }: { journeyId: string }) => {
    try {
      if (!auth.currentUser) return;

      const journeyRef = doc(db, DataBaseCollections.sorties, journeyId);
      await deleteDoc(journeyRef);

      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) return;

      const userData = userSnap.data() as FirestoreUser;
      const sorties = userData.util_sorties || [];

      const updatedSorties = sorties.filter((s) => s.sor_id !== journeyId);

      await updateDoc(userRef, {
        ...userData,
        util_sorties: updatedSorties,
      });

      console.log("Sortie supprimée avec succès !");
      router.push("/journey/all");
    } catch (error) {
      console.error("Erreur lors de la suppression de la sortie :", error);
      throw error;
    }
  };
  return {
    createJourney,
    fetchJourneysByUser,
    fetchJourneyById,
    searchRestaurantsByTypes,
    fetchAnswersByJourneyId,
    deleteJourney,
  };
};
