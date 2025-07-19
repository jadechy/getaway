import type { BaseJourney } from "./journey";
import type { Restaurant } from "./restaurant";
export type ActivityApiType = {
  id: number;
  url: string;
  title: string;
  description: string;
  cover_url: string;
  cover_alt: string;
  tags: string[];
  address_name: string;
  address_street: string;
  address_zipcode: string;
  address_city: string;
  lat_lon: string;
  pmr: string;
  transport: string;
  price_type: string;
  price_detail: string;
  access_link: string;
  title_event: string;
  audience: string;
};
export type Journey = BaseJourney & {
  activitiesId: number[];
  restaurantId: string;
};

export type JourneyData = BaseJourney & {
  restaurant?: Restaurant;
  activities?: ActivityApiType[];
};
