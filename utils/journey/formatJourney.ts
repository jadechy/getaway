import type { Journey } from "~/types/activity";
import type { ActivityType, BaseJourney, JourneyFromDB } from "~/types/journey";
import type { Restaurant, RestaurantFromDB } from "~/types/restaurant";

export function formatJourneyFromDbToType(
  databaseJourney: JourneyFromDB
): BaseJourney | Journey {
  const base: BaseJourney = {
    id: databaseJourney.id,
    title: databaseJourney.SOR_TITRE,
    type: databaseJourney.SOR_TYPE as ActivityType,
    date: new Date(databaseJourney.SOR_DATE),
    timeStart: new Date(databaseJourney.SOR_HEURE_DEB),
    timeFinish: new Date(databaseJourney.SOR_HEURE_FIN),
    isFullDay: databaseJourney.SOR_JOURNEE,
    ownerId: databaseJourney.UTIL_ID,
    needPMR: databaseJourney.SOR_PMR,
  };

  if (
    databaseJourney.ACT_ID1 !== undefined &&
    databaseJourney.ACT_ID2 !== undefined &&
    databaseJourney.RES_ID
  ) {
    const journey: Journey = {
      ...base,
      activitiesId: [databaseJourney.ACT_ID1, databaseJourney.ACT_ID2],
      restaurantId: databaseJourney.RES_ID,
    };
    return journey;
  }

  return base;
}

export const mapRawJourneyToJourney = (raw: JourneyFromDB): Journey => {
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
    activitiesId: raw.ACT_ID1 && raw.ACT_ID2 ? [raw.ACT_ID1, raw.ACT_ID2] : [],
    restaurantId: raw.RES_ID,
  };
};
export const mapRawRestaurantToRestaurant = (
  raw: RestaurantFromDB
): Restaurant => {
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
