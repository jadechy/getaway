import type { ActivityType, BaseJourney, Journey } from "~/types/activity"
import type { DatabaseJourney } from "~/types/journey"

export function formatJourneyFromDbToType(databaseJourney: DatabaseJourney): BaseJourney | Journey {
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
  }

  if (databaseJourney.ACT_ID1 !== undefined && databaseJourney.ACT_ID2 !== undefined && databaseJourney.RES_ID) {
    const journey: Journey = {
      ...base,
      activitiesId: [databaseJourney.ACT_ID1, databaseJourney.ACT_ID2],
      restaurantId: databaseJourney.RES_ID,
    }
    return journey
  }

  return base
}