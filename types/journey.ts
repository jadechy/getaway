export type DatabaseJourney = {
  id: string
  SOR_TITRE: string
  SOR_TYPE: string
  SOR_DATE: string
  SOR_HEURE_DEB: string
  SOR_HEURE_FIN: string
  SOR_JOURNEE: boolean
  UTIL_ID: string
  SOR_PMR: boolean
  ACT_ID1?: number
  ACT_ID2?: number
  RES_ID?: string
}

export type Step = {
  isRestaurant: boolean,
  types: string[],
  name: string, 
  price: number | string, 
  adress: string,
  startingHour: any, 
  endingHour: any, 
  description?: string, 
  img?: { 
    url: string,
    alt: string,
  }
}
