import type { BaseJourney, Journey } from '~/types/activity'
// import { getColoredBackgroundFromActivtyType, getComplementaryColor } from '~/utils/color/activityType'

export function recapJourneyInformation(journey: BaseJourney | Journey) {
//   const color = getColoredBackgroundFromActivtyType(journey.type).name
//   const compColor = getComplementaryColor(color)
  const finalColor = 'pink'

  const recapInformation = [
    {
      label: 'Sortie le',
      content: String(journey.date),
      iconName: 'CalendarStar',
      iconColor: finalColor,
      iconSize: 20,
    },
  ]

  return recapInformation
}
