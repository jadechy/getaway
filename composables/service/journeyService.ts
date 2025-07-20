import { collection, doc, updateDoc } from "firebase/firestore";
import { useFirestore } from "vuefire";
import type { Answer } from "~/types/answer";
import { DataBaseCollections } from "~/utils/const/databaseCollections";
import { ref } from "vue";
import { ACTIVITY_TYPES_SELECT_STRING } from "~/utils/const/activityTypes";
import {
  ActivityType,
  type BaseJourney,
  type JourneyFromDB,
} from "~/types/journey";
import type { ActivityApiType, JourneyData } from "~/types/activity";

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

const buildActivityQueryParamsFromId = (activityId: number): string => {
  const where = encodeURIComponent(`id='${activityId}'`);
  return `limit=1&start=0&where=${where}&select=${ACTIVITY_TYPES_SELECT_STRING}`;
};

export const fetchActivityFromId = async (activityId: number): Promise<ActivityApiType | null> => {
  const queryParams = buildActivityQueryParamsFromId(activityId);
  const url = `https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?${queryParams}`;

  try {
    const response = await $fetch<{ results: ActivityApiType[] }>(url);
    if (!response.results || response.results.length === 0) {
      return null;
    }
    return response.results[0];
  } catch (error) {
    console.error(`Erreur lors du fetch de l'activité ${activityId}`, error);
    return null;
  }
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
  baseJourney: JourneyData
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
