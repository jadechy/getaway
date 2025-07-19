import type { Journey } from "~/types/activity";
import type { BaseJourney } from "~/types/journey";

export function recapJourneyInformation(journey: BaseJourney | Journey) {
  const finalColor = "pink";

  const recapInformation = [
    {
      label: "Sortie le",
      content: String(journey.date),
      iconName: "CalendarStar",
      iconColor: finalColor,
      iconSize: 20,
    },
  ];

  return recapInformation;
}
