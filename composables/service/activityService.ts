import { useQuery } from '@tanstack/vue-query'
import { ActivityType } from '~/types/activity'

type FetchParams = {
  pmr: boolean
  type: ActivityType
  date: string
  categories: string[]
  price: 'gratuit' | 'payant'
}

export function useActivitiesQuery(params: FetchParams) {
  return useQuery({
    queryKey: ['activities', params],
    queryFn: () => fetchActivities(params),
    staleTime: 1000 * 60 * 5, // 5 min
  })
}

async function fetchActivities(params: FetchParams): Promise<string[]> {
  const { pmr, type, date, categories, price } = params
  const limit = 100
  const uniqueIds: string[] = []
  let start = 0

  for (let i = 0; i < 3050; i++) {
    const url = `https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=${limit}&start=${start}`

    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch data from API')

    const data = await res.json()

    if (!data?.results?.length) break

    for (const result of data.results) {
      const tags: string[] = result.tags || []
      const isPMR = result.pmr === 1
      if (!tags.length) continue

      const matchesCategory = type === 'random' || tags.some(tag => categories.includes(tag))
      if (!matchesCategory) continue

      if (pmr !== isPMR) continue

      const startDate = new Date(result.date_start)
      const endDate = new Date(result.date_end)
      const activityDate = new Date(date)

      if (activityDate < startDate || activityDate > endDate) continue

      const audience: string[] = result.audience || []

      const matchAudience = () => {
        const includes = (list: string[]) => list.some(a => audience.includes(a))
        const excludes = (list: string[]) => list.every(a => !audience.includes(a))

        if (type === 'family') {
          return includes(['Tout public', 'Public tout-petits', 'A partir de 3 ans', 'Public jeune', 'Public tout-petits et enfants'])
        }
        if (type === 'romantic') {
          return includes(['Public adulte', 'A partir de 15 ans']) && excludes(['Jusqu\'à 15 ans', 'Jusqu\'à 1 an', 'Public tout-petits'])
        }
        if (type === 'friends') {
          return includes(['A partir de 15 ans', 'Public jeunes et adultes']) && excludes(['Jusqu\'à 1 an', 'Public tout-petits'])
        }
        return true
      }

      if (!matchAudience()) continue

      if (price === 'gratuit' && result.price_type !== 'gratuit') continue

      uniqueIds.push(result.id)
    }

    start += limit
  }

  return uniqueIds
}
