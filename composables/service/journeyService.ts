import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useFirestore } from "vuefire";
import type { Answer } from "~/types/answer";
import { DataBaseCollections } from "~/utils/const/databaseCollections";
import { formatJourneyFromDbToType } from "~/utils/journey/formatJourney";
import { ref } from "vue";
import {
  ACTIVITY_TYPES_SELECT_STRING,
  type ActivityApiType,
} from "~/utils/const/activityTypes";
import {
  ActivityType,
  type BaseJourney,
  type JourneyFromDB,
} from "~/types/journey";

const activityList = ref<ActivityApiType[]>([]);

type CompleteData = {
  isFullDay: boolean;
  activity1Id: string;
  activity2Id: string | null;
  restaurantId: string | null;
};

type Props = {
  journeyId: string;
  completeData: CompleteData;
};

export const fetchBaseJourneyFromId = async (
  journeyId: string
): Promise<BaseJourney | undefined> => {
  const db = useFirestore();
  if (!db) throw new Error("Firestore is not initialized");

  try {
    const journeyDocRef = doc(db, DataBaseCollections.sorties, journeyId);
    const journeyDocSnap = await getDoc(journeyDocRef);

    if (journeyDocSnap.exists()) {
      const data = journeyDocSnap.data() as Omit<JourneyFromDB, "id">;
      const journey = formatJourneyFromDbToType({ id: journeyId, ...data });
      return journey;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Erreur lors du fetch du journey:", error);
    return undefined;
  }
};

export const fetchBaseJourneyAnswersFromId = async (
  journeyId: string
): Promise<Answer[] | undefined> => {
  const db = useFirestore();
  if (!db) throw new Error("Firestore is not initialized");

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

const buildActivityQueryParams = (
  answers: Answer[],
  baseJourney: BaseJourney
) => {
  const limit = 30;
  const start = 0;

  const needPmr = baseJourney.needPMR ? "pmr='1'" : "";

  const isSomeoneCheap = answers
    .map((answer) => answer.activityPriceRange[0])
    .includes(0);
  const isFree = isSomeoneCheap ? "price_type='gratuit'" : "";

  const allTags = new Set(answers.flatMap((answer) => answer.activities));

  const tagFilter =
    baseJourney.type === ActivityType.random
      ? ""
      : Array.from(allTags)
          .map((tag) => `tags LIKE '%${tag}%'`)
          .join(" OR ");

  const publicFilter = journeyTypePublicFilterValues(baseJourney.type)
    .map((tag) => `tags LIKE '%${tag}%'`)
    .join(" OR ");

  const whereQuery = [needPmr, isFree, tagFilter, publicFilter]
    .filter(Boolean)
    .join(" and ");
  const encodedWhereQuery = encodeURIComponent(whereQuery);

  return `limit=${limit}&start=${start}&where=${encodedWhereQuery}&select=${ACTIVITY_TYPES_SELECT_STRING}`;
};

const journeyTypePublicFilterValues = (journeyType: ActivityType): string[] => {
  switch (journeyType) {
    case ActivityType.family:
      return [
        "Tout public",
        "Public tout-petits",
        "A partir de 3 ans",
        "Public jeune",
        "Public tout-petits et enfants",
      ];
    case ActivityType.friends:
      return ["A partir de 15 ans", "Public jeunes et adultes"];
    case ActivityType.romantic:
      return ["Public adulte", "A partir de 15 ans"];
    case ActivityType.random:
      return [];
  }
};

export const findActivityFromAnswers = async (
  answers: Answer[],
  baseJourney: BaseJourney
): Promise<ActivityApiType[]> => {
  const queryParams = buildActivityQueryParams(answers, baseJourney);
  const response = await fetch(
    `https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?${queryParams}`
  );

  if (!response.ok) throw new Error("Aucune activité trouvée");

  const data = await response.json();

  if (!data.results || data.results.length === 0)
    throw new Error("Aucune activité trouvée");

  return data.results as ActivityApiType[];
};

export const loadActivities = async (
  answers: Answer[],
  journey: BaseJourney
) => {
  try {
    const activities = await findActivityFromAnswers(answers, journey);
    activityList.value = activities;
  } catch (error) {
    console.error("Erreur chargement activités:", error);
  }
};

export const completeJourney = async ({ journeyId, completeData }: Props) => {
  const db = useFirestore();
  if (!db) throw new Error("Firestore is not initialized");

  const sortiesCollectionRef = collection(db, DataBaseCollections.sorties);
  const sortieRef = doc(sortiesCollectionRef, journeyId);

  const newFields = completeData.isFullDay
    ? {
        ACT_ID1: completeData.activity1Id,
        ACT_ID2: completeData.activity2Id,
        RES_ID: completeData.restaurantId,
      }
    : {
        ACT_ID1: completeData.activity1Id,
        RES_ID: completeData.restaurantId,
      };

  try {
    await updateDoc(sortieRef, newFields);
  } catch (error) {
    console.error("Error updating sortie:", error);
    throw error;
  }
};
