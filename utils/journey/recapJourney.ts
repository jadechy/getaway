import type { Journey } from "~/types/activity";
import type { BaseJourney } from "~/types/journey";

export function recapJourneyInformation(journey: BaseJourney) {
  const finalColor = "pink";
  console.log(journey);
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
