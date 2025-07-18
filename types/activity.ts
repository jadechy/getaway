import type { BaseJourney } from "./journey";
import type { Restaurant } from "./restaurant";

export type Journey = BaseJourney & {
  activitiesId: number[];
  restaurantId: string;
};

export type JourneyData = {
  journey: BaseJourney;
  restaurants: Restaurant | null;
};
