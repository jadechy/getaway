import type { Answer } from "~/types/answer";
import type { ActivityApiType, JourneyData } from "~/types/activity";
import { ActivityType } from "~/types/journey";
import { ACTIVITY_TYPES_SELECT_STRING } from "~/utils/const/activityTypes";

export const useActivity = () => {
  const journeyTypePublicFilterValues = (
    journeyType: ActivityType
  ): string[] => {
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
  const buildActivityQueryParams = (
    answers: Answer[],
    baseJourney: JourneyData
  ) => {
    const limit = 30;
    const start = 0;
    const needPmr = baseJourney.needPMR ? "pmr='1'" : "";

    const isSomeoneCheap = answers
      .map((answer) => answer.activityPriceRange[0])
      .includes(0);
    const isFree = isSomeoneCheap ? "price_type='gratuit'" : "";

    const allTags = answers.flatMap((answer) => answer.activities);
    const tagFilter = allTags
      ? Array.from(allTags)
          .map((tag) => `qfap_tags LIKE '%${tag}%'`)
          .join(" OR ")
      : "";
    const publicFilter = journeyTypePublicFilterValues(baseJourney.type)
      .map((tag) => `audience LIKE '%${tag}%'`)
      .join(" OR ");

    const whereQuery = [needPmr, isFree, tagFilter, publicFilter]
      .filter(Boolean)
      .join(" and ");
    const encodedWhereQuery = encodeURIComponent(whereQuery);
    return `limit=${limit}&start=${start}&where=${encodedWhereQuery}&select=${ACTIVITY_TYPES_SELECT_STRING}`;
  };
  const fetchActivityFromId = async (
    activityId: number
  ): Promise<ActivityApiType | null> => {
    const where = encodeURIComponent(`id='${activityId}'`);
    const queryParams = `limit=1&start=0&where=${where}&select=${ACTIVITY_TYPES_SELECT_STRING}`;
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
  const findActivityFromAnswers = async (
    answers: Answer[],
    baseJourney: JourneyData
  ): Promise<ActivityApiType[]> => {
    const queryParams = buildActivityQueryParams(answers, baseJourney);
    const response = await fetch(
      `https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?${queryParams}`
    );

    const data = await response.json();

    return data.results as ActivityApiType[];
  };

  return {
    findActivityFromAnswers,
    fetchActivityFromId,
  };
};
