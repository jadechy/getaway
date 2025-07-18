export type Restaurant = {
  id: string;
  address: string;
  amis: boolean;
  couple: boolean;
  famille: boolean;
  metro: string;
  title: string;
  prix_max: number;
  prix_min: number;
  type: string;
  openingHour?: number;
  closingHour?: number;
  rateOutOf5?: number;
};

export type RestaurantFromDB = {
  id: string;
  REST_ADREESSE: string;
  REST_AMIS: boolean;
  REST_COUPLE: boolean;
  REST_FAMILLE: boolean;
  REST_METRO: string;
  REST_NOM: string;
  REST_PRIX_MAX: string;
  REST_PRIX_MIN: string;
  REST_TYPE: string;
  REST_HEURE_OUV?: string;
  REST_HEURE_FERM?: string;
  REST_NOTE?: string;
};
