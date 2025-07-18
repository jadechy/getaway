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
import type { JourneyData } from "~/types/activity";
import { parseDateFrenchFormat, parseTimeString } from "~/utils/date";
import type { ActivityType, BaseJourney, JourneyFromDB } from "~/types/journey";
import type { Restaurant, RestaurantFromDB } from "~/types/restaurant";
const mapRawJourneyToJourney = (raw: JourneyFromDB): BaseJourney => {
  const date = parseDateFrenchFormat(raw.SOR_DATE);
  return {
    id: raw.id,
    type: raw.SOR_TYPE as ActivityType,
    title: raw.SOR_TITRE,
    date,
    timeStart: parseTimeString(date, raw.SOR_HEURE_DEB),
    timeFinish: parseTimeString(date, raw.SOR_HEURE_FIN),
    isFullDay: raw.SOR_JOURNEE,
    ownerId: raw.UTIL_ID,
    needPMR: raw.SOR_PMR,
  };
};
const mapRawRestaurantToRestaurant = (raw: RestaurantFromDB): Restaurant => {
  return {
    id: raw.id,
    address: raw.REST_ADREESSE,
    amis: Boolean(raw.REST_AMIS),
    couple: Boolean(raw.REST_COUPLE),
    famille: Boolean(raw.REST_FAMILLE),
    metro: raw.REST_METRO,
    title: raw.REST_NOM,
    prix_max: Number(raw.REST_PRIX_MAX),
    prix_min: Number(raw.REST_PRIX_MIN),
    type: raw.REST_TYPE,
    openingHour: raw.REST_HEURE_OUV ? Number(raw.REST_HEURE_OUV) : undefined,
    closingHour: raw.REST_HEURE_FERM ? Number(raw.REST_HEURE_FERM) : undefined,
    rateOutOf5: raw.REST_NOTE ? Number(raw.REST_NOTE) : undefined,
  };
};

export const useJourney = () => {
  const db = getFirestore();
  const auth = getAuth();
  const { user } = useUserStore();
  const createJourney = async (
    form: createJourneyAnswers
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

    // On parse les activités
    const activitiesId = [];
    if (data.ACT_FINAL1) activitiesId.push(Number(data.ACT_FINAL1));
    if (data.ACT_FINAL2) activitiesId.push(Number(data.ACT_FINAL2));
    const rawData = data as JourneyFromDB;
    rawData.id = snapshot.id;
    const journey = mapRawJourneyToJourney(rawData);
    // const [day, month, year] = data.SOR_DATE.split("/").map(Number);
    // const date = new Date(year, month - 1, day);
    // const sortie: Journey = {
    //   id: snapshot.id,
    //   title: data.SOR_TITRE,
    //   type: data.SOR_TYPE,
    //   date: date,
    //   timeStart: new Date(`${data.SOR_DATE}T${data.SOR_HEURE_DEB}`),
    //   timeFinish: new Date(`${data.SOR_DATE}T${data.SOR_HEURE_FIN}`),
    //   isFullDay: data.SOR_JOURNEE,
    //   ownerId: data.UTIL_ID,
    //   needPMR: data.SOR_PMR,
    //   activitiesId,
    //   restaurantId: data.RES_ID ?? "",
    // };
    let restaurant: Restaurant | null = null;
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
    return {
      journey,
      restaurants: restaurant,
    };
  };
  return {
    createJourney,
    fetchJourneysByUser,
    fetchJourneyById,
  };
};
