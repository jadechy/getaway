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
    console.log(allTags);
    const tagFilter = allTags
      ? Array.from(allTags)
          .map((tag) => `qfap_tags LIKE '%${tag}%'`)
          .join(" OR ")
      : "";
    const publicFilter = journeyTypePublicFilterValues(baseJourney.type)
      .map((tag) => `qfap_tags LIKE '%${tag}%'`)
      .join(" OR ");

    const whereQuery = [needPmr, isFree, tagFilter, publicFilter]
      .filter(Boolean)
      .join(" and ");
    const encodedWhereQuery = encodeURIComponent(whereQuery);
    return `limit=${limit}&start=${start}&where=${encodedWhereQuery}&select=${ACTIVITY_TYPES_SELECT_STRING}`;
  };
  const findActivityFromAnswers = async (
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

  return {
    findActivityFromAnswers,
  };
};
